import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), "src/api/db.json");
  if (!fs.existsSync(dataPath)) {
    console.log("No db.json found. Skipping migration.");
    return;
  }
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  const amulets = JSON.parse(fileContent);

  console.log(
    `Read ${amulets.length} amulets from db.json. Migrating to SQLite...`,
  );

  for (const item of amulets) {
    if (!item.id) continue;
    await prisma.amulet.upsert({
      where: { id: String(item.id) },
      update: {},
      create: {
        id: String(item.id),
        thaiName: String(item.thaiName || ""),
        chineseName: String(item.chineseName || ""),
        monkOrTemple: String(item.monkOrTemple || ""),
        year: String(item.year || ""),
        material: String(item.material || ""),
        description: String(item.description || ""),
        imageUrl: String(item.imageUrl || "/images/placeholder-amulet.png"),
      },
    });
  }

  // Create default admin user Jefferson
  await prisma.user.upsert({
    where: { name: "Jefferson" },
    update: {},
    create: {
      name: "Jefferson",
      passwordHash: "admin123",
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Successfully migrated JSON data to Prisma SQLite DB.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
