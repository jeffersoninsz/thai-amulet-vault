const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.amulet.count({ where: { imageUrl: { contains: 'placeholder-amulet' } } }).then(c => {
  require('fs').writeFileSync('count.txt', c.toString(), 'utf-8');
}).finally(() => p.$disconnect());
