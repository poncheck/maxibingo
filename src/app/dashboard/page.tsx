import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    const pools = await prisma.bettingPool.findMany({
        where: {
            creatorId: session.user.id,
        },
        include: {
            _count: {
                select: {
                    bets: {
                        where: {
                            isPaid: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            👶 MaxiBingo
                        </Link>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Cześć, {session.user.name || session.user.email}</span>
                            <form action={async () => {
                                'use server'
                                await signOut()
                            }}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-smooth"
                                >
                                    Wyloguj
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Moje Pule Zakładów</h1>
                        <p className="text-gray-600">Zarządzaj swoimi pulami i śledź uczestników</p>
                    </div>
                    <Link
                        href="/dashboard/create"
                        className="px-6 py-3 rounded-lg gradient-primary text-white font-semibold hover:shadow-lg transition-smooth"
                    >
                        + Utwórz Nową Pulę
                    </Link>
                </div>

                {pools.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <h2 className="text-2xl font-bold mb-2">Nie masz jeszcze żadnych pul</h2>
                        <p className="text-gray-600 mb-6">Utwórz swoją pierwszą pulę zakładów!</p>
                        <Link
                            href="/dashboard/create"
                            className="inline-block px-6 py-3 rounded-lg gradient-primary text-white font-semibold hover:shadow-lg transition-smooth"
                        >
                            Utwórz Pulę
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pools.map((pool) => (
                            <Link
                                key={pool.id}
                                href={`/dashboard/pools/${pool.id}`}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-smooth overflow-hidden"
                            >
                                <div className="gradient-primary p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {pool.babyName || 'Pula Zakładów'}
                                    </h3>
                                    <p className="text-purple-100">
                                        Planowana data: {formatDate(pool.expectedDueDate)}
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <div className="text-sm text-gray-600">Uczestnicy</div>
                                            <div className="text-2xl font-bold">{pool._count.bets}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Kwota zakładu</div>
                                            <div className="text-2xl font-bold">
                                                {formatCurrency(parseFloat(pool.betAmount.toString()))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${pool.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700'
                                                : pool.status === 'CLOSED'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : pool.status === 'COMPLETED'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {pool.status === 'ACTIVE' && 'Aktywna'}
                                            {pool.status === 'CLOSED' && 'Zamknięta'}
                                            {pool.status === 'COMPLETED' && 'Zakończona'}
                                            {pool.status === 'CANCELLED' && 'Anulowana'}
                                        </span>
                                        <span className="text-purple-600 font-semibold">
                                            Zobacz szczegóły →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
