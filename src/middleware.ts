import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Admin routes protection
        if (path.startsWith("/system-admin") || path.startsWith("/admin")) {
            if (!token || (token.role !== "ADMIN" && token.role !== "STAFF" && token.role !== "SUPER_ADMIN")) {
                console.log("Middleware rejected admin access:", token);
                return NextResponse.redirect(new URL("/auth/signin", req.url));
            }
        }

        // Customer routes protection
        if (path.startsWith("/account")) {
            if (!token) {
                return NextResponse.redirect(new URL("/auth/signin", req.url));
            }
        }
    },
    {
        secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-12345",
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/system-admin",
        "/system-admin/:path*",
        "/admin",
        "/admin/:path*",
        "/account",
        "/account/:path*"
    ],
};
