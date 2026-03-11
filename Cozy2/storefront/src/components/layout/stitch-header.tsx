"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/context/cart-context";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fetchMedusaCategories } from "@/lib/medusa";
import { CategoryNode } from "@/types";

export function StitchHeader() {
    const router = useRouter();
    const { setIsCartOpen, itemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryNode[]>([]);
    const [openSubcategories, setOpenSubcategories] = useState<Record<string, boolean>>({});

    // Search state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Debounce search effect (400ms)
    useEffect(() => {
        if (!isSearchOpen) return;
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            } else if (searchQuery === "" && isSearchOpen) {
                // Optional: clear search if input is empty
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, isSearchOpen, router]);

    const handleSearchToggle = () => {
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
    };

    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        fetchMedusaCategories()
            .then(data => {
                if (isMounted) setCategories(data || []);
            })
            .catch(console.error);
        return () => { isMounted = false; };
    }, []);

    useGSAP(() => {
        if (isMenuOpen) {
            gsap.to(overlayRef.current, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.4,
                ease: "power3.out",
            });
            gsap.to(menuRef.current, {
                x: "0%",
                duration: 0.6,
                ease: "power4.out",
            });
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.4,
                ease: "power3.in",
            });
            gsap.to(menuRef.current, {
                x: "-100%",
                duration: 0.5,
                ease: "power4.in",
            });
        }
    }, { dependencies: [isMenuOpen] });

    const toggleCategory = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenSubcategories(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <header className="fixed top-4 w-full z-50 flex justify-center px-4 md:px-8 pointer-events-none">
                <div className="flex items-center justify-between py-4 px-4 md:px-8 h-14 w-full max-w-[1151px] bg-[#FDFDFD66] border border-solid border-[#09090B1A] outline outline-1 outline-[#000000] backdrop-blur-md pointer-events-auto transition-colors">
                    
                    {/* Left: Hamburger & Shop */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <button onClick={() => setIsMenuOpen(true)} className="flex items-center justify-center bg-transparent shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:opacity-70 transition-opacity">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </button>
                        <Link href="/shop" className="hidden sm:inline-block text-[14px] [letter-spacing:0.05em] uppercase text-[#09090B] font-sans font-semibold leading-[18px] hover:text-[#F655A6] transition-colors">
                            Shop
                        </Link>
                    </div>

                    {/* Center: Over Ons + Logo */}
                    <div className="flex items-center relative flex-1 justify-start sm:ml-6 h-full">
                        <Link href="/over-ons" className="hidden md:inline-block text-[14px] [letter-spacing:0.05em] uppercase text-[#09090B] font-sans font-semibold leading-[18px] hover:text-[#F655A6] transition-colors">
                            Over Ons
                        </Link>
                        <Link href="/" className="absolute left-[50%] top-1/2 -translate-y-1/2 -translate-x-[50%] text-[20px] md:text-[24px] [letter-spacing:-0.05em] text-[#09090B] font-serif font-semibold leading-[30px] hover:opacity-80 transition-opacity whitespace-nowrap">
                            Cozy Mssls.
                        </Link>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <Link href="/wishlist" className="hover:opacity-70 transition-opacity shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </Link>
                        <Link href="/account" className="hidden sm:block hover:opacity-70 transition-opacity shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </Link>
                        <button onClick={handleSearchToggle} className="hover:opacity-70 transition-opacity shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                        <button onClick={() => setIsCartOpen(true)} className="hover:opacity-70 transition-opacity relative shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                <path d="M3 6h18" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-[6px] -right-[6px] bg-[#F655A6] text-white text-[9px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full leading-none z-10">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Search Overlay Bar */}
            {isSearchOpen && (
                <div className="fixed top-0 left-0 w-full h-[73px] bg-background-light border-b border-zinc-950 z-[60] flex items-center px-4 animate-in fade-in slide-in-from-top-4 duration-200">
                    <span className="material-symbols-outlined text-zinc-950 mr-3">search</span>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="SEARCH CURIOSITIES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm md:text-base font-bold uppercase tracking-widest text-zinc-950 placeholder:text-zinc-950/30"
                    />
                    <button
                        onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                        }}
                        className="flex items-center justify-center text-zinc-950 hover:text-primary ml-3"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}

            {/* Sliding Menu Overlay */}
            <div
                ref={overlayRef}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[200] opacity-0 pointer-events-none"
            />

            <div
                ref={menuRef}
                className="fixed top-0 left-0 h-[100dvh] w-full max-w-[400px] bg-background-light border-r border-zinc-950/10 z-[201] flex flex-col pt-4 -translate-x-full shadow-2xl"
            >
                <div className="flex items-center justify-between px-4 pb-4 border-b border-zinc-950">
                    <button onClick={() => setIsMenuOpen(false)} className="flex size-10 items-center justify-center">
                        <span className="material-symbols-outlined text-zinc-950">close</span>
                    </button>
                    <h2 className="text-zinc-950 text-xl font-extrabold leading-tight tracking-tighter uppercase">
                        Menu
                    </h2>
                    <div className="w-10"></div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-stretch w-full">
                    <Link onClick={() => setIsMenuOpen(false)} href="/" className="py-4 border-b border-zinc-950 font-sans text-3xl font-medium text-zinc-950 hover:text-primary transition-colors text-left w-full">
                        Home
                    </Link>

                    {categories.map((cat) => (
                        <div key={cat.id} className="border-b border-zinc-950 flex flex-col w-full">
                            <div className="flex justify-between items-center w-full py-4">
                                <Link onClick={() => setIsMenuOpen(false)} href={`/shop?category=${cat.id}`} className="font-sans text-3xl font-medium text-zinc-950 hover:text-primary transition-colors text-left flex-1">
                                    {cat.label}
                                </Link>
                                {cat.subcategories && cat.subcategories.length > 0 && (
                                    <button onClick={(e) => toggleCategory(cat.id, e)} className="p-2 text-zinc-950 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                                        <span className="material-symbols-outlined">
                                            {openSubcategories[cat.id] ? "remove" : "add"}
                                        </span>
                                    </button>
                                )}
                            </div>
                            {openSubcategories[cat.id] && cat.subcategories && cat.subcategories.length > 0 && (
                                <div className="flex flex-col pb-4 pl-4 space-y-4 border-t border-zinc-950/10 pt-4">
                                    {cat.subcategories.map(sub => (
                                        <Link key={sub.id} onClick={() => setIsMenuOpen(false)} href={`/shop?category=${sub.id}`} className="font-sans text-xl font-medium text-zinc-950/70 hover:text-zinc-950 transition-colors text-left w-full">
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="mt-12 flex flex-col gap-5">
                        <Link onClick={() => setIsMenuOpen(false)} href="/over-ons" className="font-sans text-xl font-medium text-zinc-950/80 hover:text-zinc-950 transition-colors">
                            About Us
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/contact" className="font-sans text-xl font-medium text-zinc-950/80 hover:text-zinc-950 transition-colors">
                            Contact
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/veelgestelde-vragen" className="font-sans text-xl font-medium text-zinc-950/80 hover:text-zinc-950 transition-colors">
                            FAQ
                        </Link>
                    </div>
                </div>

                <div className="px-6 py-8 border-t border-zinc-950 bg-mint mt-auto shrink-0">
                    <p className="font-sans text-xs uppercase tracking-widest font-bold text-zinc-950 mb-2">Connect</p>
                    <div className="flex gap-4">
                        <a href="#" className="font-sans text-sm font-medium text-zinc-950/70 hover:text-zinc-950">Instagram</a>
                        <a href="#" className="font-sans text-sm font-medium text-zinc-950/70 hover:text-zinc-950">Pinterest</a>
                    </div>
                </div>
            </div>
        </>
    );
}
