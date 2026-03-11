"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { fetchMedusaCategories } from "@/lib/medusa";
import { CategoryNode } from "@/types";

export function Footer() {
    const [categories, setCategories] = useState<CategoryNode[]>([]);

    useEffect(() => {
        fetchMedusaCategories()
            .then((nodes) => {
                setCategories(nodes);
            })
            .catch((err) => {
                console.error("[Footer] Failed to fetch Medusa categories:", err);
            });
    }, []);

    return (
        <footer className="bg-zinc-950 text-background-light rounded-t-[4rem] px-6 md:px-12 pt-24 pb-12 overflow-hidden relative">
            <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[500px]">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">

                    <div className="max-w-sm">
                        <h2 className="font-serif italic text-4xl mb-6">Cozy Mssls.</h2>
                        <p className="font-sans text-sm opacity-80 leading-relaxed">
                            Curated Scandinavian ceramics, lush botanicals, and handpicked home accessories that turn houses into homes.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 font-sans text-sm tracking-wide">

                        <div className="flex flex-col gap-4">
                            <span className="uppercase text-xs opacity-50 tracking-[0.2em] font-medium mb-2">Shop</span>
                            <Link href="/shop" className="hover:text-primary transition-colors flex items-center justify-between group">
                                All Products <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            {categories.map((cat) => (
                                <Link key={cat.id} href={`/shop?category=${cat.id}`} className="hover:text-primary transition-colors flex items-center justify-between group capitalize">
                                    {cat.label} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="uppercase text-xs opacity-50 tracking-[0.2em] font-medium mb-2">Boutique</span>
                            <Link href="/over-ons" className="hover:text-primary transition-colors">Ons Verhaal</Link>
                            <Link href="/veelgestelde-vragen" className="hover:text-primary transition-colors">Veelgestelde Vragen</Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
                        </div>

                        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                            <span className="uppercase text-xs opacity-50 tracking-[0.2em] font-medium mb-2">Status</span>
                            <div className="flex items-center gap-3 bg-background-light/5 px-4 py-3 rounded-2xl border border-white/5 w-fit">
                                <div className="w-2.5 h-2.5 rounded-full bg-mint animate-pulse shadow-[0_0_10px_2px_#4A6B53]" />
                                <span className="uppercase text-xs tracking-widest font-semibold text-background-light/90">
                                    Boutique Open
                                </span>
                            </div>
                            <p className="text-xs opacity-50 mt-2">
                                Visit us in Maassluis<br />
                                Tue-Sat 10:00 - 17:00
                            </p>
                        </div>

                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-24 pt-8 border-t border-background-light/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans opacity-60">
                    <p>© {new Date().getFullYear()} Cozy Mssls. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/algemene-voorwaarden" className="hover:text-white transition-colors">Algemene Voorwaarden</Link>
                        <Link href="/privacybeleid" className="hover:text-white transition-colors">Privacybeleid</Link>
                        <Link href="/retourbeleid" className="hover:text-white transition-colors">Verzending & Retouren</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
