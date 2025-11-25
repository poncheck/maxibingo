import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
    // Fetch statistics
    const [
        totalUsers,
        totalFundraisers,
        activeFundraisers,
        completedFundraisers,
        totalBets,
        recentFundraisers,
        recentUsers,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.bettingPool.count(),
        prisma.bettingPool.count({ where: { status: 'ACTIVE' } }),
        prisma.bettingPool.count({ where: { status: 'COMPLETED' } }),
        prisma.bet.count(),
        prisma.bettingPool.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: true,
                _count: {
                    select: { bets: true }
                }
            }
        }),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        }),
    ])

    // Calculate total collected (sum of all bet amounts)
    const allBets = await prisma.bet.findMany({
        include: { pool: true }
    })
    const totalCollected = allBets.reduce((sum, bet) => sum + Number(bet.pool.betAmount), 0)
    const platformFees = totalCollected * 0.01

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Admina</h1>
                <p className="text-gray-600 mt-2">Przegląd aktywności platformy MaxiBingo</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Użytkownicy</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</p>
                        </div>
                        <div className="text-4xl">👥</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Zbiórki</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalFundraisers}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {activeFundraisers} aktywnych
                            </p>
                        </div>
                        <div className="text-4xl">🎯</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Wpłaty</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{totalBets}</p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Prowizje</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {platformFees.toFixed(2)} PLN
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                z {totalCollected.toFixed(2)} PLN
                            </p>
                        </div>
                        <div className="text-4xl">📊</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Fundraisers */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Najnowsze Zbiórki</h2>
                        <Link
                            href="/admin/fundraisers"
                            className="text-sm text-purple-600 hover:text-purple-700"
                        >
                            Zobacz wszystkie →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentFundraisers.map((fundraiser) => (
                            <div
                                key={fundraiser.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                        {fundraiser.goalTitle}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {fundraiser.creator.name || fundraiser.creator.email}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-purple-600">
                                        {fundraiser._count.bets} wpłat
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(fundraiser.createdAt).toLocaleDateString('pl-PL')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Nowi Użytkownicy</h2>
                        <Link
                            href="/admin/users"
                            className="text-sm text-purple-600 hover:text-purple-700"
                        >
                            Zobacz wszystkich →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-smooth"
                            >
                                <div className="flex items-center gap-3">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || 'User'}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                            {(user.name || user.email)[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {user.name || 'Anonim'}
                                        </p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
