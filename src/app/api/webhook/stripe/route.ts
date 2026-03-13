import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/api/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2026-02-25.clover",
});

// Since Next.js parses body to JSON automatically, for stripe webhooks we need the raw body
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
    }

    const payload = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed.`, err.message);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.orderId) {
            // Mark order as PAID
            await prisma.order.update({
                where: { id: session.metadata.orderId },
                data: { status: 'PAID' }
            });

            // Audit Log
            await prisma.auditLog.create({
                data: {
                    username: "SYSTEM",
                    type: "SYSTEM",
                    action: "PAYMENT_RECEIVED",
                    targetId: session.metadata.orderId,
                    details: `Stripe webhook confirmed payment for session ${session.id}. Order marked as PAID.`
                }
            });
        }
    }

    return NextResponse.json({ received: true });
}
