"use server";

import { cookies, headers } from "next/headers";
import Medusa from "@medusajs/js-sdk";
import { sdk as globalSdk } from "@/lib/medusa";
import { redirect } from "next/navigation";
import { authLimiter } from "@/lib/rate-limit";

const getIsolatedSdk = () => new Medusa({
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://127.0.0.1:9000",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
});

/**
 * Server Action for Customer Login
 */
export async function loginCustomer(formData: FormData) {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const rateCheck = authLimiter(ip);
    if (!rateCheck.allowed) {
        return { error: "Too many login attempts. Please try again in a few minutes." };
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cartId = formData.get("cartId") as string | null;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    try {
        const token = await globalSdk.auth.login("customer", "emailpass", {
            email,
            password,
        });

        if (typeof token !== "string") {
            return { error: "Authentication flow unsupported.", location: token?.location };
        }

        // Set the JWT cookie securely (httpOnly)
        const cookieStore = await cookies();
        cookieStore.set("medusa_jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 Week
        });

        // Set a non-httpOnly cookie to indicate session existence for client-side components
        cookieStore.set("has_session", "true", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 Week
        });

        if (cartId) {
            try {
                const authSdk = getIsolatedSdk();
                await authSdk.client.fetch(`/store/carts/${cartId}/transfer`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (cartError) {
                console.error("[Auth Action Error (Cart Transfer)]", cartError);
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error("[Auth Action Error (Login)]", error);
        return { error: "Invalid email or password." };
    }
}

/**
 * Server Action for Customer Registration
 */
export async function registerCustomer(formData: FormData) {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const rateCheck = authLimiter(ip);
    if (!rateCheck.allowed) {
        return { error: "Too many attempts. Please try again in a few minutes." };
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cartId = formData.get("cartId") as string | null;

    if (!firstName || !lastName || !email || !password) {
        return { error: "All fields are required." };
    }

    try {
        // Step 1: Register auth identity to get a Registration Token
        const registerToken = await globalSdk.auth.register("customer", "emailpass", {
            email,
            password,
        });

        if (typeof registerToken !== "string") {
            return { error: "Failed to obtain registration token." };
        }

        // Step 2: Use the registration token to create the Customer Profile (which links them)
        const authSdk = getIsolatedSdk();
        const response = await authSdk.client.fetch(`/store/customers`, {
            method: "POST",
            headers: { Authorization: `Bearer ${registerToken}` },
            body: {
                first_name: firstName,
                last_name: lastName,
                email,
            }
        }) as { customer: any };
        const { customer } = response;

        // Step 3: Login to get the final JWT token that contains the `actor_id` (Customer ID)
        const loginToken = await globalSdk.auth.login("customer", "emailpass", {
            email,
            password,
        });

        if (typeof loginToken !== "string") {
            return { error: "Authentication flow unsupported after registration.", location: loginToken?.location };
        }

        // Step 4: Save the final JWT to cookies
        const cookieStore = await cookies();
        cookieStore.set("medusa_jwt", loginToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 Week
        });

        // Set a non-httpOnly cookie to indicate session existence for client-side components
        cookieStore.set("has_session", "true", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 1 Week
        });

        if (cartId) {
            try {
                const authSdk = getIsolatedSdk();
                await authSdk.client.fetch(`/store/carts/${cartId}/transfer`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${loginToken}` }
                });
            } catch (cartError) {
                console.error("[Auth Action Error (Cart Transfer)]", cartError);
            }
        }

        return { success: true, customer };
    } catch (error: any) {
        console.error("[Auth Action Error (Register)]", error);
        return { error: "Registration failed. Please try again or use a different email." };
    }
}

/**
 * Server Action to Logout out
 */
export async function logoutCustomer() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("medusa_jwt");
        cookieStore.delete("has_session");
    } catch (error) {
        console.error("[Auth Action Error (Logout)]", error);
    }
    redirect("/account/login");
}

/**
 * Get current customer session. 
 * Note: Should ideally be used in Server Components, or via an API Route if called from client.
 */
export async function getCustomer() {
    const cookieStore = await cookies();
    const token = cookieStore.get("medusa_jwt")?.value;

    if (!token) {
        return null;
    }

    try {
        const authSdk = getIsolatedSdk();

        const response = await authSdk.client.fetch(`/store/customers/me`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        }) as { customer: any };

        const { customer } = response;
        return customer;
    } catch (err: any) {
        // Token is expired or invalid — clear the stale cookies so the user
        // gets a clean redirect to login instead of an error on every visit
        if (err?.message?.includes("Unauthorized") || err?.status === 401) {
            const cookieStore = await cookies();
            cookieStore.delete("medusa_jwt");
            cookieStore.delete("has_session");
        }
        return null;
    }
}
