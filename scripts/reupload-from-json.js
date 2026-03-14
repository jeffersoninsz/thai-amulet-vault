const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(process.cwd(), "src/api/db.json");
  if (!fs.existsSync(dataPath)) {
    console.log("No db.json found.");
    return;
  }

  const amulets = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`Found ${amulets.length} amulets in db.json.`);

  const urlCache = {};

  for (const item of amulets) {
    if (!item.id || !item.imageUrl) continue;
    
    // Find the original local path
    const localUrl = item.imageUrl; // e.g. /images/turtle.png
    if (!localUrl.startsWith('/images/') || localUrl.includes('placeholder-amulet.png')) {
      continue;
    }

    const filename = localUrl.split('/').pop(); // turtle.png

    if (!urlCache[filename]) {
      const localPath = path.join(process.cwd(), "public", "images", filename);
      if (fs.existsSync(localPath)) {
        console.log(`Uploading ${localPath}...`);
        try {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'amulets',
            public_id: filename.replace(/\.[^/.]+$/, ""),
            overwrite: true
          });
          urlCache[filename] = result.secure_url;
          console.log(`Uploaded to: ${result.secure_url}`);
        } catch (e) {
          console.error(`Failed to upload ${filename}:`, e);
          continue;
        }
      } else {
        console.error(`Local file not found for ${filename} at ${localPath}`);
        continue;
      }
    }

    if (urlCache[filename]) {
      await prisma.amulet.update({
        where: { id: String(item.id) },
        data: { imageUrl: urlCache[filename] }
      });
    }
  }

  console.log('Update complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
