import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { determineWinners } from '@/lib/winner-logic'
import { z } from 'zod'

const declareBirthSchema = z.object({
    actualBirthDate: z.string(),
})

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if the param is an ID or a Slug. 
        // Since the previous folder was [id], the frontend likely sends an ID.
        // But now the route param is named 'slug'. 
        // We will try to find by ID first (if it looks like a CUID) or just findUnique where id = slug.
        // Actually, let's just use the value from params.slug as the ID if the frontend sends ID.

        const pool = await prisma.bettingPool.findUnique({
            where: { id: slug },
        })

        if (!pool) {
            return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
        }

        // Verify user is the pool creator
        if (pool.creatorId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Check if pool is still active
        if (pool.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Pool is not active' }, { status: 400 })
        }

        const body = await req.json()
        const { actualBirthDate } = declareBirthSchema.parse(body)

        const birthDate = new Date(actualBirthDate)

        // Determine winners
        const winners = await determineWinners(pool.id, birthDate)

        // Update pool status and birth date
        await prisma.bettingPool.update({
            where: { id: pool.id },
            data: {
                actualBirthDate: birthDate,
                status: 'CLOSED',
            },
        })

        // Create winner records
        await Promise.all(
            winners.map((winner) =>
                prisma.winner.create({
                    data: {
                        poolId: pool.id,
                        userId: winner.userId,
                        betId: winner.betId,
                        payoutAmount: winner.payoutAmount,
                    },
                })
            )
        )

        // Send winner notification emails to all participants
        try {
            const { sendEmail, winnerAnnouncementEmail } = await import('@/lib/email')

            // Get all participants (users with paid bets)
            const allBets = await prisma.bet.findMany({
                where: {
                    poolId: pool.id,
                    isPaid: true,
                },
                include: {
                    user: true,
                },
            })

            const winnerUserIds = new Set(winners.map(w => w.userId))
            const winnerNames = winners.map(w => w.userName || 'Zwycięzca')

            // Send emails to all participants
            const emailPromises = allBets.map(async (bet: typeof allBets[0]) => {
                const isWinner = winnerUserIds.has(bet.userId)
                const winner = winners.find(w => w.userId === bet.userId)

                return sendEmail({
                    to: bet.user.email,
                    subject: isWinner ? '🎉 GRATULACJE! WYGRAŁEŚ!' : '👶 Dziecko się urodziło!',
                    html: winnerAnnouncementEmail({
                        userName: bet.user.name || 'Uczestnik',
                        isWinner,
                        winnerNames,
                        actualBirthDate: birthDate.toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }),
                        payoutAmount: isWinner ? `${winner?.payoutAmount.toFixed(2)} PLN` : undefined,
                        poolName: pool.babyName || 'Pula zakładów',
                    }),
                })
            })

            // Wait for all emails to be sent (use allSettled to not fail if some emails fail)
            const results = await Promise.allSettled(emailPromises)
            const failedEmails = results.filter((r: PromiseSettledResult<any>) => r.status === 'rejected')

            if (failedEmails.length > 0) {
                console.error(`Failed to send ${failedEmails.length} winner notification emails`)
            }
        } catch (error) {
            console.error('Error sending winner notification emails:', error)
        }

        return NextResponse.json({
            success: true,
            winners,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error declaring birth:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
