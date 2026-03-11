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

    // Parent animation variant for staggered children
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
            <div className={`mt-8 w-full ${className}`}>
                <h3 className="font-serif italic text-xl text-zinc-950 mb-4">{title}</h3>
                <div className={`grid grid-cols-2 ${limit > 2 ? 'md:grid-cols-4' : ''} gap-4`}>
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-950/5 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className={`mt-8 w-full ${className}`}>
            <h3 className="font-serif italic text-xl text-zinc-950 mb-4 leading-none">
                {title}
            </h3>
            <motion.div
                className={`grid grid-cols-2 ${limit > 2 ? 'md:grid-cols-4' : ''} gap-4`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {products.map((product) => {
                    const priceFormatted = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "eur",
                        minimumFractionDigits: 2,
                    }).format(product.price);

                    return (
                        <motion.div key={product.id} variants={itemVariants}>
                            <Link href={`/products/${product.handle || product.id}`} className="group flex flex-col h-full">
                                <div className="relative w-full aspect-[3/4] bg-background-light/50 rounded-2xl overflow-hidden mb-3 border border-zinc-950/5 shadow-sm">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                                    />
                                    {/* Glassmorphism Quick view overlay */}
                                    <div className="absolute inset-x-2 bottom-2 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <div className="w-full py-2 bg-white/80 backdrop-blur-md text-zinc-950 rounded-xl font-sans text-[10px] font-bold uppercase tracking-widest text-center shadow-lg border border-white/20">
                                            View
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-auto">
                                    <h4 className="font-serif italic text-sm text-zinc-950 line-clamp-1 group-hover:text-primary transition-colors">
                                        {product.name}
                                    </h4>
                                    <span className="font-sans text-xs font-medium text-zinc-950/60">
                                        {product.price > 0 ? priceFormatted : "POA"}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
