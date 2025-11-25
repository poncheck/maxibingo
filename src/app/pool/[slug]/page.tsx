import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { auth } from '@/auth'
import BetButton from './BetButton'

export default async function PublicPoolPage(props: {
    params: Promise<{ slug: string }>
}) {
    const params = await props.params
    const session = await auth()

    const pool = await prisma.bettingPool.findUnique({
        where: { slug: params.slug },
        include: {
            creator: {
                select: {
                    name: true,
                },
            },
            bets: {
                where: {
                    isPaid: true,
                },
                select: {
                    predictedDate: true,
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    })

    if (!pool) {
        notFound()
    }

    // Calculate total pool amount
    const payments = await prisma.payment.findMany({
        where: {
            poolId: pool.id,
            status: 'COMPLETED',
        },
    })

    const totalAmount = payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.netAmount.toString())
    }, 0)

    // Check if current user has already bet
    let userBet = null
    if (session?.user?.id) {
        userBet = await prisma.bet.findUnique({
            where: {
                poolId_userId: {
                    poolId: pool.id,
                    userId: session.user.id,
                },
            },
        })
    }

    // Calculate date distribution
    const dateDistribution: Record<string, number> = {}
    pool.bets.forEach((bet) => {
        const dateKey = bet.predictedDate.toISOString().split('T')[0]
        dateDistribution[dateKey] = (dateDistribution[dateKey] || 0) + 1
    })

    const distributionArray = Object.entries(dateDistribution)
        .map(([date, count]) => ({
            date,
            count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate days until expected due date
    const today = new Date()
    const dueDate = new Date(pool.expectedDueDate)
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            👶 BabyBingo
                        </Link>
                        <div className="flex items-center gap-4">
                            {session ? (
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-gray-900 transition-smooth"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    className="text-gray-700 hover:text-gray-900 transition-smooth"
                                >
                                    Zaloguj
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {pool.babyName ? `Zbiórka na powitanie ${pool.babyName}` : 'Zbiórka na powitanie dziecka'}
                        </h1>
                        <p className="text-xl text-gray-600">
                            Organizator: {pool.creator.name || 'Anonim'}
                        </p>
                    </div>

                    {/* Goal Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="text-4xl">🎯</div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-green-900 mb-2">{pool.goalTitle}</h2>
                                {pool.goalDescription && (
                                    <p className="text-green-800 mb-3">{pool.goalDescription}</p>
                                )}
                                {pool.goalCost && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-green-700">Szacowany koszt:</span>
                                        <span className="text-lg font-bold text-green-900">{formatCurrency(Number(pool.goalCost))}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200">
                            <p className="text-sm text-green-700">
                                🎲 Osoba która trafi datę urodzenia realizuje ten cel w imieniu całej grupy!
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Planowana data</div>
                            <div className="text-2xl font-bold text-purple-900">
                                {formatDate(pool.expectedDueDate)}
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Dni do porodu</div>
                            <div className="text-2xl font-bold text-purple-900">
                                {daysUntilDue > 0 ? daysUntilDue : 'Już czas!'}
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Uczestnicy</div>
                            <div className="text-2xl font-bold text-purple-900">{pool.bets.length}</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6 text-center">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Zebrano</div>
                            <div className="text-2xl font-bold text-purple-900">
                                {formatCurrency(totalAmount)}
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    {pool.status === 'ACTIVE' && (
                        <div className="text-center">
                            {userBet ? (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                    <div className="text-green-700 font-semibold mb-2">
                                        ✓ Twój typ został zarejestrowany!
                                    </div>
                                    <div className="text-green-600">
                                        Typowana data: {formatDate(userBet.predictedDate)}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <div className="text-3xl font-bold mb-2">
                                            {formatCurrency(parseFloat(pool.betAmount.toString()))}
                                        </div>
                                        <div className="text-gray-600">Kwota zakładu</div>
                                    </div>
                                    <BetButton slug={pool.slug} isLoggedIn={!!session} />
                                </div>
                            )}
                        </div>
                    )}

                    {pool.status !== 'ACTIVE' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                            <div className="text-yellow-700 font-semibold">
                                Ta pula jest już zamknięta
                            </div>
                        </div>
                    )}
                </div>

                {/* Date Distribution */}
                {distributionArray.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-2xl font-bold mb-6">Rozkład typowanych dat</h2>
                        <div className="space-y-3">
                            {distributionArray.map(({ date, count }) => {
                                const maxCount = Math.max(...distributionArray.map((d) => d.count))
                                const percentage = (count / maxCount) * 100

                                return (
                                    <div key={date} className="flex items-center gap-4">
                                        <div className="w-32 text-sm font-semibold text-gray-700">
                                            {formatDate(new Date(date))}
                                        </div>
                                        <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                            <div
                                                className="gradient-primary h-full rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
                                                {count} {count === 1 ? 'osoba' : 'osób'}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Game Rules */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Zasady gry</h2>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎯</span>
                            <div>
                                <div className="font-semibold">Typuj datę</div>
                                <div className="text-sm text-gray-600">
                                    Każdy uczestnik typuje dokładną datę urodzenia dziecka (tylko raz)
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">💰</span>
                            <div>
                                <div className="font-semibold">Wpłać kwotę</div>
                                <div className="text-sm text-gray-600">
                                    Dokonaj bezpiecznej płatności przez Stripe
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <div className="font-semibold">Wygraj pulę</div>
                                <div className="text-sm text-gray-600">
                                    Osoba która trafi dokładną datę wygrywa całą pulę. Jeśli nikt nie trafi, wygrywa najbliższa data.
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎊</span>
                            <div>
                                <div className="font-semibold">Remis</div>
                                <div className="text-sm text-gray-600">
                                    Jeśli kilka osób trafi tę samą datę, pula jest dzielona równo między zwycięzców
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">💳</span>
                            <div>
                                <div className="font-semibold">Prowizja</div>
                                <div className="text-sm text-gray-600">
                                    Platforma pobiera 1% prowizji na pokrycie kosztów bramki płatniczej
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
