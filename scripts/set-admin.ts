// Script to set admin user
// Run with: npx tsx scripts/set-admin.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'marcin.petkowicz@gmail.com'

    const user = await prisma.user.update({
        where: { email: adminEmail },
        data: { isAdmin: true },
    })

    console.log(`✅ User ${user.email} is now an admin!`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
