"use client";

import React, { useEffect, useState } from "react";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface FeaturedGridProps {
    title: string;
    limit?: number;
    className?: string;
}

export function FeaturedGrid({ title, limit = 4, className = "" }: FeaturedGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        fetchMedusaProducts({ limit })
            .then(({ products }) => {
                if (isMounted) {
                    setProducts(products);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("[FeaturedGrid] fetch error:", err);
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [limit]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    if (loading) {
        return (
            <div className={`w-full ${className}`}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950/40 mb-8">{title}</h3>
                <div className={`grid grid-cols-2 ${limit > 2 ? 'md:grid-cols-4' : ''} gap-x-6 gap-y-14`}>
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="aspect-square bg-zinc-950/5 animate-pulse border border-zinc-950/10" />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(price);

    return (
        <div className={`w-full ${className}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950/40 mb-8">
                {title}
            </h3>
            <motion.div
                className={`grid grid-cols-2 ${limit > 2 ? 'md:grid-cols-4' : ''} gap-x-6 gap-y-14`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants} className="group flex flex-col relative">
                        {/* Image Box */}
                        <div className="relative aspect-square w-full bg-white border border-[#18181b]">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-100" />
                            )}

                            {product.isNew && (
                                <div className="absolute top-2 left-2 z-10 bg-mint text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">Nieuw</div>
                            )}

                            <Link href={`/products/${product.handle || product.id}`} className="absolute inset-0 z-10" />
                        </div>

                        {/* Product Info */}
                        <div className="pt-4 flex flex-col items-center text-center">
                            <Link href={`/products/${product.handle || product.id}`}>
                                <h4 className="text-sm font-bold text-[#18181b] mb-1 hover:underline line-clamp-1">{product.name}</h4>
                            </Link>
                            <span className="font-bold text-[#18181b] text-sm">
                                {product.price > 0 ? formatPrice(product.price) : "Op aanvraag"}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
