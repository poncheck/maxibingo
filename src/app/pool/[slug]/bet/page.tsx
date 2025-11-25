'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BetPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const predictedDate = formData.get('predictedDate') as string
        const isDonation = formData.get('isDonation') === 'on'
        const userName = formData.get('userName') as string

        try {
            // First, get pool details
            const poolResponse = await fetch(`/api/pools/${slug}`)
            if (!poolResponse.ok) {
                throw new Error('Pool not found')
            }
            const pool = await poolResponse.json()

            // Create bet and get checkout URL
            const betResponse = await fetch('/api/bets/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    poolId: pool.id,
                    predictedDate,
                    isDonation,
                    userName,
                }),
            })

            if (!betResponse.ok) {
                const errorData = await betResponse.json()
                throw new Error(errorData.error || 'Failed to create bet')
            }

            const { checkoutUrl } = await betResponse.json()

            // Redirect to Stripe Checkout
            window.location.href = checkoutUrl
        } catch (err: any) {
            setError(err.message || 'Nie udało się utworzyć zakładu. Spróbuj ponownie.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            👶 BabyBingo
                        </Link>
                        <Link
                            href={`/pool/${slug}`}
                            className="text-gray-700 hover:text-gray-900 transition-smooth"
                        >
                            ← Powrót do puli
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Wesprzyj Zbiórkę</h1>
                    <p className="text-gray-600">Wpłać na cel i weź udział w konkursie na datę urodzenia</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Twoje imię *
                            </label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                required
                                placeholder="np. Jan"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Będzie widoczne dla innych uczestników
                            </p>
                        </div>

                        <div>
                            <label htmlFor="predictedDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                Typowana data urodzenia *
                            </label>
                            <input
                                type="date"
                                id="predictedDate"
                                name="predictedDate"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth text-lg"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                💡 Wskazówka: Możesz typować dowolną datę, nie tylko planowaną datę porodu
                            </p>
                        </div>

                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isDonation"
                                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <div>
                                    <div className="font-semibold text-green-900">
                                        💝 Przekaż wygraną na dziecko
                                    </div>
                                    <div className="text-sm text-green-700 mt-1">
                                        Jeśli wygram, chcę przekazać całą wygraną na dziecko (twórcy puli)
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <h3 className="font-semibold text-purple-900 mb-2">📋 Pamiętaj:</h3>
                            <ul className="text-sm text-purple-800 space-y-1">
                                <li>• Datę można typować tylko raz</li>
                                <li>• Po kliknięciu "Dalej" zostaniesz przekierowany do płatności Stripe</li>
                                <li>• Zakład zostanie zarejestrowany po pomyślnej płatności</li>
                                <li>• Otrzymasz potwierdzenie na email</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-lg gradient-primary text-white text-lg font-semibold hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Przekierowywanie...' : 'Dalej do płatności →'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Płatności obsługiwane przez{' '}
                    <span className="font-semibold">Stripe</span> - bezpieczne i szyfrowane
                </p>
            </div>
        </div>
    )
}
