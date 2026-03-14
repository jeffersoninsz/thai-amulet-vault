const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  // It handles Amulet table
  const amulets = await prisma.amulet.findMany({
    where: {
      imageUrl: {
        contains: 'dtczysv1n'
      }
    }
  });

  console.log(`Found ${amulets.length} amulets to update.`);

  const cache = {};

  for (const amulet of amulets) {
    const url = amulet.imageUrl;
    const filename = url.split('/').pop();
    
    if (!cache[filename]) {
      const localPath = path.join(__dirname, '..', 'public', 'images', filename);
      
      // If it's something like placeholder-amulet.png, the path is direct
      if (fs.existsSync(localPath)) {
        console.log(`Uploading ${localPath}...`);
        try {
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'amulets',
            public_id: filename.replace(/\.[^/.]+$/, "")
          });
          cache[filename] = result.secure_url;
          console.log(`Uploaded to: ${result.secure_url}`);
        } catch (e) {
          console.error(`Failed to upload ${filename}:`, e);
          continue;
        }
      } else {
        // Just in case it's in public/images/amulets/
        const altLocalPath = path.join(__dirname, '..', 'public', 'images', 'amulets', filename);
        if (fs.existsSync(altLocalPath)) {
            console.log(`Uploading ${altLocalPath}...`);
            try {
              const result = await cloudinary.uploader.upload(altLocalPath, {
                folder: 'amulets',
                public_id: filename.replace(/\.[^/.]+$/, "")
              });
              cache[filename] = result.secure_url;
              console.log(`Uploaded to: ${result.secure_url}`);
            } catch (e) {
              console.error(`Failed to upload ${filename}:`, e);
              continue;
            }
        } else {
            console.error(`Local file not found for ${filename}`);
            continue;
        }
      }
    }

    if (cache[filename]) {
      await prisma.amulet.update({
        where: { id: amulet.id },
        data: { imageUrl: cache[filename] }
      });
    }
  }

  console.log('Update complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
