import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { calculatePlatformFee, calculateNetAmount } from '@/lib/winner-logic'
import { z } from 'zod'

const createBetSchema = z.object({
    poolId: z.string(),
    predictedDate: z.string(),
    isDonation: z.boolean().optional().default(false),
})

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { poolId, predictedDate, isDonation } = createBetSchema.parse(body)

        // Check if pool exists and is active
        const pool = await prisma.bettingPool.findUnique({
            where: { id: poolId },
        })

        if (!pool) {
            return NextResponse.json({ error: 'Pool not found' }, { status: 404 })
        }

        if (pool.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Pool is not accepting bets' }, { status: 400 })
        }

        // Check if user already has a bet in this pool
        const existingBet = await prisma.bet.findUnique({
            where: {
                poolId_userId: {
                    poolId,
                    userId: session.user.id,
                },
            },
        })

        if (existingBet) {
            return NextResponse.json({ error: 'You have already placed a bet in this pool' }, { status: 400 })
        }

        // Create pending bet
        const bet = await prisma.bet.create({
            data: {
                poolId,
                userId: session.user.id,
                predictedDate: new Date(predictedDate),
                isPaid: false,
                isDonation: isDonation || false,
            },
        })

        // Calculate amounts
        const amount = parseFloat(pool.betAmount.toString())
        const platformFee = calculatePlatformFee(amount)
        const netAmount = calculateNetAmount(amount)

        // Check if bypass mode is enabled (for testing without Stripe)
        const bypassMode = process.env.STRIPE_BYPASS_MODE === 'true'

        if (bypassMode) {
            // In bypass mode, immediately mark bet as paid and create payment record
            await prisma.bet.update({
                where: { id: bet.id },
                data: { isPaid: true },
            })

            await prisma.payment.create({
                data: {
                    poolId: pool.id,
                    stripePaymentId: `test_${bet.id}`,
                    stripeSessionId: `test_session_${bet.id}`,
                    amount,
                    platformFee,
                    netAmount,
                    status: 'COMPLETED',
                },
            })

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

            return NextResponse.json({
                checkoutUrl: `${appUrl}/pool/${pool.slug}/success`,
                betId: bet.id,
                bypassMode: true,
            })
        }

        // Normal Stripe flow
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pln',
                        product_data: {
                            name: `Zakład na datę urodzenia${pool.babyName ? ` - ${pool.babyName}` : ''}`,
                            description: `Twoja typowana data: ${new Date(predictedDate).toLocaleDateString('pl-PL')}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pool/${pool.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pool/${pool.slug}`,
            metadata: {
                poolId: pool.id,
                betId: bet.id,
                userId: session.user.id,
            },
        })

        // Create payment record
        await prisma.payment.create({
            data: {
                poolId: pool.id,
                stripePaymentId: checkoutSession.payment_intent as string || checkoutSession.id,
                stripeSessionId: checkoutSession.id,
                amount,
                platformFee,
                netAmount,
                status: 'PENDING',
            },
        })

        return NextResponse.json({
            checkoutUrl: checkoutSession.url,
            betId: bet.id,
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error creating bet:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
