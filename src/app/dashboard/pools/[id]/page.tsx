import { auth, signOut } from '@/auth'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import DeclareBirthButton from './DeclareBirthButton'
import CopyLinkButton from './CopyLinkButton'

export default async function PoolManagementPage(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const session = await auth()

    if (!session?.user?.id) {
        redirect('/auth/signin')
    }

    const pool = await prisma.bettingPool.findUnique({
        where: { id: params.id },
        include: {
            bets: {
                where: {
                    isPaid: true,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    predictedDate: 'asc',
                },
            },
            winners: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    })

    if (!pool) {
        notFound()
    }

    if (pool.creatorId !== session.user.id) {
        redirect('/dashboard')
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

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pool/${pool.slug}`

    // Group bets by date
    const betsByDate: Record<string, typeof pool.bets> = {}
    pool.bets.forEach((bet) => {
        const dateKey = bet.predictedDate.toISOString().split('T')[0]
        if (!betsByDate[dateKey]) {
            betsByDate[dateKey] = []
        }
        betsByDate[dateKey].push(bet)
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            <Image src="/logo.png" alt="BabyBingo" width={60} height={60} className="inline-block" /> BabyBingo
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-gray-700 hover:text-gray-900 transition-smooth"
                        >
                            ← Powrót do Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">
                                {pool.babyName || 'Pula Zakładów'}
                            </h1>
                            <p className="text-gray-600">
                                Planowana data: {formatDate(pool.expectedDueDate)}
                            </p>
                        </div>
                        <span
                            className={`px - 4 py - 2 rounded - full text - sm font - semibold ${pool.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700'
                                : pool.status === 'CLOSED'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : pool.status === 'COMPLETED'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700'
                                } `}
                        >
                            {pool.status === 'ACTIVE' && 'Aktywna'}
                            {pool.status === 'CLOSED' && 'Zamknięta'}
                            {pool.status === 'COMPLETED' && 'Zakończona'}
                            {pool.status === 'CANCELLED' && 'Anulowana'}
                        </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-purple-50 rounded-xl p-6">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Uczestnicy</div>
                            <div className="text-3xl font-bold text-purple-900">{pool.bets.length}</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Kwota zakładu</div>
                            <div className="text-3xl font-bold text-purple-900">
                                {formatCurrency(parseFloat(pool.betAmount.toString()))}
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-6">
                            <div className="text-sm text-purple-600 font-semibold mb-1">Całkowita pula</div>
                            <div className="text-3xl font-bold text-purple-900">
                                {formatCurrency(totalAmount)}
                            </div>
                        </div>
                    </div>

                    {/* Share Section */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-semibold mb-3">Udostępnij link do puli:</h3>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            />
                            <CopyLinkButton url={shareUrl} />
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-smooth font-semibold"
                            >
                                📱 Facebook
                            </a >
                        </div >
                    </div >

                    {/* Declare Birth Button */}
                    {
                        pool.status === 'ACTIVE' && (
                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <DeclareBirthButton poolId={pool.id} />
                            </div>
                        )
                    }

                    {/* Winners Section */}
                    {
                        pool.winners.length > 0 && (
                            <div className="border-t border-gray-200 pt-6 mt-6">
                                <h3 className="font-semibold text-xl mb-4">🏆 Zwycięzcy:</h3>
                                <div className="space-y-3">
                                    {pool.winners.map((winner) => (
                                        <div key={winner.id} className="bg-gradient-accent text-white rounded-xl p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-bold text-lg">{winner.user.name || winner.user.email}</div>
                                                    <div className="text-sm opacity-90">
                                                        Wypłata: {formatCurrency(parseFloat(winner.payoutAmount.toString()))}
                                                    </div>
                                                </div>
                                                <div className="text-sm">
                                                    Status: {winner.payoutStatus === 'COMPLETED' ? '✅ Wypłacono' : '⏳ W trakcie'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div >

                {/* Participants List */}
                < div className="bg-white rounded-2xl shadow-xl p-8" >
                    <h2 className="text-2xl font-bold mb-6">Uczestnicy i ich typy</h2>

                    {
                        pool.bets.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-5xl mb-4">🎯</div>
                                <p>Jeszcze nikt nie dołączył do puli</p>
                                <p className="text-sm mt-2">Udostępnij link znajomym!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(betsByDate)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([date, bets]) => (
                                        <div key={date} className="border border-gray-200 rounded-xl p-4">
                                            <div className="font-semibold text-lg mb-3 text-purple-900">
                                                📅 {formatDate(new Date(date))} ({bets.length} {bets.length === 1 ? 'osoba' : 'osób'})
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {bets.map((bet) => (
                                                    <div key={bet.id} className="bg-purple-50 rounded-lg p-3 relative">
                                                        {bet.isDonation && (
                                                            <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                                                💝 Darowizna
                                                            </div>
                                                        )}
                                                        <div className="font-semibold">{bet.user.name || 'Anonim'}</div>
                                                        <div className="text-sm text-gray-600">{bet.user.email}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )
                    }
                </div >
            </div >
        </div >
    )
}
