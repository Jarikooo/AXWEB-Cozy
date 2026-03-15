"use client";

import React, { useState } from "react";
import { StoreCart } from "@medusajs/types";
import { sdk } from "@/lib/medusa";

export function MolliePaymentButton({ cart, notReady }: { cart: StoreCart | null, notReady: boolean }) {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePayment = async () => {
        setSubmitting(true);
        setErrorMessage(null);

        try {
            if (!cart) throw new Error("No cart available.");

            // First, ensure a Mollie payment session is initialized
            const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
                // Trigger payment session reset/init (you could pass an empty payload to force update)
            });

            // Medusa 2.x handles payment collections differently. We assume we initiate a payment session.
            // We will call the Medusa store cart payment session initialization endpoint
            const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
                provider_id: "pp_mollie-hosted-checkout_mollie",
            });

            const session = payment_collection?.payment_sessions?.find(
                (s: any) => s.status === "pending" && s.provider_id === "pp_mollie-hosted-checkout_mollie"
            );

            if (!session) {
                throw new Error("Geen actieve Mollie betaalsessie gevonden.");
            }

            const sessionData = session.data as Record<string, any>;
            const checkoutUrl =
                sessionData?._links?.checkout?.href ||
                sessionData?.url ||
                sessionData?.checkout_url;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                console.error("Mollie sessie data mist een URL:", session.data);
                throw new Error("Kon de Mollie betaallink niet vinden in de backend response.");
            }
        } catch (err: any) {
            let msg = err.message || "An unknown error occurred during checkout.";
            if (msg.toLowerCase().includes("unreachable")) {
                msg = "Localhost constraint: Mollie requires a public Medusa URL (like Ngrok) for webhooks to generate actual checkout links.";
            }
            setErrorMessage(msg);
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                disabled={notReady || submitting}
                onClick={handlePayment}
                className="w-full flex items-center justify-center py-4 bg-[#18181b] text-white text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {submitting ? "Doorsturen naar Mollie..." : "Betaal met Mollie (iDeal / Klarna)"}
            </button>
            {errorMessage && (
                <div className="p-3 bg-[#ffe4e6] text-[#18181b] border border-[#18181b] text-xs font-bold text-center">{errorMessage}</div>
            )}
        </div>
    );
}
