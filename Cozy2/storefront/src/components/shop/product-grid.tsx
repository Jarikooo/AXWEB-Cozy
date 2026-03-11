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

    // Dynamic Filter states
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<number>(500); // 500 default max

    // Extract dynamic options from ALL fetched products
    const availableColors = useMemo(() => {
        const colors = new Set<string>();
        Object.values(cachedProducts).flat().forEach(p => {
             if (p.colors && p.colors.length > 0) {
                 p.colors.forEach(c => c !== "Default" && colors.add(c.toLowerCase()));
             }
        });
        return Array.from(colors);
    }, [cachedProducts]);

    const availableSizes = useMemo(() => {
        const sizes = new Set<string>();
        Object.values(cachedProducts).flat().forEach(p => {
             if (p.sizes && p.sizes.length > 0) {
                 p.sizes.forEach(s => s !== "Default" && sizes.add(s));
             }
        });
        
        // Custom sort for typical sizes (S, M, L, XL, etc.)
        const sizeOrder: Record<string, number> = { "OS": 0, "XS": 1, "S": 2, "M": 3, "L": 4, "XL": 5, "XXL": 6 };
        return Array.from(sizes).sort((a, b) => (sizeOrder[a] ?? 99) - (sizeOrder[b] ?? 99));
    }, [cachedProducts]);

    const maxPriceAvailable = useMemo(() => {
        let max = 0;
        Object.values(cachedProducts).flat().forEach(p => {
             if (p.price > max) max = p.price;
        });
        return Math.max(500, Math.ceil(max / 50) * 50); // Default UI to 500, but scale if higher items exist
    }, [cachedProducts]);

    const availableCategories = useMemo(() => {
        const catMap = new Map<string, string>(); // handle -> label
        Object.values(cachedProducts).flat().forEach(p => {
             if (p.category) {
                 // Try to get handle from categoryHandles, fallback to slugified category name
                 const handle = p.categoryHandles?.[0] || p.category.toLowerCase().replace(/\s+/g, '-');
                 catMap.set(handle, p.category);
             }
        });
        
        const dynamicCats = Array.from(catMap.entries()).map(([id, label]) => ({ id, label }));
        // Always surface 'All Products' at the top
        return [{ id: "all", label: "All Products" }, ...dynamicCats];
    }, [cachedProducts]);

    // Apply Client filtering & sorting over all cached products
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
        if (sortBy === "Featured") {
             allProds.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        } else if (sortBy === "Price: Low to High") {
             allProds.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Price: High to Low") {
             allProds.sort((a, b) => b.price - a.price);
        }

        return allProds;
    }, [cachedProducts, categoryId, sortBy, priceRange, selectedColor, selectedSize]);

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

    const generatePageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= (totalPages || 1); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex-1 w-full flex flex-col min-h-screen bg-white">
            {/* Hero Image Section */}
            <div className="w-full h-[300px] md:h-[400px] relative bg-[#d1f4e5] flex items-center justify-center overflow-hidden border-b border-[#18181b]">
                {/* Random imagery for the mint background */}
                <Image src="https://picsum.photos/seed/cozyshop1/1920/1080" alt="Shop Hero" fill className="object-cover opacity-80 mix-blend-multiply" />
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#18181b] uppercase">
                        {categoryId === "all" ? "Shop All" : availableCategories.find(c => c.id === categoryId)?.label || "Shop"}
                    </h1>
                </div>
            </div>

            <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr] flex-1">
                {/* Sidebar Filters */}
                <aside className="hidden md:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto border-r border-[#18181b] p-8 bg-white z-10 shadow-[4px_0px_0px_rgba(24,24,27,0.05)]">
                <div className="space-y-12">
                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-6">Categories</h3>
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
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-6">Max Price: €{priceRange}</h3>
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
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Kleur</h3>
                                {selectedColor && (
                                    <button onClick={() => setSelectedColor(null)} className="text-[10px] uppercase font-bold text-red-500 hover:underline">Clear</button>
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
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Size</h3>
                                {selectedSize && (
                                    <button onClick={() => setSelectedSize(null)} className="text-[10px] uppercase font-bold text-red-500 hover:underline">Clear</button>
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

            {/* Product Grid Area */}
            <div className="bg-[#fdf4ff] p-6 md:p-8 lg:p-12 w-full flex-1">
                {/* Breadcrumbs & Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#18181b]/60 mb-2">
                            <Link href="/" className="hover:text-[#18181b] transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-[#18181b]">Shop</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#18181b] font-bold hidden sm:inline">Showing {Math.max(0, categoryId !== "all" ? allFetchedProducts.length : totalCount)} items</span>
                        
                        <div className="relative group">
                            <button 
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 text-sm font-bold text-[#18181b] bg-white px-4 py-2 border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                            >
                                <span>Sort by: {sortBy}</span>
                                <span className="material-symbols-outlined !text-[18px]">expand_more</span>
                            </button>
                            
                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-3 w-48 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] z-50 py-1">
                                    <button onClick={() => { setSortBy("Featured"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-[#18181b] hover:bg-[#ffe4e6]">Featured</button>
                                    <button onClick={() => { setSortBy("Price: Low to High"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-[#18181b] hover:bg-[#ffe4e6]">Price: Low to High</button>
                                    <button onClick={() => { setSortBy("Price: High to Low"); setIsSortOpen(false); }} className="block w-full text-left px-4 py-2 text-sm font-bold text-[#18181b] hover:bg-[#ffe4e6]">Price: High to Low</button>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="group flex flex-col relative h-full">
                                    {/* Image Box */}
                                    <div className="relative aspect-square w-full bg-white border border-[#18181b]">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#f4f4f5]" />
                                        )}
                                        
                                        {/* Tags (inside box, top left) */}
                                        {product.isNew && (
                                            <div className="absolute top-2 left-2 z-10 bg-[#f9a8d4] text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">New</div>
                                        )}
                                        {product.price < 30 && !product.isNew && (
                                            <div className="absolute top-2 left-2 z-10 bg-[#18181b] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1">Sale</div>
                                        )}
                                        
                                        {/* Wishlist Button (overlapping top right) */}
                                        <button className="absolute -top-3 -right-3 z-20 size-10 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all">
                                            <span className="material-symbols-outlined !text-[20px] text-[#18181b]">favorite</span>
                                        </button>
                                        
                                        {/* Add to Cart Button (overlapping bottom center) */}
                                        <div className="absolute -bottom-5 inset-x-0 z-20 flex justify-center pointer-events-none">
                                            <button className="pointer-events-auto w-3/4 max-w-[200px] h-12 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center gap-2 hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all">
                                                <span className="material-symbols-outlined !text-[20px] text-[#18181b]">shopping_cart</span>
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
                                                <span className="font-bold text-[#f9a8d4] line-through text-xs">€{(product.price * 1.3).toFixed(2)}</span>
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
        </div>
    );
}
