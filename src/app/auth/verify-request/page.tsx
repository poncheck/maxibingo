import Link from 'next/link'

export default async function VerifyRequestPage(props: {
    searchParams: Promise<{ provider?: string; type?: string }>
}) {
    const searchParams = await props.searchParams

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block">
                        <Image src="/logo.png" alt="BabyBingo" width={40} height={40} className="inline-block" /> BabyBingo
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-6">📧</div>
                    <h1 className="text-3xl font-bold mb-4">Sprawdź swoją skrzynkę!</h1>
                    <p className="text-gray-600 mb-6">
                        Link do logowania został wysłany na Twój adres email.
                    </p>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-purple-800">
                            💡 <strong>Wskazówka:</strong> Jeśli nie widzisz wiadomości, sprawdź folder SPAM.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-smooth"
                    >
                        Powrót do strony głównej
                    </Link>
                </div>
            </div>
        </div>
    )
}
