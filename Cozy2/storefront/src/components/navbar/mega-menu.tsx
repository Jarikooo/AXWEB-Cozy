"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { sdk, fetchMedusaCategories } from "@/lib/medusa";
import { CategoryNode } from "@/types";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP);
}

interface MegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const DUMMY_CATEGORIES = [
    { id: "1", name: "Ceramics" },
    { id: "2", name: "Botanicals" },
    { id: "3", name: "Textiles" },
    { id: "4", name: "Furniture" }
];

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories from Medusa
    useEffect(() => {
        fetchMedusaCategories()
            .then((nodes) => {
                console.log("[MegaMenu] Fetch Categories Success:", nodes);
                setCategories(nodes.length > 0 ? nodes : DUMMY_CATEGORIES as any);
                setLoading(false);
            })
            .catch((err) => {
                console.error("[MegaMenu] Failed to fetch Medusa categories, falling back to dummy:", err);
                setCategories(DUMMY_CATEGORIES as any);
                setLoading(false);
            });
    }, []);

    useGSAP(() => {
        if (!overlayRef.current || !menuRef.current || !containerRef.current || !lineRef.current) return;

        const tl = gsap.timeline();

        if (isOpen) {
            // Un-hide wrapper
            gsap.set(containerRef.current, { display: "block" });

            // Fade in overlay
            tl.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" })

                // Slide in menu from top with blur morphing
                .fromTo(menuRef.current,
                    { y: "-100%", filter: "blur(20px)", opacity: 0 },
                    { y: "0%", filter: "blur(0px)", opacity: 1, duration: 0.6, ease: "power3.out" },
                    "<0.1"
                )

                // Animate separating line width
                .fromTo(lineRef.current,
                    { scaleX: 0, transformOrigin: "left center" },
                    { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
                    "-=0.4"
                );

            // Animate staggering links
            const links = gsap.utils.toArray(".menu-stagger-link", menuRef.current);
            if (links.length) {
                tl.fromTo(links,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" },
                    "-=0.4"
                );
            }
        } else {
            // Animate out
            tl.to(menuRef.current, { y: "-100%", filter: "blur(10px)", opacity: 0, duration: 0.4, ease: "power3.in" })
                .to(overlayRef.current, { opacity: 0, duration: 0.3 }, "<0.1")
                .set(containerRef.current, { display: "none" });
        }

    }, { dependencies: [isOpen, categories], scope: containerRef });

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100] hidden">
            {/* Background Overlay */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm opacity-0"
                onClick={onClose}
            />

            {/* The Menu Drawer */}
            <div
                ref={menuRef}
                className="absolute top-0 left-0 w-full bg-background-light text-zinc-950 rounded-b-[2rem] shadow-2xl opacity-0 overflow-hidden"
            >
                {/* Close button — pinned top-right */}
                <div className="flex justify-end px-6 md:px-10 pt-5">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 border border-zinc-950 flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-colors group shadow-[3px_3px_0px_#18181b]"
                        aria-label="Sluit menu"
                    >
                        <X size={18} strokeWidth={2} className="group-hover:scale-90 transition-transform" />
                    </button>
                </div>

                <div className="max-w-5xl mx-auto px-6 md:px-10 pb-8">
                    {/* Separating line */}
                    <div ref={lineRef} className="w-full h-px bg-zinc-950/10 mb-6 mt-3" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

                        {/* Shop */}
                        <div>
                            <h3 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-primary mb-3">Shop</h3>
                            {loading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => <div key={i} className="h-7 bg-zinc-950/5 animate-pulse w-40" />)}
                                </div>
                            ) : (
                                <ul className="flex flex-col">
                                    <li className="menu-stagger-link">
                                        <Link href="/shop" onClick={onClose} className="flex items-center justify-between w-full px-3 py-2.5 text-base font-bold uppercase tracking-wide hover:bg-[#ffe4e6] transition-colors group">
                                            Alle Producten
                                            <ArrowRight size={15} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id} className="menu-stagger-link">
                                            <Link href={`/shop?category=${cat.id}`} onClick={onClose} className="flex items-center justify-between w-full px-3 py-2.5 text-base font-bold uppercase tracking-wide hover:bg-[#ffe4e6] transition-colors group capitalize">
                                                {cat.label}
                                                <ArrowRight size={15} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Pages */}
                        <div>
                            <h3 className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-zinc-950/40 mb-3">Meer</h3>
                            <ul className="flex flex-col">
                                <li className="menu-stagger-link">
                                    <Link href="/about" onClick={onClose} className="flex items-center w-full px-3 py-2.5 text-base font-bold uppercase tracking-wide hover:bg-[#ffe4e6] transition-colors">
                                        Ons Verhaal
                                    </Link>
                                </li>
                                <li className="menu-stagger-link">
                                    <Link href="/visit" onClick={onClose} className="flex items-center w-full px-3 py-2.5 text-base font-bold uppercase tracking-wide hover:bg-[#ffe4e6] transition-colors">
                                        Bezoek Maassluis
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
