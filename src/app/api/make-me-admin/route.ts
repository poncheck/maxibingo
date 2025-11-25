import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()

    // Only allow for specific email
    if (session?.user?.email !== 'marcin.petkowicz@gmail.com') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set this user as admin
    const user = await prisma.user.update({
        where: { email: session.user.email },
        data: { isAdmin: true }
    })

    // Clear sessions
    await prisma.session.deleteMany({
        where: { userId: user.id }
    })

    return NextResponse.json({
        success: true,
        message: 'You are now admin! Please logout and login again.',
        user: {
            email: user.email,
            isAdmin: user.isAdmin
        }
    })
}
