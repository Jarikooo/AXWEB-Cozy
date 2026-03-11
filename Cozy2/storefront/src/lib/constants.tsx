import React from "react"
import { CreditCard } from "lucide-react"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
    string,
    { title: string; icon: React.JSX.Element }
> = {
    pp_stripe_stripe: {
        title: "Credit card",
        icon: <CreditCard />,
    },
    "pp_medusa-payments_default": {
        title: "Credit card",
        icon: <CreditCard />,
    },
    pp_system_default: {
        title: "Manual Payment",
        icon: <CreditCard />,
    },
}

// Checks if it is native stripe or medusa payments for card payments
export const isStripeLike = (providerId?: string) => {
    return (
        providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
    )
}

export const isManual = (providerId?: string) => {
    return providerId?.startsWith("pp_system_default")
}

export const isMollie = (providerId?: string) => {
    return providerId?.includes("mollie")
}
