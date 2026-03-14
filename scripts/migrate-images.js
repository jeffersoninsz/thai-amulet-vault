const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// MANUAL CONFIG BASED ON USER PROVIDE
cloudinary.config({
  cloud_name: 'dsvgbvi4y',
  api_key: '615237678385821',
  api_secret: 'pWuuwHKIOBk6YYs7vFIpYZ-3jd8'
});

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const UPLOAD_PRESET = 'siam_amulet_preset';

async function migrate() {
  console.log('🚀 Starting Cloudinary Migration (Final Hardcoded Fix)...');

  try {
    // 1. Ensure/Create Preset
    console.log('Checking/Creating Upload Preset...');
    try {
      await cloudinary.api.create_upload_preset({
        name: UPLOAD_PRESET,
        unsigned: true,
        folder: 'amulets',
        settings: {
          return_delete_token: true
        }
      });
      console.log(`✅ Created unsigned preset: ${UPLOAD_PRESET}`);
    } catch (e) {
       console.log(`ℹ️ Preset info: ${e.message || 'Already exists or error'}`);
    }

    // 2. Scan and Upload
    const files = fs.readdirSync(IMAGES_DIR);
    const urlMap = new Map();

    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
        const filePath = path.join(IMAGES_DIR, file);
        const publicId = path.parse(file).name;
        
        process.stdout.write(`Uploading ${file}... `);
        try {
          const result = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            folder: 'amulets',
            overwrite: true,
            resource_type: 'image'
          });
          
          const localPath = `/images/${file}`;
          urlMap.set(localPath, result.secure_url);
          console.log(`DONE -> ${result.secure_url}`);
        } catch (uploadErr) {
          console.log(`FAILED: ${uploadErr.message}`);
        }
      }
    }

    // 3. Update DB
    console.log('\n🔄 Updating Database records...');
    const amulets = await prisma.amulet.findMany();
    let updatedCount = 0;

    for (const amulet of amulets) {
      const matchingCloudUrl = urlMap.get(amulet.imageUrl);
      if (matchingCloudUrl) {
        await prisma.amulet.update({
          where: { id: amulet.id },
          data: { imageUrl: matchingCloudUrl }
        });
        updatedCount++;
        console.log(`Updated Amulet: ${amulet.nameZh || amulet.id}`);
      }
    }

    console.log(`\n✨ Migration Complete!`);
    console.log(`- Local images processed: ${urlMap.size}`);
    console.log(`- Database records updated: ${updatedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
