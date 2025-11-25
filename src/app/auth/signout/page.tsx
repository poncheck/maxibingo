import Link from 'next/link'

export default function SignOutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block">
                        👶 MaxiBingo
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-6">👋</div>
                    <h1 className="text-3xl font-bold mb-4">Zostałeś wylogowany</h1>
                    <p className="text-gray-600 mb-8">
                        Dziękujemy za skorzystanie z MaxiBingo!
                    </p>
                    <div className="space-y-3">
                        <Link
                            href="/auth/signin"
                            className="block px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg transition-smooth"
                        >
                            Zaloguj się ponownie
                        </Link>
                        <Link
                            href="/"
                            className="block px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 transition-smooth"
                        >
                            Strona główna
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
