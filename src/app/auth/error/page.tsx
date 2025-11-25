import Link from 'next/link'
import Image from 'next/image'

const errorMessages: Record<string, { title: string; description: string }> = {
    Configuration: {
        title: 'Błąd konfiguracji',
        description: 'Wystąpił problem z konfiguracją serwera. Skontaktuj się z administratorem.',
    },
    AccessDenied: {
        title: 'Dostęp zabroniony',
        description: 'Nie masz uprawnień do tej strony.',
    },
    Verification: {
        title: 'Link wygasł lub jest nieprawidłowy',
        description: 'Link do logowania wygasł lub został już użyty. Spróbuj zalogować się ponownie.',
    },
    Default: {
        title: 'Wystąpił błąd',
        description: 'Nie udało się zalogować. Spróbuj ponownie.',
    },
}

export default async function AuthErrorPage(props: {
    searchParams: Promise<{ error?: string }>
}) {
    const searchParams = await props.searchParams
    const errorType = searchParams.error || 'Default'
    const error = errorMessages[errorType] || errorMessages.Default

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block">
                        <Image src="/logo.png" alt="BabyBingo" width={60} height={60} className="inline-block" /> BabyBingo
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h1 className="text-3xl font-bold mb-4">{error.title}</h1>
                    <p className="text-gray-600 mb-8">
                        {error.description}
                    </p>

                    {errorType === 'Verification' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-blue-800">
                                <strong>💡 Wskazówka:</strong> Linki do logowania przez email są ważne tylko przez 24 godziny i można ich użyć tylko raz.
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link
                            href="/auth/signin"
                            className="block px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-smooth"
                        >
                            Spróbuj zalogować się ponownie
                        </Link>
                        <Link
                            href="/"
                            className="block px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-smooth"
                        >
                            Strona główna
                        </Link>
                    </div>

                    {errorType === 'Configuration' && (
                        <p className="text-xs text-gray-500 mt-6">
                            Kod błędu: {errorType}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
