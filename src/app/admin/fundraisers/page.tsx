import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminFundraisersPage() {
    const fundraisers = await prisma.bettingPool.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            creator: true,
            _count: {
                select: { bets: true }
            }
        }
    })

    // Calculate total collected for each fundraiser
    const fundraisersWithStats = await Promise.all(
        fundraisers.map(async (fundraiser) => {
            const bets = await prisma.bet.findMany({
                where: { poolId: fundraiser.id }
            })
            const totalCollected = bets.length * Number(fundraiser.betAmount)
            return { ...fundraiser, totalCollected }
        })
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Zbiórki</h1>
                    <p className="text-gray-600 mt-2">Zarządzaj wszystkimi zbiórkami na platformie</p>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                    {fundraisers.length} zbiórek
                </div>
            </div>

            {/* Fundraisers Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cel Zbiórki
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Organizator
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Uczestnicy
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Zebrano
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {fundraisersWithStats.map((fundraiser) => (
                            <tr key={fundraiser.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {fundraiser.goalTitle}
                                        </p>
                                        {fundraiser.babyName && (
                                            <p className="text-sm text-gray-600">
                                                {fundraiser.babyName}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {fundraiser.creator.name || 'Anonim'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {fundraiser.creator.email}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${fundraiser.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {fundraiser.status === 'ACTIVE' ? 'Aktywna' : 'Zakończona'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {fundraiser._count.bets}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                    {fundraiser.totalCollected.toFixed(2)} PLN
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(fundraiser.createdAt).toLocaleDateString('pl-PL')}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <Link
                                        href={`/pool/${fundraiser.slug}`}
                                        className="text-purple-600 hover:text-purple-900"
                                        target="_blank"
                                    >
                                        Zobacz →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
