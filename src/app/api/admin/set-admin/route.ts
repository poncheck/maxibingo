import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const { email, secret } = await req.json()

    // Simple security - require secret
    if (secret !== process.env.NEXTAUTH_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Set user as admin
    const user = await prisma.user.update({
        where: { email },
        data: { isAdmin: true }
    })

    // Also clear their sessions so they get new session with isAdmin
    await prisma.session.deleteMany({
        where: { userId: user.id }
    })

    return NextResponse.json({
        success: true,
        message: `${email} is now admin. Sessions cleared - please login again.`,
        user: {
            email: user.email,
            isAdmin: user.isAdmin
        }
    })
}
