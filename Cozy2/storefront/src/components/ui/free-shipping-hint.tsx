import React from "react";

const FREE_SHIPPING_THRESHOLD = 75;

interface FreeShippingHintProps {
    /** Current cart/wishlist total in euros */
    total: number;
}

export function FreeShippingHint({ total }: FreeShippingHintProps) {
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
    const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
        }).format(price);

    return (
        <div className="w-full flex items-center gap-3">
            <span className="material-symbols-outlined !text-[16px] text-zinc-950/30 shrink-0">local_shipping</span>
            {remaining > 0 ? (
                <p className="text-xs text-zinc-950/50">
                    Nog <span className="font-bold text-zinc-950/70">{formatPrice(remaining)}</span> tot gratis verzending
                </p>
            ) : (
                <p className="text-xs text-zinc-950/50">
                    <span className="font-bold text-primary">Gratis verzending</span> van toepassing
                </p>
            )}
            {remaining > 0 && (
                <div className="flex-1 max-w-[120px] h-1 bg-zinc-950/10 overflow-hidden">
                    <div
                        className="h-full bg-primary/40 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
