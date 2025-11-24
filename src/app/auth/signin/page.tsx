import { signIn } from '@/auth'
import Link from 'next/link'

export default async function SignInPage(props: {
    searchParams: Promise<{ callbackUrl?: string }>
}) {
    const searchParams = await props.searchParams
    const callbackUrl = searchParams.callbackUrl || '/dashboard'

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block">
                        👶 MaxiBingo
                    </Link>
                    <h1 className="text-3xl font-bold mt-6 mb-2">Zaloguj się</h1>
                    <p className="text-gray-600">Wybierz sposób logowania</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
                    <form
                        action={async (formData) => {
                            'use server'
                            await signIn('resend', {
                                email: formData.get('email'),
                                redirectTo: callbackUrl,
                            })
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Adres Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="twoj@email.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-smooth"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 hover:shadow-lg transition-smooth"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Zaloguj przez Email</span>
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">lub kontynuuj przez</span>
                        </div>
                    </div>

                    <form
                        action={async () => {
                            'use server'
                            await signIn('google', {
                                redirectTo: callbackUrl,
                            })
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-smooth"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="font-semibold">Google</span>
                        </button>
                    </form>

                    <form
                        action={async () => {
                            'use server'
                            await signIn('facebook', {
                                redirectTo: callbackUrl,
                            })
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-smooth"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span className="font-semibold">Facebook</span>
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Logując się, akceptujesz nasz{' '}
                    <Link href="/terms" className="text-purple-600 hover:underline">
                        Regulamin
                    </Link>{' '}
                    i{' '}
                    <Link href="/privacy" className="text-purple-600 hover:underline">
                        Politykę Prywatności
                    </Link>
                </p>
            </div>
        </div>
    )
}
