import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/api/db";
import { dispatchMockEmail } from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2026-02-25.clover"
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized. Please log in to checkout." }, { status: 401 });
        }

        const body = await req.json();
        const { items, address, casingId, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const isWholesale = session.user.role === "WHOLESALE";
        const purchaseOrder = isWholesale ? address.purchaseOrder : null;
        const orderType = isWholesale ? "B2B_WHOLESALE" : "RETAIL";

        // Calculate total securely from DB to prevent client-side tampering
        let total = 0;
        let snapCasingJson = null;
        let casingPrice = 0;
        let casingName = "";

        if (casingId) {
            const casingItem = await prisma.casingOption.findUnique({ where: { id: casingId } });
            if (casingItem && casingItem.isActive) {
                casingPrice = casingItem.additionalPrice;
                casingName = casingItem.name;
                total += casingPrice;
                snapCasingJson = JSON.stringify(casingItem);
            }
        }

        const orderItemsData: { amuletId: string; quantity: number; price: number; name: string }[] = [];

        for (const item of items) {
            const amulet = await prisma.amulet.findUnique({ where: { id: item.amuletId } });
            if (!amulet) {
                return NextResponse.json({ error: `Amulet ${item.amuletId} not found` }, { status: 404 });
            }
            if (amulet.stock < item.quantity) {
                return NextResponse.json({ error: `Not enough stock for ${amulet.nameZh}` }, { status: 400 });
            }

            const minQty = isWholesale ? (amulet.moq || 1) : 1;
            if (item.quantity < minQty) {
                return NextResponse.json({ error: `Minimum order quantity for ${amulet.nameZh} is ${minQty}` }, { status: 400 });
            }

            const finalPrice = (isWholesale && amulet.wholesalePrice) ? amulet.wholesalePrice : amulet.price;

            total += finalPrice * item.quantity;

            orderItemsData.push({
                amuletId: amulet.id,
                quantity: item.quantity,
                price: finalPrice,
                name: amulet.nameEn || amulet.nameZh
            });
        }

        // Use interactive transaction to guarantee atomicity and stock decrement
        const order = await prisma.$transaction(async (tx) => {
            // Decrement stock first
            for (const item of orderItemsData) {
                await tx.amulet.update({
                    where: { id: item.amuletId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Create the order
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    total,
                    status: (isWholesale && paymentMethod === "INVOICE") ? "PENDING_INVOICE" : "PENDING",
                    orderType,
                    purchaseOrder,
                    snapAddress: address.fullAddress + ", " + address.city + ", " + address.postalCode,
                    snapPhone: address.phone,
                    snapCasing: snapCasingJson,
                    items: {
                        create: orderItemsData.map(({ amuletId, quantity, price }) => ({
                            amuletId,
                            quantity,
                            price
                        }))
                    }
                }
            });

            // Log the creation
            await tx.auditLog.create({
                data: {
                    username: session.user.name || session.user.email || "Unknown User",
                    type: "WRITE",
                    action: "CREATED_ORDER",
                    targetId: newOrder.id,
                    details: `Customer created order with ${orderItemsData.length} item records.`
                }
            });

            return newOrder;
        });

        // 1.5 Dispatch Mock Email
        const emailAddress = session.user.email || "guest@example.com";
        const emailCustomerName = address?.firstName || session.user.name || "Valued Collector";

        await dispatchMockEmail({
            to: emailAddress,
            subject: `SiamTreasures Order Confirmation - ${order.id.slice(-8).toUpperCase()}`,
            orderId: order.id,
            items: orderItemsData,
            total: total,
            addressSnapshot: address ? `${address.fullAddress}, ${address.city}, ${address.postalCode}` : "Virtual Delivery",
            customerName: emailCustomerName
        });

        if (isWholesale && paymentMethod === "INVOICE") {
            return NextResponse.json({ success: true, orderId: order.id, bypassedStripe: true });
        }

        // 2. Determine if Stripe is configured
        if (process.env.STRIPE_SECRET_KEY) {
            const line_items = orderItemsData.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects cents
                },
                quantity: item.quantity,
            }));

            // Add casing fee as an add-on item if it exists
            if (casingPrice > 0) {
                line_items.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Vault Casing Upgrade: ${casingName}`,
                        },
                        unit_amount: Math.round(casingPrice * 100),
                    },
                    quantity: 1,
                });
            }

            // Generate absolute URLs for success/cancel
            const host = req.headers.get("origin") || "http://localhost:3000";
            const successUrl = `${host}/checkout?success=true`;
            const cancelUrl = `${host}/cart`;

            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    orderId: order.id
                }
            });

            // Update order with the stripe session ID
            await prisma.order.update({
                where: { id: order.id },
                data: { stripeSessionId: stripeSession.id }
            });

            return NextResponse.json({ url: stripeSession.url });
        } else {
            // Fallback for local development without Stripe keys
            return NextResponse.json({ success: true, orderId: order.id });
        }

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
    }
}
