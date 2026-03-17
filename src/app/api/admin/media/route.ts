import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";
import { revalidatePath } from "next/cache";

// GET: Fetch media for a specific amulet
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const amuletId = searchParams.get("amuletId");

        if (!amuletId) {
            // Return all media (for media vault browser)
            const allMedia = await prisma.mediaVault.findMany({
                orderBy: { createdAt: "desc" },
                take: 100,
            });
            return NextResponse.json({ media: allMedia });
        }

        const media = await prisma.mediaVault.findMany({
            where: { amuletId },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ media });
    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}

// POST: Create a new media vault entry
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role;
        if (!session?.user?.id || !["ADMIN", "SUPER_ADMIN", "STAFF"].includes(role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { amuletId, url, mediaType, altText } = body;

        if (!amuletId || !url) {
            return NextResponse.json({ error: "amuletId and url are required" }, { status: 400 });
        }

        // Check current count for this amulet (max 5 media items)
        const currentCount = await prisma.mediaVault.count({ where: { amuletId } });
        if (currentCount >= 5) {
            return NextResponse.json({ error: "Maximum 5 media items per product" }, { status: 400 });
        }

        const newMedia = await prisma.mediaVault.create({
            data: {
                amuletId,
                url,
                mediaType: mediaType || "IMAGE",
            },
        });

        // If this is the first media, also set it as the primary imageUrl on the Amulet
        if (currentCount === 0) {
            await prisma.amulet.update({
                where: { id: amuletId },
                data: { imageUrl: url },
            });
        }

        revalidatePath(`/amulet/${amuletId}`);
        revalidatePath("/");

        return NextResponse.json({ success: true, media: newMedia });
    } catch (error) {
        console.error("Error creating media:", error);
        return NextResponse.json({ error: "Failed to create media" }, { status: 500 });
    }
}

// DELETE: Remove a media vault entry
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const role = session?.user?.role;
        if (!session?.user?.id || !["ADMIN", "SUPER_ADMIN", "STAFF"].includes(role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Media ID is required" }, { status: 400 });
        }

        const media = await prisma.mediaVault.findUnique({ where: { id } });
        if (!media) {
            return NextResponse.json({ error: "Media not found" }, { status: 404 });
        }

        await prisma.mediaVault.delete({ where: { id } });

        // If we just deleted the primary image, set the next available one
        const remaining = await prisma.mediaVault.findMany({
            where: { amuletId: media.amuletId },
            orderBy: { createdAt: "asc" },
            take: 1,
        });

        if (remaining.length > 0) {
            await prisma.amulet.update({
                where: { id: media.amuletId },
                data: { imageUrl: remaining[0].url },
            });
        }

        revalidatePath(`/amulet/${media.amuletId}`);
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting media:", error);
        return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
    }
}
