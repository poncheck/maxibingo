import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ poolId: string }> }
) {
    const { poolId } = await params
    try {
        const pool = await prisma.bettingPool.findUnique({
            where: { id: poolId },
            include: {
                bets: {
                    where: {
                        isPaid: true,
                    },
                    select: {
                        predictedDate: true,
                    },
                },
            },
        })

        if (!pool) {
            return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
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

        // Calculate date distribution
        const dateDistribution: Record<string, number> = {}
        pool.bets.forEach((bet) => {
            const dateKey = bet.predictedDate.toISOString().split('T')[0]
            dateDistribution[dateKey] = (dateDistribution[dateKey] || 0) + 1
        })

        // Convert to array for charting
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

        return NextResponse.json({
            totalParticipants: pool.bets.length,
            totalAmount,
            dateDistribution: distributionArray,
            daysUntilDue,
            expectedDueDate: pool.expectedDueDate,
        })
    } catch (error) {
        console.error('Error fetching stats:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
