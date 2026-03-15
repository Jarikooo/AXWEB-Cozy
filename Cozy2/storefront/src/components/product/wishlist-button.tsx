"use client";

import React, { useRef } from "react";
import { useWishlist } from "@/lib/context/wishlist-context";
import { Product } from "@/types";
import gsap from "gsap";

interface WishlistButtonProps {
    product: Product;
    className?: string;
}

export function WishlistButton({ product, className = "" }: WishlistButtonProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);
    const iconRef = useRef<HTMLSpanElement>(null);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }

        if (iconRef.current) {
            gsap.fromTo(iconRef.current,
                { scale: 1 },
                { scale: 1.4, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }
            );
        }
    };

    return (
        <button
            onClick={toggleWishlist}
            className={`flex items-center justify-center bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all ${className}`}
            aria-label={inWishlist ? "Verwijder van verlanglijst" : "Toevoegen aan verlanglijst"}
        >
            <span
                ref={iconRef}
                className="material-symbols-outlined !text-[20px] text-[#18181b]"
                style={inWishlist ? { fontVariationSettings: "'FILL' 1", color: "#f4258c" } : undefined}
            >favorite</span>
        </button>
    );
}
