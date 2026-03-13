import { PrismaClient } from "@prisma/client";
console.log("Testing Prisma Instantiation...");
const p = new PrismaClient();
p.amulet
  .count()
  .then(console.log)
  .catch(console.error)
  .finally(() => p.$disconnect());
