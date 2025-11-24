import Link from 'next/link'

export default async function SuccessPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-6xl mb-6">🎉</div>
                    <h1 className="text-3xl font-bold mb-4">Zakład Zarejestrowany!</h1>
                    <p className="text-gray-600 mb-8">
                        Twój zakład został pomyślnie opłacony i zarejestrowany. Otrzymasz potwierdzenie na email.
                    </p>
                    <div className="space-y-3">
                        <Link
                            href={`/pool/${params.slug}`}
                            className="block px-6 py-3 rounded-lg gradient-primary text-white font-semibold hover:shadow-lg transition-smooth"
                        >
                            Zobacz Pulę
                        </Link>
                        <Link
                            href="/dashboard"
                            className="block px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-smooth"
                        >
                            Przejdź do Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
