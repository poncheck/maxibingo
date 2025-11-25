import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await auth()

    return NextResponse.json({
        session,
        isAdmin: session?.user?.isAdmin,
        userId: session?.user?.id,
        email: session?.user?.email,
    })
}
