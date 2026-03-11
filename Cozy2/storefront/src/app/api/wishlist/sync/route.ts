import { NextRequest, NextResponse } from "next/server";
import Medusa from "@medusajs/js-sdk";

const getIsolatedSdk = () => new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("medusa_jwt")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { wishlist } = body;

        if (!Array.isArray(wishlist)) {
            return NextResponse.json({ error: "Invalid wishlist format" }, { status: 400 });
        }

        // We use a separate instance to pass the auth header since the global SDK
        // runs on the server edge but might not perfectly persist headers across parallel requests.
        const authSdk = getIsolatedSdk();

        const response = await authSdk.client.fetch(`/store/customers/me`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: { metadata: { wishlist } }
        }) as { customer: any };
        const { customer } = response;

        return NextResponse.json({ success: true, customer });
    } catch (error: any) {
        console.error("[Wishlist Sync API Error]", error);
        return NextResponse.json({ error: "Failed to sync wishlist. Please try again." }, { status: 500 });
    }
}
