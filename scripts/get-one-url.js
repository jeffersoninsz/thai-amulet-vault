const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.amulet.findFirst().then(a => {
  require('fs').writeFileSync('temp_url.txt', a.imageUrl, 'utf-8');
}).finally(() => p.$disconnect());
