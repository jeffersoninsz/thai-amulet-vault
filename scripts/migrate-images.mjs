import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// Configure Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  console.error('❌ CLOUDINARY_URL is not defined in .env.local');
  process.exit(1);
}

// Extra extraction if needed but cloudinary.config supports string
cloudinary.config({
  cloudinary_url: cloudinaryUrl
});

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'siam_amulet_preset';

async function migrate() {
  console.log('🚀 Starting Cloudinary Migration...');

  try {
    // 1. Ensure the upload preset exists or warn (Admin API would need secret)
    // For now we assume the user has the secret in CLOUDINARY_URL so we can use Admin API
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
      if (e.error?.message?.includes('already exists')) {
        console.log(`ℹ️ Preset ${UPLOAD_PRESET} already exists.`);
      } else {
        console.warn(`⚠️ Could not create preset via API: ${e.message}. Please ensure it exists manually.`);
      }
    }

    // 2. Scan and Upload Local Images
    const files = fs.readdirSync(IMAGES_DIR);
    const urlMap = new Map();

    for (const file of files) {
      if (file.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
        const filePath = path.join(IMAGES_DIR, file);
        const publicId = path.parse(file).name;
        
        console.log(`Uploading ${file}...`);
        const result = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          folder: 'amulets',
          overwrite: true,
          resource_type: 'image'
        });
        
        const localPath = `/images/${file}`;
        urlMap.set(localPath, result.secure_url);
        console.log(`✅ Uploaded: ${file} -> ${result.secure_url}`);
      }
    }

    // 3. Update Database (Amulet Table)
    console.log('\n🔄 Updating Database records...');
    const amulets = await prisma.amulet.findMany();
    let updatedCount = 0;

    for (const amulet of amulets) {
      // Check if current imageUrl matches any local path we uploaded
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
    console.log(`- Local images uploaded: ${urlMap.size}`);
    console.log(`- Database records updated: ${updatedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
