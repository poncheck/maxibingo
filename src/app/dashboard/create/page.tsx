'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreatePoolPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            babyName: formData.get('babyName') as string,
            expectedDueDate: formData.get('expectedDueDate') as string,
            betAmount: parseFloat(formData.get('betAmount') as string),
            goalTitle: formData.get('goalTitle') as string,
            goalDescription: formData.get('goalDescription') as string,
            goalCost: formData.get('goalCost') ? parseFloat(formData.get('goalCost') as string) : undefined,
        }

        try {
            const response = await fetch('/api/pools/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Failed to create pool')
            }

            const pool = await response.json()
            router.push(`/dashboard/pools/${pool.id}`)
        } catch (err) {
            setError('Nie udało się utworzyć zbiórki. Spróbuj ponownie.')
        } finally {
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
                            <Image src="/logo.png" alt="BabyBingo" width={40} height={40} className="inline-block" /> BabyBingo
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-gray-700 hover:text-gray-900 transition-smooth"
                        >
                            ← Powrót do Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2">Utwórz Zbiórkę Grupową</h1>
                    <p className="text-gray-600">Zbierz środki na cel związany z narodzinami dziecka</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="babyName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Imię dziecka (opcjonalne)
                            </label>
                            <input
                                type="text"
                                id="babyName"
                                name="babyName"
                                placeholder="np. Zosia"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Możesz zostawić puste, jeśli chcesz zachować niespodziankę
                            </p>
                        </div>

                        <div>
                            <label htmlFor="expectedDueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                Planowana data porodu *
                            </label>
                            <input
                                type="date"
                                id="expectedDueDate"
                                name="expectedDueDate"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                            />
                        </div>

                        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                            <h3 className="font-bold text-green-900 mb-3 text-lg">🎯 Cel Zbiórki</h3>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="goalTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tytuł celu *
                                    </label>
                                    <input
                                        type="text"
                                        id="goalTitle"
                                        name="goalTitle"
                                        required
                                        placeholder="np. Profesjonalna sesja zdjęciowa noworodkowa"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-smooth"
                                    />
                                    <p className="text-sm text-gray-600 mt-1">
                                        Na co będą przeznaczone zebrane środki?
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="goalDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Opis celu (opcjonalny)
                                    </label>
                                    <textarea
                                        id="goalDescription"
                                        name="goalDescription"
                                        rows={3}
                                        placeholder="np. Sesja w studio z profesjonalnym fotografem, 50 zdjęć w albumie, zdjęcia rodzinne"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-smooth"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="goalCost" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Szacowany koszt celu (PLN, opcjonalny)
                                    </label>
                                    <input
                                        type="number"
                                        id="goalCost"
                                        name="goalCost"
                                        min="0"
                                        step="0.01"
                                        placeholder="2000.00"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-smooth"
                                    />
                                    <p className="text-sm text-gray-600 mt-1">
                                        Ile w przybliżeniu kosztuje realizacja celu?
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="betAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                                Wpłata na osobę (PLN) *
                            </label>
                            <input
                                type="number"
                                id="betAmount"
                                name="betAmount"
                                required
                                min="2"
                                step="0.01"
                                placeholder="50.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Minimalna kwota: 2 PLN (wymaganie bramki płatniczej)
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">📋 Jak to działa:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Przyjaciele i rodzina wpłacają ustaloną kwotę</li>
                                <li>• Każdy typuje datę urodzenia dziecka (element zabawy)</li>
                                <li>• Osoba która trafi datę realizuje cel zbiórki</li>
                                <li>• Nadwyżka (jeśli zostanie) pozostaje u zwycięzcy</li>
                                <li>• Platforma pobiera 1% prowizji na koszty</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-lg gradient-primary text-white font-semibold hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Tworzenie...' : 'Utwórz Zbiórkę'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
