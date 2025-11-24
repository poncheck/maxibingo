'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeclareBirthButton({ poolId }: { poolId: string }) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const actualBirthDate = formData.get('actualBirthDate') as string

        try {
            const response = await fetch(`/api/pools/${poolId}/declare-birth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actualBirthDate }),
            })

            if (!response.ok) {
                throw new Error('Failed to declare birth')
            }

            setShowModal(false)
            router.refresh()
        } catch (err) {
            setError('Nie udało się ogłosić daty urodzenia. Spróbuj ponownie.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-lg gradient-accent text-white font-semibold hover:shadow-lg transition-smooth"
            >
                🎉 Ogłoś datę urodzenia
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4">Ogłoś datę urodzenia</h2>
                        <p className="text-gray-600 mb-6">
                            Podaj faktyczną datę urodzenia dziecka. System automatycznie określi zwycięzcę i wyśle powiadomienia.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="actualBirthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Data urodzenia *
                                </label>
                                <input
                                    type="date"
                                    id="actualBirthDate"
                                    name="actualBirthDate"
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth font-semibold"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 rounded-lg gradient-accent text-white font-semibold hover:shadow-lg transition-smooth disabled:opacity-50"
                                >
                                    {loading ? 'Ogłaszam...' : 'Ogłoś'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}
