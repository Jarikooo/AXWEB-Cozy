"use client";

import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useCart } from "@/lib/context/cart-context";
import gsap from "gsap";

export function ProductGrid() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { addItem } = useCart();

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
    const [addedToCartId, setAddedToCartId] = useState<string | null>(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);

    // Newsletter state
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Bezig...");
        try {
            const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
            if (res.ok) { setStatus("Ingeschreven!"); setEmail(""); }
            else { setStatus("Fout"); }
        } catch {
            setStatus("Fout");
        }
    };

    // Sort state — initialize from URL if present
    const sortParam = searchParams.get("sort") || "";
    const initialSort = sortParam === "nieuw" ? "Uitgelicht" : sortParam === "prijs-laag" ? "Prijs: Laag-Hoog" : sortParam === "prijs-hoog" ? "Prijs: Hoog-Laag" : "Uitgelicht";
    const [sortBy, setSortBy] = useState(initialSort);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const ITEMS_PER_PAGE = 12;

    const categoryId = searchParams.get("category") || "all";
    const searchQuery = searchParams.get("q") || "";

    // Fetch all products once — boutique catalog, not thousands of items
    useEffect(() => {
        setLoading(true);
        const filters: any = { limit: 200 };
        if (searchQuery) filters.q = searchQuery;

        fetchMedusaProducts(filters)
            .then((response) => {
                setAllProducts(response.products || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("[ProductGrid] Failed to fetch products:", err);
                setLoading(false);
            });
    }, [searchQuery]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryId, sortBy]);

    // Dynamic Filter states
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<number>(500); // 500 default max

    // Extract dynamic options from all products
    const availableColors = useMemo(() => {
        const colors = new Set<string>();
        allProducts.forEach(p => {
             if (p.colors && p.colors.length > 0) {
                 p.colors.forEach(c => c !== "Default" && colors.add(c.toLowerCase()));
             }
        });
        return Array.from(colors);
    }, [allProducts]);

    const availableSizes = useMemo(() => {
        const sizes = new Set<string>();
        allProducts.forEach(p => {
             if (p.sizes && p.sizes.length > 0) {
                 p.sizes.forEach(s => s !== "Default" && sizes.add(s));
             }
        });

        const sizeOrder: Record<string, number> = { "OS": 0, "XS": 1, "S": 2, "M": 3, "L": 4, "XL": 5, "XXL": 6 };
        return Array.from(sizes).sort((a, b) => (sizeOrder[a] ?? 99) - (sizeOrder[b] ?? 99));
    }, [allProducts]);

    const maxPriceAvailable = useMemo(() => {
        let max = 0;
        allProducts.forEach(p => {
             if (p.price > max) max = p.price;
        });
        return Math.max(500, Math.ceil(max / 50) * 50);
    }, [allProducts]);

    const availableCategories = useMemo(() => {
        const catMap = new Map<string, string>();
        allProducts.forEach(p => {
             if (p.category) {
                 const handle = p.categoryHandles?.[0] || p.category.toLowerCase().replace(/\s+/g, '-');
                 catMap.set(handle, p.category);
             }
        });

        const dynamicCats = Array.from(catMap.entries()).map(([id, label]) => ({ id, label }));
        return [{ id: "all", label: "Alle Producten" }, ...dynamicCats];
    }, [allProducts]);

    // Apply client-side filtering & sorting
    const allFetchedProducts = useMemo(() => {
        let allProds = [...allProducts];

        // 1. Category filter
        if (categoryId && categoryId !== "all") {
            allProds = allProds.filter(product =>
                product.categoryHandles?.includes(categoryId) ||
                (product.category && product.category.toLowerCase().includes(categoryId.toLowerCase()))
            );
        }

        // 2. Price filter
        allProds = allProds.filter(product => product.price <= priceRange);

        // 3. Color filter
        if (selectedColor) {
            allProds = allProds.filter(product => 
                product.colors?.some(c => c.toLowerCase() === selectedColor)
            );
        }

        // 4. Size filter
        if (selectedSize) {
            allProds = allProds.filter(product => 
                product.sizes?.includes(selectedSize)
            );
        }

        // 5. Sorting
        if (sortBy === "Uitgelicht") {
             allProds.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        } else if (sortBy === "Prijs: Laag-Hoog") {
             allProds.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Prijs: Hoog-Laag") {
             allProds.sort((a, b) => b.price - a.price);
        }

        return allProds;
    }, [allProducts, categoryId, sortBy, priceRange, selectedColor, selectedSize]);

    // displayed products calculation properly accounting for client-side filtering
    const displayedProducts = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        return allFetchedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    }, [allFetchedProducts, currentPage]);
    
    // total valid pages
    const totalPages = Math.ceil(
        allFetchedProducts.length / ITEMS_PER_PAGE
    );

    const updateCategory = (cat: string) => {
        const params = new URLSearchParams(searchParams);
        if (cat === "all") {
            params.delete("category");
        } else {
            params.set("category", cat);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    // Staggered entrance animation for product cards
    useEffect(() => {
        if (!gridRef.current || displayedProducts.length === 0) return;
        const cards = gridRef.current.querySelectorAll<HTMLElement>(".product-card");
        if (cards.length === 0) return;

        gsap.set(cards, { opacity: 0, y: 30 });
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform",
        });
    }, [displayedProducts]);

    // Wishlist heart bounce
    const bounceHeart = useCallback((el: HTMLElement) => {
        gsap.fromTo(el, { scale: 1 }, {
            scale: 1.4,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
        });
    }, []);

    const generatePageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= (totalPages || 1); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex-1 w-full flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <div className="w-full pt-24 md:pt-32 pb-10 md:pb-14 bg-mint border-b border-[#18181b]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-3">Cozy Mssls.</p>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#18181b] uppercase italic leading-[0.9]">
                        {categoryId === "all" ? "Alle Producten." : `${availableCategories.find(c => c.id === categoryId)?.label || "Shop"}.`}
                    </h1>
                </div>
            </div>

            <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] flex-1">
                {/* Sidebar Filters */}
                <aside className="hidden md:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto scrollbar-hide border-r border-[#18181b] p-8 bg-white z-10 shadow-[4px_0px_0px_rgba(24,24,27,0.05)]">
                <div className="space-y-12">
                    {/* Categories */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 bg-mint border border-[#18181b] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined !text-[16px] text-[#18181b]">category</span>
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Categorieën</h3>
                        </div>
                        <div className="space-y-4">
                            {availableCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateCategory(cat.id)}
                                    className={`relative block w-full text-left font-bold text-xs tracking-widest uppercase transition-all duration-200 border border-[#18181b] p-4 shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] ${
                                        categoryId === cat.id ? "bg-[#ffe4e6]" : "bg-white text-[#18181b]"
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined !text-[16px] text-[#18181b]">payments</span>
                            </div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Max Prijs: €{priceRange}</h3>
                        </div>
                        <div className="space-y-4 border border-[#18181b] p-4 shadow-[4px_4px_0px_#18181b] bg-white">
                            <input 
                                type="range" 
                                min="0"
                                max={maxPriceAvailable}
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-none appearance-none cursor-pointer accent-[#18181b] border-y border-[#18181b]" 
                            />
                            <div className="flex justify-between text-xs font-bold text-[#18181b]">
                                <span>€0</span>
                                <span>€{maxPriceAvailable}</span>
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    {availableColors.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-mint border border-[#18181b] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined !text-[16px] text-[#18181b]">palette</span>
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Kleur</h3>
                                </div>
                                {selectedColor && (
                                    <button onClick={() => setSelectedColor(null)} className="text-[10px] uppercase font-bold text-primary hover:underline">Wissen</button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {availableColors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                                        className={`size-8 border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[5px_5px_0px_#18181b] transition-all ${
                                            selectedColor === color ? "border-2 -translate-y-[2px] -translate-x-[2px] shadow-[5px_5px_0px_#18181b]" : "border"
                                        }`}
                                        style={{ backgroundColor: color, borderStyle: 'solid' }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sizes */}
                    {availableSizes.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined !text-[16px] text-[#18181b]">straighten</span>
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Maat</h3>
                                </div>
                                {selectedSize && (
                                    <button onClick={() => setSelectedSize(null)} className="text-[10px] uppercase font-bold text-primary hover:underline">Wissen</button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {availableSizes.map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                        className={`px-3 py-2 text-xs font-bold border border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[5px_5px_0px_#18181b] transition-all ${
                                            selectedSize === size 
                                                ? "bg-[#ffe4e6] text-[#18181b] shadow-[5px_5px_0px_#18181b] -translate-y-[2px] -translate-x-[2px]" 
                                                : "bg-white text-[#18181b]"
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-[#18181b]/30" onClick={() => setIsMobileFilterOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#18181b] max-h-[75vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#18181b]">Filters</h3>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="size-10 bg-white border border-[#18181b] flex items-center justify-center shadow-[3px_3px_0px_#18181b]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">close</span>
                            </button>
                        </div>
                        <div className="space-y-8">
                            {/* Categories */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-4">Categorie</h4>
                                <div className="flex flex-wrap gap-2">
                                    {availableCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => { updateCategory(cat.id); setIsMobileFilterOpen(false); }}
                                            className={`font-bold text-xs tracking-widest uppercase border border-[#18181b] px-4 py-3 shadow-[3px_3px_0px_#18181b] transition-all ${
                                                categoryId === cat.id ? "bg-[#ffe4e6]" : "bg-white"
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Price */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-4">Max Prijs: €{priceRange}</h4>
                                <input type="range" min="0" max={maxPriceAvailable} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-[#18181b]" />
                                <div className="flex justify-between text-xs font-bold text-[#18181b] mt-2"><span>€0</span><span>€{maxPriceAvailable}</span></div>
                            </div>
                            {/* Colors */}
                            {availableColors.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-4">Kleur</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {availableColors.map(color => (
                                            <button key={color} onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                                                className={`size-10 border-[#18181b] shadow-[3px_3px_0px_#18181b] transition-all ${selectedColor === color ? "border-2 -translate-y-[2px] -translate-x-[2px] shadow-[5px_5px_0px_#18181b]" : "border"}`}
                                                style={{ backgroundColor: color, borderStyle: 'solid' }} title={color} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Sizes */}
                            {availableSizes.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-4">Maat</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map(size => (
                                            <button key={size} onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                                className={`px-4 py-3 text-xs font-bold border border-[#18181b] shadow-[3px_3px_0px_#18181b] transition-all ${selectedSize === size ? "bg-[#ffe4e6]" : "bg-white"}`}>{size}</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="w-full mt-6 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] transition-all">
                            Resultaten Bekijken
                        </button>
                    </div>
                </div>
            )}

            {/* Product Grid Area */}
            <div className="bg-[#f8f5f7] p-6 md:p-8 lg:p-12 w-full flex-1">
                {/* Breadcrumbs & Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#18181b]/60 mb-2">
                            <Link href="/" className="hover:text-[#18181b] transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-[#18181b]">Shop</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-[#18181b] font-bold hidden sm:inline">{allFetchedProducts.length} producten</span>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="md:hidden flex items-center gap-2 text-xs font-bold text-[#18181b] bg-white px-4 py-2 border border-[#18181b] shadow-[3px_3px_0px_#18181b] transition-all"
                        >
                            <span className="material-symbols-outlined !text-[16px]">tune</span>
                            Filters
                        </button>

                        <div className="relative group">
                            <button 
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm font-bold text-[#18181b] bg-white px-4 py-2 border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                            >
                                <span>Sorteer: {sortBy}</span>
                                <span className="material-symbols-outlined !text-[18px]">expand_more</span>
                            </button>
                            
                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] z-50 py-1">
                                    <button onClick={() => { setSortBy("Uitgelicht"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-[#18181b] hover:bg-[#ffe4e6]">Uitgelicht</button>
                                    <button onClick={() => { setSortBy("Prijs: Laag-Hoog"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-[#18181b] hover:bg-[#ffe4e6]">Prijs: Laag-Hoog</button>
                                    <button onClick={() => { setSortBy("Prijs: Hoog-Laag"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-[#18181b] hover:bg-[#ffe4e6]">Prijs: Hoog-Laag</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-4">
                        <div className="size-12 bg-mint border border-[#18181b] flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined !text-[24px] text-[#18181b]">shopping_bag</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Laden...</span>
                    </div>
                ) : displayedProducts.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-6">
                        <div className="size-16 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center">
                            <span className="material-symbols-outlined !text-[32px] text-[#18181b]">search_off</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-extrabold tracking-tighter uppercase italic text-[#18181b] mb-2">Helaas, niks gevonden!</h3>
                            <p className="text-sm text-[#18181b]/60 leading-relaxed max-w-xs">Pas je filters aan of bekijk al onze producten — er is vast iets moois bij.</p>
                        </div>
                        <button
                            onClick={() => { setSelectedColor(null); setSelectedSize(null); setPriceRange(maxPriceAvailable); updateCategory("all"); }}
                            className="px-6 py-3 bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                        >
                            Alle filters wissen
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="product-card group flex flex-col relative h-full">
                                    {/* Image Box */}
                                    <div className="relative aspect-square w-full bg-white border border-[#18181b]">
                                        {/* Inner overflow wrapper for image zoom */}
                                        <div className="absolute inset-0 overflow-hidden">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#f4f4f5]" />
                                            )}
                                        </div>

                                        {/* Tags (inside box, top left) */}
                                        {product.isNew && (
                                            <div className="absolute top-2 left-2 z-10 bg-mint text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">Nieuw</div>
                                        )}
                                        {product.price < 30 && !product.isNew && (
                                            <div className="absolute top-2 left-2 z-10 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">Sale</div>
                                        )}
                                        
                                        {/* Wishlist Button (overlapping top right) */}
                                        <button
                                            onClick={(e) => {
                                                const heartEl = e.currentTarget.querySelector(".heart-icon") as HTMLElement;
                                                if (isInWishlist(product.id)) {
                                                    removeFromWishlist(product.id);
                                                } else {
                                                    addToWishlist(product);
                                                }
                                                if (heartEl) bounceHeart(heartEl);
                                            }}
                                            className="absolute -top-3 -right-3 z-20 size-10 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                                            aria-label={isInWishlist(product.id) ? "Verwijder van verlanglijst" : "Toevoegen aan verlanglijst"}
                                        >
                                            <span
                                                className="heart-icon material-symbols-outlined !text-[20px] text-[#18181b]"
                                                style={isInWishlist(product.id) ? { fontVariationSettings: "'FILL' 1", color: "#f4258c" } : undefined}
                                            >favorite</span>
                                        </button>

                                        {/* Add to Cart Button (overlapping bottom center) */}
                                        <div className="absolute -bottom-5 inset-x-0 z-20 flex justify-center pointer-events-none">
                                            <button
                                                onClick={async () => {
                                                    if (!product.variantId) return;
                                                    setAddingToCartId(product.id);
                                                    try {
                                                        await addItem(product.variantId, 1);
                                                        setAddedToCartId(product.id);
                                                        setTimeout(() => setAddedToCartId(null), 1500);
                                                    } finally {
                                                        setAddingToCartId(null);
                                                    }
                                                }}
                                                disabled={!product.variantId || addingToCartId === product.id}
                                                className={`pointer-events-auto w-3/4 max-w-[200px] h-12 border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-[10px] font-bold uppercase tracking-widest ${
                                                    addedToCartId === product.id
                                                        ? "bg-mint text-[#18181b]"
                                                        : "bg-white text-[#18181b] hover:bg-[#ffe4e6]"
                                                }`}
                                            >
                                                {addingToCartId === product.id ? (
                                                    "Toevoegen..."
                                                ) : addedToCartId === product.id ? (
                                                    <>
                                                        <span className="material-symbols-outlined !text-[20px] text-[#18181b]">check</span>
                                                        Toegevoegd!
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined !text-[20px] text-[#18181b]">add_shopping_cart</span>
                                                        Toevoegen
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        
                                        {/* Link area spanning the image box */}
                                        <Link href={`/products/${product.handle || product.id}`} className="absolute inset-0 z-10" />
                                    </div>
                                    
                                    {/* Product Title / Info (outside) */}
                                    <div className="pt-10 pb-4 flex flex-col items-center text-center">
                                        <Link href={`/products/${product.handle || product.id}`}>
                                            <h3 className="text-lg font-bold text-[#18181b] mb-1 hover:underline">{product.name}</h3>
                                        </Link>
                                        <div className="mt-1 flex items-center justify-center gap-2">
                                            {product.price < 30 && (
                                                <span className="font-bold text-[#18181b]/40 line-through text-xs">€{(product.price * 1.3).toFixed(2)}</span>
                                            )}
                                            <span className="font-bold text-[#18181b]">€{product.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-20 mb-8 flex justify-center">
                            <nav className="flex items-center gap-4">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-12 h-12 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center text-[#18181b] disabled:opacity-50 disabled:shadow-none hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined !text-[24px]">chevron_left</span>
                                </button>
                                
                                <div className="hidden sm:flex items-center gap-3">
                                {generatePageNumbers().map((num) => {
                                    if (
                                        num === 1 ||
                                        num === totalPages ||
                                        (num >= currentPage - 1 && num <= currentPage + 1)
                                    ) {
                                        return (
                                            <button 
                                                key={num}
                                                onClick={() => setCurrentPage(num)}
                                                className={`w-12 h-12 flex items-center justify-center text-sm font-bold border border-[#18181b] transition-all shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] cursor-pointer ${
                                                    currentPage === num 
                                                    ? "bg-[#ffe4e6] text-[#18181b] shadow-[6px_6px_0px_#18181b] -translate-y-[2px] -translate-x-[2px]" 
                                                    : "bg-white text-[#18181b] hover:bg-[#ffe4e6]"
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        );
                                    } else if (
                                        num === currentPage - 2 || 
                                        num === currentPage + 2
                                    ) {
                                        return <span key={num} className="px-2 text-[#18181b] font-bold">...</span>;
                                    }
                                    return null;
                                })}
                                </div>

                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages || totalPages === 0}
                                    className="w-12 h-12 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center text-[#18181b] disabled:opacity-50 disabled:shadow-none hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all cursor-pointer"
                                >
                                    <span className="material-symbols-outlined !text-[24px]">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Newsletter Section */}
        <section className="bg-mint p-8 md:p-16 border-t border-[#18181b]">
            <div className="space-y-6 text-center max-w-md mx-auto">
                <div className="inline-block bg-white border border-[#18181b] px-4 py-2 mb-2">
                    <span className="material-symbols-outlined !text-[20px] text-primary">mail</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-widest text-[#18181b] italic">Word Lid</h2>
                <p className="text-sm text-[#18181b] font-bold tracking-wide">10% korting op je eerste bestelling.</p>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-white border border-[#18181b] px-4 py-4 text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_#18181b] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#18181b] transition-all placeholder:text-[#18181b]/40"
                        placeholder="JOUW@EMAIL.NL"
                        type="email"
                        required
                    />
                    {status === "Ingeschreven!" ? (
                        <div className="flex flex-col items-center gap-3 py-2">
                            <div className="size-12 bg-white border border-[#18181b] flex items-center justify-center">
                                <span className="material-symbols-outlined !text-[24px] text-primary">celebration</span>
                            </div>
                            <p className="text-sm font-bold text-[#18181b]">Welkom bij de Cozy club!</p>
                            <p className="text-xs text-[#18181b]/60">Check je inbox voor je kortingscode.</p>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs py-4 border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:bg-white disabled:hover:shadow-[4px_4px_0px_#18181b]"
                            disabled={status === "Bezig..."}
                        >
                            {status === "Fout" ? "Probeer opnieuw" : status || "Schrijf Me In"}
                        </button>
                    )}
                </form>
            </div>
        </section>
        </div>
    );
}
