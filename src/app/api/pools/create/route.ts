import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const createPoolSchema = z.object({
    babyName: z.string().optional(),
    expectedDueDate: z.string(),
    betAmount: z.number().positive(),
    goalTitle: z.string().min(1, 'Tytuł celu jest wymagany'),
    goalDescription: z.string().optional(),
    goalCost: z.number().positive().optional(),
})

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = createPoolSchema.parse(body)

        // Generate unique slug
        let slug = generateSlug()
        let existingPool = await prisma.bettingPool.findUnique({ where: { slug } })

        while (existingPool) {
            slug = generateSlug()
            existingPool = await prisma.bettingPool.findUnique({ where: { slug } })
        }

        // Create pool
        const pool = await prisma.bettingPool.create({
            data: {
                creatorId: session.user.id,
                babyName: validatedData.babyName,
                expectedDueDate: new Date(validatedData.expectedDueDate),
                betAmount: validatedData.betAmount,
                goalTitle: validatedData.goalTitle,
                goalDescription: validatedData.goalDescription,
                goalCost: validatedData.goalCost,
                slug,
            },
        })

        return NextResponse.json(pool)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error creating pool:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
