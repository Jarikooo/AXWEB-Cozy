import { cn } from "@/lib/utils";
import React from "react";

/**
 * A reusable "Liquid Glass" skeletal loader.
 * Exceeds standard `bg-gray-200` by adding refraction borders and a shimmering pulse.
 */
export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gradient-to-r from-zinc-100 via-background-light/50 to-zinc-100 border border-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
                className
            )}
            {...props}
        />
    );
}
