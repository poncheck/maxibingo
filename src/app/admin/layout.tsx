import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user?.isAdmin) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <nav className="bg-gray-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <Link href="/admin/dashboard" className="text-xl font-bold">
                                🔧 Panel Admina
                            </Link>
                            <div className="hidden md:flex gap-4">
                                <Link
                                    href="/admin/dashboard"
                                    className="px-3 py-2 rounded-md hover:bg-gray-800 transition-smooth"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/fundraisers"
                                    className="px-3 py-2 rounded-md hover:bg-gray-800 transition-smooth"
                                >
                                    Zbiórki
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className="px-3 py-2 rounded-md hover:bg-gray-800 transition-smooth"
                                >
                                    Użytkownicy
                                </Link>
                                <Link
                                    href="/admin/winners"
                                    className="px-3 py-2 rounded-md hover:bg-gray-800 transition-smooth"
                                >
                                    Wygrani
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-sm text-gray-300 hover:text-white"
                            >
                                ← Strona główna
                            </Link>
                            <form action={async () => {
                                'use server'
                                await signOut({ redirectTo: '/auth/signout' })
                            }}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-smooth text-sm"
                                >
                                    Wyloguj
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
