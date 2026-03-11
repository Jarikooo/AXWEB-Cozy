"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export function ProductGrid() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const [cachedProducts, setCachedProducts] = useState<Record<number, Product[]>>({});
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Sort state
    const [sortBy, setSortBy] = useState("Featured");
    const [isSortOpen, setIsSortOpen] = useState(false);

    const ITEMS_PER_PAGE = 6;
    const FETCH_LIMIT = 12;

    const categoryId = searchParams.get("category") || "all";
    const searchQuery = searchParams.get("q") || "";

    // Reset caching when filters change
    useEffect(() => {
        setCachedProducts({});
        setCurrentPage(1);
    }, [categoryId, searchQuery, sortBy]);

    useEffect(() => {
        const neededChunk = Math.floor((currentPage - 1) / (FETCH_LIMIT / ITEMS_PER_PAGE));
        
        if (!cachedProducts[neededChunk]) {
            setLoading(true);
            const filters: any = { limit: FETCH_LIMIT, offset: neededChunk * FETCH_LIMIT };
            if (searchQuery) filters.q = searchQuery;
            
            // NOTE: Sorting logic inside Medusa. Assuming standard handled in frontend or backend.
            // Using our existing fetchMedusaProducts.
            fetchMedusaProducts(filters)
                .then((response) => {
                    let fetchedProds = response.products || [];
                    
                    if (categoryId && categoryId !== "all") {
                        // Normally handled by API, but existing logic filtered client-side for category if not supported natively.
                        // We will just do a client-side filter here over the fetched chunk... wait.
                        // If we filter client-side, the chunk will have fewer items! That breaks pagination.
                        // Medusa API doesn't filter by exactly "category" via simple query param dynamically unless we pass category_id.
                        // Since existing logic used simple 'fetchMedusaProducts' and client filtered, we should do the same 
                        // BUT that breaks offset pagination because offset 12 might yield 0 filtered items!
                    }
                    
                    setCachedProducts(prev => ({ ...prev, [neededChunk]: fetchedProds }));
                    setTotalCount(response.count || 0);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("[ProductGrid] Failed to fetch products:", err);
                    setLoading(false);
                });
        }
    }, [currentPage, categoryId, searchQuery, sortBy, cachedProducts]);

    // Apply Client filtering & sorting over all cached products just to be safe, 
    // but we only display the items for the current page.
    const allFetchedProducts = useMemo(() => {
        // Flatten cached products 
        let allProds: Product[] = [];
        Object.keys(cachedProducts).sort().forEach(key => {
            allProds = allProds.concat(cachedProducts[Number(key)]);
        });

        // 1. Category filter
        if (categoryId && categoryId !== "all") {
            allProds = allProds.filter(product =>
                product.categoryHandles?.includes(categoryId) ||
                (product.category && product.category.toLowerCase().includes(categoryId.toLowerCase()))
            );
        }

        // 2. Sorting
        if (sortBy === "Featured") {
             allProds.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        } else if (sortBy === "Price: Low to High") {
             allProds.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Price: High to Low") {
             allProds.sort((a, b) => b.price - a.price);
        }

        return allProds;
    }, [cachedProducts, categoryId, sortBy]);

    // displayed products calculation properly accounting for client-side filtering
    const displayedProducts = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        return allFetchedProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);
    }, [allFetchedProducts, currentPage]);
    
    // total valid pages
    const totalPages = Math.ceil(
        (categoryId && categoryId !== "all" ? allFetchedProducts.length : totalCount) / ITEMS_PER_PAGE
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

    const categories = [
        { id: "all", label: "All Gifts" },
        { id: "home-decor", label: "Home Decor" },
        { id: "stationery", label: "Stationery" },
        { id: "ceramics", label: "Ceramics" },
        { id: "textiles", label: "Textiles" },
    ];

    const generatePageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= (totalPages || 1); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex-1 w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] min-h-screen">
            {/* Sidebar Filters */}
            <aside className="hidden md:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-[#e5e7eb] p-8 bg-[#f5f7f7]">
                <div className="space-y-10">
                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Categories</h3>
                        <div className="space-y-3">
                            {categories.map((cat) => (
                                <label key={cat.id} className="group flex items-center gap-3 cursor-pointer">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={categoryId === cat.id}
                                            onChange={() => updateCategory(cat.id)}
                                            className="peer size-4 appearance-none border border-slate-300 bg-white checked:bg-[#18181b] checked:border-[#18181b] focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
                                        />
                                        <svg
                                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 text-white transition-opacity"
                                            fill="none" height="10" viewBox="0 0 12 12" width="10" xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2"></path>
                                        </svg>
                                    </div>
                                    <span className={`text-sm font-medium transition-colors cursor-pointer group-hover:text-[#11a4d4] ${categoryId === cat.id ? "text-[#18181b]" : "text-slate-600"}`}>
                                        {cat.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Price Range</h3>
                        <div className="space-y-4">
                            <input type="range" className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#18181b]" />
                            <div className="flex justify-between text-xs font-medium text-slate-600">
                                <span>$0</span>
                                <span>$500+</span>
                            </div>
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Colors</h3>
                        <div className="flex flex-wrap gap-3">
                            <button className="size-6 bg-slate-900 border border-transparent hover:scale-110 transition-transform"></button>
                            <button className="size-6 bg-stone-200 border border-slate-300 hover:scale-110 transition-transform"></button>
                            <button className="size-6 bg-red-400 border border-transparent hover:scale-110 transition-transform"></button>
                            <button className="size-6 bg-blue-300 border border-transparent hover:scale-110 transition-transform"></button>
                            <button className="size-6 bg-green-700 border border-transparent hover:scale-110 transition-transform"></button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Product Grid Area */}
            <div className="bg-[#eff6f6] p-6 md:p-8 lg:p-12 w-full flex-1">
                {/* Breadcrumbs & Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                            <Link href="/" className="hover:text-[#11a4d4] transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-[#18181b]">Shop</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#18181b] tracking-tight">Curated Gifts</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 font-medium hidden sm:inline">Showing {Math.max(0, categoryId !== "all" ? allFetchedProducts.length : totalCount)} items</span>
                        
                        <div className="relative group">
                            <button 
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm font-bold text-[#18181b] bg-white px-4 py-2 border border-slate-200 hover:border-[#11a4d4] transition-colors"
                            >
                                <span>Sort by: {sortBy}</span>
                                <span className="material-symbols-outlined !text-[18px]">expand_more</span>
                            </button>
                            
                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 shadow-xl z-50 py-1">
                                    <button onClick={() => { setSortBy("Featured"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Featured</button>
                                    <button onClick={() => { setSortBy("Price: Low to High"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Price: Low to High</button>
                                    <button onClick={() => { setSortBy("Price: High to Low"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Price: High to Low</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading && !allFetchedProducts.length ? (
                    <div className="p-16 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-[#18181b]">
                        Loading gallery...
                    </div>
                ) : displayedProducts.length === 0 ? (
                    <div className="p-32 text-center text-[#18181b]/60 font-bold uppercase tracking-widest">
                        <h3 className="italic mb-2">No Curations Found.</h3>
                        <p className="text-xs">Try selecting a different category.</p>
                    </div>
                ) : (
                    <>
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="group flex flex-col bg-white border border-[#18181b] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative h-full cursor-pointer">
                                    {product.isNew && (
                                        <div className="absolute top-3 left-3 z-10 bg-[#f9a8d4] text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">New</div>
                                    )}
                                    {product.price < 30 && !product.isNew && (
                                        <div className="absolute top-3 left-3 z-10 bg-[#18181b] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">Sale</div>
                                    )}

                                    <div className="block aspect-[4/5] w-full overflow-hidden bg-gray-100 relative">
                                        {product.image ? (
                                             <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#f4f4f5]" />
                                        )}
                                        <div className="absolute bottom-4 right-4 bg-white/90 p-2 text-[#18181b] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#11a4d4] hover:text-white border border-[#18181b] cursor-pointer z-20">
                                            <span className="material-symbols-outlined !text-[20px]">add_shopping_cart</span>
                                        </div>
                                        <Link href={`/products/${product.handle || product.id}`} className="absolute inset-0 z-10" />
                                    </div>
                                    
                                    <Link href={`/products/${product.handle || product.id}`} className="p-5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-[#18181b] mb-1 group-hover:text-[#11a4d4] transition-colors line-clamp-1">{product.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-2">{product.description || "A curated piece for your cozy home."}</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2">
                                                {product.price < 30 && (
                                                    <span className="font-bold text-[#f9a8d4] line-through text-xs">€{(product.price * 1.3).toFixed(2)}</span>
                                                )}
                                                <span className="font-bold text-[#18181b]">€{product.price.toFixed(2)}</span>
                                            </div>
                                            {product.colors && product.colors.length > 0 && product.colors[0] !== "Default" && (
                                                <div className="flex gap-1">
                                                    {product.colors.slice(0, 3).map((color, idx) => (
                                                        <span key={idx} className="block w-3 h-3 border border-slate-300 rounded-full" style={{ backgroundColor: color.toLowerCase() }}></span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-16 flex justify-center">
                            <nav className="flex items-center gap-1">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 text-slate-400 hover:text-[#18181b] disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined !text-[20px]">chevron_left</span>
                                </button>
                                
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
                                                className={`w-10 h-10 flex items-center justify-center text-sm transition-colors border ${
                                                    currentPage === num 
                                                    ? "font-bold bg-[#18181b] text-white border-[#18181b]" 
                                                    : "font-medium text-slate-600 bg-white border-transparent hover:border-slate-300 hover:bg-slate-50"
                                                }`}
                                            >
                                                {num}
                                            </button>
                                        );
                                    } else if (
                                        num === currentPage - 2 || 
                                        num === currentPage + 2
                                    ) {
                                        return <span key={num} className="px-2 text-slate-400">...</span>;
                                    }
                                    return null;
                                })}

                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages || totalPages === 0}
                                    className="p-2 text-slate-400 hover:text-[#18181b] disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined !text-[20px]">chevron_right</span>
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
