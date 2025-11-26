'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleWinnerStatus(winnerId: string, status: 'PAID' | 'PENDING') {
    const session = await auth()

    if (!session?.user?.id || !session.user.isAdmin) {
        throw new Error('Unauthorized')
    }

    await prisma.winner.update({
        where: { id: winnerId },
        data: { payoutStatus: status },
    })

    revalidatePath('/admin/winners')
}
