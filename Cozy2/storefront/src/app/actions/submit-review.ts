"use server"

import { cookies } from "next/headers";
import { sdk } from "@/lib/medusa";

export async function submitReview(
    _currentState: Record<string, unknown>,
    formData: FormData
) {
    const productId = formData.get("product_id") as string;
    const rating = Number(formData.get("rating"));
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // Safety check
    if (!productId || !rating || rating < 1 || rating > 5) {
        return { error: "Please provide a valid rating and review." };
    }

    // Retrieve Medusa's secure HTTP-only session token to attach to the request
    const cookieStore = await cookies();
    const medusaJwt = cookieStore.get("medusa_jwt")?.value;

    if (!medusaJwt) {
        return { error: "You must be logged in to leave a review." };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                // Proxy the JWT straight to the backend to authenticate the actor boundary
                "Authorization": `Bearer ${medusaJwt}`,
            },
            body: JSON.stringify({
                product_id: productId,
                rating,
                title,
                content
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Failed to submit review");
        }

        // Optimistic UI handles the render, no need to perform an aggressive tag revalidation

        return { success: true };
    } catch (error: any) {
        console.error("Failed placing review:", error);
        return { error: error.message || "An unexpected error occurred." };
    }
}
