import { NextRequest, NextResponse } from "next/server";
import Medusa from "@medusajs/js-sdk";

const getIsolatedSdk = () => new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("medusa_jwt")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const authSdk = getIsolatedSdk();

        // Fetch active carts for the authenticated customer using our dedicated custom API
        const response = await authSdk.client.fetch(`/store/customers/me/carts`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        }) as { carts?: any[] };

        const carts = response.carts || [];

        if (carts.length > 0) {
            // Get the most recently updated or created cart
            // Since arrays might not be strictly ordered by Medusa, we do a basic sort
            const sortedCarts = carts.sort((a, b) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            return NextResponse.json({ success: true, cart_id: sortedCarts[0].id });
        }

        return NextResponse.json({ success: true, cart_id: null });
    } catch (error: any) {
        console.error("[Cart Sync API Error]", error);
        return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 }); // Sanitized error
    }
}
