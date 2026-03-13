const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    const accounts = [
        {
            email: 'super@siamtreasures.com',
            name: 'Super Admin User',
            role: 'SUPER_ADMIN',
            passwordHash: hashedPassword,
        },
        {
            email: 'staff@siamtreasures.com',
            name: 'Staff Editor',
            role: 'STAFF',
            permissions: JSON.stringify(["MANAGE_CONTENT", "MANAGE_ORDERS"]),
            passwordHash: hashedPassword,
        },
        {
            email: 'vip@siamtreasures.com',
            name: 'VIP Wholesaler',
            role: 'VIP_USER', // Or WHOLESALE based on phase 7
            passwordHash: hashedPassword,
            companyName: 'Asia Relics Co.',
            paymentTerms: 'NET30'
        },
        {
            email: 'user@siamtreasures.com',
            name: 'Regular Buyer',
            role: 'USER',
            passwordHash: hashedPassword,
        }
    ]

    console.log('Seeding accounts...')
    for (const acc of accounts) {
        const user = await prisma.user.upsert({
            where: { email: acc.email },
            update: acc,
            create: acc,
        })
        console.log(`Created/Updated: ${user.email} -> Role: ${user.role}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
