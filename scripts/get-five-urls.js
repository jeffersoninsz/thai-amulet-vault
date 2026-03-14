const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.amulet.findMany({ take: 5 }).then(amulets => {
  const urls = amulets.map(a => a.imageUrl).join('\n');
  require('fs').writeFileSync('temp_urls.txt', urls, 'utf-8');
}).finally(() => p.$disconnect());
