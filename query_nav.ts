import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.navigationItem.findMany({
    orderBy: [
      { group: 'asc' },
      { order: 'asc' }
    ]
  });
  fs.writeFileSync('nav_utf8.json', JSON.stringify(items, null, 2), 'utf-8');
  console.log('done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
