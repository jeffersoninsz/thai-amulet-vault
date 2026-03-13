import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash("admin123", 10);

    // Upsert pure admin
    await prisma.user.upsert({
        where: { email: "admin@siamtreasures.com" },
        update: {},
        create: {
            email: "admin@siamtreasures.com",
            name: "SuperAdmin",
            passwordHash: hash,
            role: "ADMIN",
        },
    });

    // Upsert test staff
    await prisma.user.upsert({
        where: { email: "staff@siamtreasures.com" },
        update: {},
        create: {
            email: "staff@siamtreasures.com",
            name: "Jefferson",
            passwordHash: hash,
            role: "STAFF",
        },
    });

    // Upsert default customer
    await prisma.user.upsert({
        where: { email: "customer@siamtreasures.com" },
        update: {},
        create: {
            email: "customer@siamtreasures.com",
            name: "Common Buyer",
            passwordHash: hash,
            role: "CUSTOMER",
        },
    });

    console.log("Seeding complete: Admin, Staff, and Customer users created with password 'admin123'.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
