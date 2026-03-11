"use client";

import React, { useRef } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/context/wishlist-context";
import { Product } from "@/types";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface WishlistButtonProps {
    product: Product;
    className?: string;
    iconSize?: number;
}

export function WishlistButton({ product, className = "", iconSize = 20 }: WishlistButtonProps) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent linking if inside a Next.js Link
        e.stopPropagation(); // Prevent opening product

        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }

        // Small pop animation
        if (buttonRef.current) {
            gsap.fromTo(buttonRef.current,
                { scale: 0.8 },
                { scale: 1, duration: 0.4, ease: "back.out(2)" }
            );
        }
    };

    return (
        <button
            ref={buttonRef}
            onClick={toggleWishlist}
            className={`flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-zinc-950/10 hover:bg-white transition-all shadow-sm ${className}`}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                size={iconSize}
                className={`transition-colors duration-300 ${inWishlist ? "fill-primary text-primary" : "text-zinc-950/60 hover:text-primary"}`}
            />
        </button>
    );
}
