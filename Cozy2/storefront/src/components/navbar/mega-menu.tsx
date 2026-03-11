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
                className="absolute top-0 left-0 w-full bg-background-light text-zinc-950 rounded-b-[3rem] shadow-2xl opacity-0"
            >
                {/* Whitespace buffer to clear the Floating Navbar */}
                <div className="pt-24 md:pt-32 px-8 md:px-16" />

                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    {/* Animated Separating Line */}
                    <div ref={lineRef} className="w-full h-px bg-zinc-950/10 mb-12 md:mb-16" />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 md:pb-24 min-h-[50vh]">

                        {/* Left Column: Shop Collections */}
                        <div className="md:col-span-5">
                            <h3 className="font-sans text-xs uppercase tracking-[0.2em] font-medium text-primary mb-8">Shop Collections</h3>
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => <div key={i} className="h-8 bg-zinc-950/5 rounded animate-pulse w-48" />)}
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-5">
                                    <li className="menu-stagger-link">
                                        <Link href="/shop" onClick={onClose} className="font-serif text-4xl hover:text-primary flex items-center group transition-colors">
                                            All Products <ArrowRight size={24} className="ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </li>
                                    {categories.map(cat => (
                                        <li key={cat.id} className="menu-stagger-link">
                                            <Link href={`/shop?category=${cat.id}`} onClick={onClose} className="font-serif text-4xl hover:text-primary flex items-center group transition-colors capitalize">
                                                {cat.label} <ArrowRight size={24} className="ml-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Middle Column: Boutique Navigation */}
                        <div className="md:col-span-3">
                            <h3 className="font-sans text-xs uppercase tracking-[0.2em] font-medium opacity-50 mb-8">Boutique</h3>
                            <ul className="flex flex-col gap-6">
                                <li className="menu-stagger-link">
                                    <Link href="/journal" onClick={onClose} className="font-serif text-2xl hover:text-primary transition-colors">
                                        Journal
                                    </Link>
                                </li>
                                <li className="menu-stagger-link">
                                    <Link href="/about" onClick={onClose} className="font-serif text-2xl hover:text-primary transition-colors">
                                        Our Story
                                    </Link>
                                </li>
                                <li className="menu-stagger-link">
                                    <Link href="/visit" onClick={onClose} className="font-serif text-2xl hover:text-primary transition-colors">
                                        Visit Maassluis
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Right Column: Close Header & Large Brand Logo */}
                        <div className="md:col-span-4 flex flex-col justify-between items-end text-right h-full">
                            <button
                                onClick={onClose}
                                className="w-12 h-12 rounded-full border border-zinc-950/20 flex flex-shrink-0 items-center justify-center hover:bg-zinc-950 hover:text-background-light transition-colors group"
                                aria-label="Close menu"
                            >
                                <X size={20} strokeWidth={1.5} className="group-hover:scale-90 transition-transform" />
                            </button>

                            <div className="mt-auto pt-12">
                                <h2 className="font-serif italic text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-primary leading-none tracking-tight">
                                    Cozy<br />Mssls.
                                </h2>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
