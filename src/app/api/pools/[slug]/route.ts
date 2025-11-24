import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    try {
        const pool = await prisma.bettingPool.findUnique({
            where: { slug: slug },
            include: {
                creator: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                bets: {
                    where: {
                        isPaid: true,
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
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

        return NextResponse.json({
            ...pool,
            totalAmount,
        })
    } catch (error) {
        console.error('Error fetching pool:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
