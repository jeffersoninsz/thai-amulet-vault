import { prisma } from "@/api/db";

interface EmailPayload {
    to: string;
    subject: string;
    orderId: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    addressSnapshot: string;
    customerName: string;
}

/**
 * MOCK EMAIL SYSTEM
 * Instead of relying on a real SMTP server (SendGrid/Resend) for local dev,
 * this function converts the email parameters into a deeply styled HTML block
 * and saves it directly into the database's EmailLog table.
 */
export const dispatchMockEmail = async (payload: EmailPayload) => {
    try {
        const emailHtml = `
            <div style="font-family: serif; max-w-2xl; margin: 0 auto; background-color: #0d0c0b; color: #d4c5b0; padding: 40px; border: 1px solid #c4a265;">
                <div style="text-align: center; border-bottom: 1px solid rgba(196, 162, 101, 0.2); padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #c4a265; font-size: 24px; letter-spacing: 4px; text-transform: uppercase; margin: 0;">SIAM TREASURES</h1>
                    <p style="color: #a39783; font-size: 12px; letter-spacing: 2px; margin-top: 8px;">Order Confirmation</p>
                </div>
                
                <p>Dear ${payload.customerName},</p>
                <p>Your holy artifacts acquisition request has been securely received by the Vault. We are preparing them with the utmost reverence.</p>
                
                <h3 style="color: #f5ebd7; border-bottom: 1px solid rgba(196,162,101,0.2); padding-bottom: 10px; margin-top: 30px;">Order Reference: ${payload.orderId}</h3>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="text-align: left; color: #c4a265; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">
                            <th style="padding: 10px; border-bottom: 1px solid rgba(196, 162, 101, 0.2);">Treasures</th>
                            <th style="padding: 10px; border-bottom: 1px solid rgba(196, 162, 101, 0.2);">Qty</th>
                            <th style="padding: 10px; border-bottom: 1px solid rgba(196, 162, 101, 0.2);">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payload.items.map(item => `
                            <tr>
                                <td style="padding: 15px 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">${item.name}</td>
                                <td style="padding: 15px 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">${item.quantity}</td>
                                <td style="padding: 15px 10px; border-bottom: 1px solid rgba(255,255,255,0.05);">$${item.price.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div style="text-align: right; margin-top: 20px; font-size: 18px;">
                    <span style="color: #a39783;">Total Offering: </span>
                    <strong style="color: #c4a265;">$${payload.total.toFixed(2)}</strong>
                </div>

                <div style="margin-top: 40px; padding: 20px; background-color: rgba(196, 162, 101, 0.05); border-radius: 4px;">
                    <h4 style="color: #c4a265; margin-top: 0;">Destined Vault Location</h4>
                    <p style="font-size: 14px; color: #a39783; line-height: 1.6; margin-bottom: 0;">
                        ${payload.addressSnapshot}
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(196, 162, 101, 0.2); font-size: 11px; color: #8c8273;">
                    <p>May the divine blessings watch over you.</p>
                    <p>© Siam Treasures. All Rights Reserved.</p>
                </div>
            </div>
        `;

        await prisma.emailLog.create({
            data: {
                recipient: payload.to,
                subject: payload.subject,
                bodyHtml: emailHtml,
                status: "SENT",
                orderId: payload.orderId
            }
        });

        console.log(`Mock Email securely dispatched to ${payload.to}`);
        return true;
    } catch (e) {
        console.error("Critical error dispatching mock email", e);
        return false;
    }
};
