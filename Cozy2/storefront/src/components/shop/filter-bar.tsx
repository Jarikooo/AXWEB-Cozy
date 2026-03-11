"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { fetchMedusaCategories } from "@/lib/medusa";
import { CategoryNode } from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP);
}

const PRICE_RANGES = [
    { label: "All Prices", min: undefined, max: undefined },
    { label: "Under €50", min: 0, max: 50 },
    { label: "€50 - €150", min: 50, max: 150 },
    { label: "Over €150", min: 150, max: undefined }
];

export function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<CategoryNode[]>([]);

    const activeCategoryId = searchParams.get("category") || "all";
    const activePriceLabel = searchParams.get("price") || "All Prices";
    const activeSort = searchParams.get("sort") || "latest";

    useEffect(() => {
        fetchMedusaCategories()
            .then((nodes) => {
                setCategories(nodes);
            })
            .catch((err) => {
                console.error("Failed to fetch Medusa categories:", err);
            });
    }, []);

    const setQueryParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all" && value !== "All Prices") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    useGSAP(() => {
        if (!dropdownRef.current) return;

        if (isOpen) {
            gsap.to(dropdownRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });
        } else {
            gsap.to(dropdownRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });
        }
    }, { dependencies: [isOpen], scope: dropdownRef });

    return (
        <div className="sticky top-28 z-40 w-full mb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto bg-background-light/80 backdrop-blur-md rounded-3xl border border-zinc-950/10 p-4 shadow-sm relative">

                {/* Top Bar */}
                <div className="flex justify-between items-center w-full">
                    {/* Desktop Categories */}
                    <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[60%]">
                        <button
                            onClick={() => setQueryParam("category", "all")}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors ${activeCategoryId === "all" ? "bg-zinc-950 text-background-light" : "hover:bg-zinc-950/10 text-zinc-950/70"
                                }`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setQueryParam("category", cat.id)}
                                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-colors ${activeCategoryId === cat.id ? "bg-zinc-950 text-background-light" : "hover:bg-zinc-950/10 text-zinc-950/70"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Category Toggle */}
                    <div className="md:hidden">
                        <div className="px-5 py-2 rounded-full bg-zinc-950 text-background-light text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                            {activeCategoryId === "all" ? "All" : categories.find(c => c.id === activeCategoryId)?.label || "All"} <ChevronDown size={14} />
                        </div>
                    </div>

                    {/* Right Side: Filters Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center gap-3 px-5 py-2 rounded-full border text-xs uppercase tracking-widest font-semibold transition-colors ${isOpen ? "bg-primary text-background-light border-transparent" : "border-zinc-950/20 text-zinc-950 hover:bg-zinc-950/5"
                            }`}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                    </button>
                </div>

                {/* Expandable Filter Area */}
                <div
                    ref={dropdownRef}
                    className="overflow-hidden h-0 opacity-0"
                >
                    <div className="pt-8 pb-4 mt-4 border-t border-zinc-950/10 grid grid-cols-1 md:grid-cols-4 gap-12">

                        {/* Price Filter */}
                        <div>
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium opacity-50 mb-4">Price Range</h4>
                            <ul className="flex flex-col gap-3">
                                {PRICE_RANGES.map(price => (
                                    <li key={price.label}>
                                        <button
                                            onClick={() => setQueryParam("price", price.label)}
                                            className="flex items-center gap-3 group w-full text-left"
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activePriceLabel === price.label ? "bg-primary border-transparent" : "border-zinc-950/30 group-hover:border-zinc-950"
                                                }`}>
                                                {activePriceLabel === price.label && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className={`text-sm ${activePriceLabel === price.label ? "font-semibold" : "opacity-80 group-hover:opacity-100"}`}>
                                                {price.label}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sort Order */}
                        <div>
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium opacity-50 mb-4">Sort By</h4>
                            <ul className="flex flex-col gap-3">
                                {[{ value: "latest", label: "Latest Arrivals" }, { value: "price_asc", label: "Price: Low to High" }, { value: "price_desc", label: "Price: High to Low" }].map(sort => (
                                    <li key={sort.value}>
                                        <button
                                            onClick={() => setQueryParam("sort", sort.value)}
                                            className="flex items-center gap-3 group w-full text-left"
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeSort === sort.value ? "border-primary" : "border-zinc-950/30 group-hover:border-zinc-950"
                                                }`}>
                                                {activeSort === sort.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <span className={`text-sm ${activeSort === sort.value ? "font-semibold" : "opacity-80 group-hover:opacity-100"}`}>
                                                {sort.label}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Simulated Color Filter */}
                        <div>
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium opacity-50 mb-4">Color Palette</h4>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { hex: "bg-[#E6D5C3]", name: "Beige" },
                                    { hex: "bg-[#8D9F87]", name: "Sage" },
                                    { hex: "bg-[#B85C4F]", name: "Terracotta" },
                                    { hex: "bg-[#2D2926]", name: "Charcoal" },
                                    { hex: "bg-white", name: "White" }
                                ].map((color, i) => (
                                    <button
                                        key={i}
                                        title={color.name}
                                        onClick={() => setQueryParam("color", searchParams.get("color") === color.name ? null : color.name)}
                                        className={`w-8 h-8 rounded-full ${color.hex} border transition-all shadow-sm ${searchParams.get("color") === color.name ? "ring-2 ring-offset-2 ring-zinc-950 border-transparent scale-110" : "hover:scale-110 border-zinc-950/10"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Filter */}
                        <div>
                            <h4 className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium opacity-50 mb-4">Size</h4>
                            <div className="flex flex-wrap gap-2">
                                {["Small", "Medium", "Large", "Oversized"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setQueryParam("size", searchParams.get("size") === size ? null : size)}
                                        className={`px-3 py-1.5 rounded-md border text-xs font-semibold hover:bg-zinc-950/10 transition-colors ${searchParams.get("size") === size ? "bg-zinc-950 text-white border-transparent hover:bg-zinc-950" : "border-zinc-950/20 text-zinc-950"}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
