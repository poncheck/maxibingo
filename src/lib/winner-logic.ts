import { prisma } from './prisma'

export interface WinnerResult {
    userId: string
    betId: string
    userName: string | null
    userEmail: string
    predictedDate: Date
    payoutAmount: number
    daysOff: number
}

/**
 * Determines the winner(s) of a betting pool based on the actual birth date
 * Rules:
 * 1. Exact match wins
 * 2. If no exact match, closest date wins
 * 3. If multiple people have the same winning date, split the pool equally
 */
export async function determineWinners(
    poolId: string,
    actualBirthDate: Date
): Promise<WinnerResult[]> {
    // Get all paid bets for this pool
    const bets = await prisma.bet.findMany({
        where: {
            poolId,
            isPaid: true,
        },
        include: {
            user: true,
        },
    })

    if (bets.length === 0) {
        return []
    }

    // Calculate total pool amount (sum of all successful payments)
    const payments = await prisma.payment.findMany({
        where: {
            poolId,
            status: 'COMPLETED',
        },
    })

    const totalPool = payments.reduce((sum, payment) => {
        return sum + parseFloat(payment.netAmount.toString())
    }, 0)

    // Find exact matches first
    const exactMatches = bets.filter(bet => {
        const betDate = new Date(bet.predictedDate)
        return (
            betDate.getFullYear() === actualBirthDate.getFullYear() &&
            betDate.getMonth() === actualBirthDate.getMonth() &&
            betDate.getDate() === actualBirthDate.getDate()
        )
    })

    let winningBets = exactMatches

    // If no exact matches, find closest date(s)
    if (exactMatches.length === 0) {
        let minDiff = Infinity

        bets.forEach(bet => {
            const betDate = new Date(bet.predictedDate)
            const diff = Math.abs(betDate.getTime() - actualBirthDate.getTime())

            if (diff < minDiff) {
                minDiff = diff
                winningBets = [bet]
            } else if (diff === minDiff) {
                winningBets.push(bet)
            }
        })
    }

    // Calculate payout per winner (split equally)
    const payoutPerWinner = totalPool / winningBets.length

    // Calculate days off for each winner
    const winners: WinnerResult[] = winningBets.map(bet => {
        const betDate = new Date(bet.predictedDate)
        const daysOff = Math.abs(
            Math.floor((betDate.getTime() - actualBirthDate.getTime()) / (1000 * 60 * 60 * 24))
        )

        return {
            userId: bet.userId,
            betId: bet.id,
            userName: bet.user.name,
            userEmail: bet.user.email,
            predictedDate: bet.predictedDate,
            payoutAmount: payoutPerWinner,
            daysOff,
        }
    })

    return winners
}

/**
 * Calculate platform fee (1%)
 */
export function calculatePlatformFee(amount: number): number {
    return amount * 0.01
}

/**
 * Calculate net amount after platform fee
 */
export function calculateNetAmount(amount: number): number {
    return amount - calculatePlatformFee(amount)
}
