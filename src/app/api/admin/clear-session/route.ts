import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const { email, secret } = await req.json()

    // Simple security - require secret
    if (secret !== process.env.NEXTAUTH_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all sessions for this user
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    await prisma.session.deleteMany({
        where: { userId: user.id }
    })

    return NextResponse.json({
        success: true,
        message: `Deleted all sessions for ${email}`
    })
}
