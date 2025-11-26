import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toggleWinnerStatus } from './actions'
import Link from 'next/link'

export default async function AdminWinnersPage() {
    const session = await auth()

    if (!session?.user?.isAdmin) {
        redirect('/')
    }

    const winners = await prisma.winner.findMany({
        include: {
            user: true,
            pool: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Zarządzanie Wygranymi</h1>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Zwycięzca
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pula
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kwota
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data wygranej
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Akcje
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {winners.map((winner) => (
                                <tr key={winner.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {winner.user.image && (
                                                <img
                                                    className="h-8 w-8 rounded-full mr-3"
                                                    src={winner.user.image}
                                                    alt=""
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {winner.user.name || 'Brak nazwy'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {winner.user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/dashboard/pools/${winner.pool.id}`}
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            {winner.pool.babyName || 'Bez nazwy'}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {formatCurrency(Number(winner.payoutAmount))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(winner.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${winner.payoutStatus === 'PAID'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {winner.payoutStatus === 'PAID' ? 'Wypłacono' : 'Oczekuje'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <form action={async () => {
                                            'use server'
                                            await toggleWinnerStatus(
                                                winner.id,
                                                winner.payoutStatus === 'PAID' ? 'PENDING' : 'PAID'
                                            )
                                        }}>
                                            <button
                                                type="submit"
                                                className={`text-sm font-medium ${winner.payoutStatus === 'PAID'
                                                        ? 'text-gray-500 hover:text-gray-700'
                                                        : 'text-indigo-600 hover:text-indigo-900'
                                                    }`}
                                            >
                                                {winner.payoutStatus === 'PAID' ? 'Oznacz jako oczekujące' : 'Oznacz jako wypłacone'}
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {winners.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Brak zwycięzców do wyświetlenia
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
