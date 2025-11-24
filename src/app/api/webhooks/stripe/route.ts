import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session

                const { poolId, betId, userId } = session.metadata as {
                    poolId: string
                    betId: string
                    userId: string
                }

                // Update payment status
                const payment = await prisma.payment.findFirst({
                    where: {
                        stripeSessionId: session.id,
                    },
                })

                if (payment) {
                    await prisma.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: 'COMPLETED',
                            stripePaymentId: session.payment_intent as string,
                        },
                    })

                    // Update bet to mark as paid and link payment
                    const bet = await prisma.bet.update({
                        where: { id: betId },
                        data: {
                            isPaid: true,
                            paymentId: payment.id,
                        },
                        include: {
                            user: true,
                            pool: {
                                include: {
                                    creator: true,
                                },
                            },
                        },
                    })

                    // Send confirmation email to user
                    try {
                        const { sendEmail, betConfirmationEmail } = await import('@/lib/email')

                        await sendEmail({
                            to: bet.user.email,
                            subject: '🎉 Zakład potwierdzony!',
                            html: betConfirmationEmail({
                                userName: bet.user.name || 'Uczestnik',
                                poolName: bet.pool.babyName || 'Pula zakładów',
                                predictedDate: bet.predictedDate.toLocaleDateString('pl-PL', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }),
                                amount: `${bet.pool.betAmount} PLN`,
                                poolUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pool/${bet.pool.slug}`,
                            }),
                        })
                    } catch (error) {
                        console.error('Error sending bet confirmation email:', error)
                    }

                    // Send notification to pool creator about new bet
                    try {
                        const { sendEmail, newBetNotificationEmail } = await import('@/lib/email')

                        // Get current pool stats
                        const stats = await prisma.bet.aggregate({
                            where: {
                                poolId: bet.poolId,
                                isPaid: true,
                            },
                            _count: true,
                        })

                        const totalPool = await prisma.payment.aggregate({
                            where: {
                                poolId: bet.poolId,
                                status: 'COMPLETED',
                            },
                            _sum: {
                                netAmount: true,
                            },
                        })

                        await sendEmail({
                            to: bet.pool.creator.email,
                            subject: '🎊 Nowy uczestnik w Twojej puli!',
                            html: newBetNotificationEmail({
                                creatorName: bet.pool.creator.name || 'Twórca',
                                participantName: bet.user.name || 'Nowy uczestnik',
                                poolName: bet.pool.babyName || 'Twoja pula',
                                currentTotal: `${totalPool._sum.netAmount || 0} PLN`,
                                participantCount: stats._count,
                                poolUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pools/${bet.pool.id}`,
                            }),
                        })
                    } catch (error) {
                        console.error('Error sending new bet notification email:', error)
                    }
                }

                break
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent

                await prisma.payment.updateMany({
                    where: {
                        stripePaymentId: paymentIntent.id,
                    },
                    data: {
                        status: 'FAILED',
                    },
                })

                break
            }

            default:
                console.log(`Unhandled event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
