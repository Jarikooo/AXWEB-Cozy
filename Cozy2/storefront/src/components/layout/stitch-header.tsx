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
    const searchBarRef = useRef<HTMLDivElement>(null);
    const searchOverlayRef = useRef<HTMLDivElement>(null);

    // Debounce search effect (400ms)
    useEffect(() => {
        if (!isSearchOpen) return;
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
            }
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, isSearchOpen, router]);

    const handleSearchOpen = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    // GSAP search bar animation
    useGSAP(() => {
        if (isSearchOpen) {
            gsap.to(searchOverlayRef.current, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.3,
                ease: "power2.out",
            });
            gsap.fromTo(searchBarRef.current,
                { y: "-100%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 0.5,
                    ease: "power4.out",
                    onComplete: () => searchInputRef.current?.focus(),
                }
            );
        } else {
            gsap.to(searchOverlayRef.current, {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.3,
                ease: "power2.in",
            });
            gsap.to(searchBarRef.current, {
                y: "-100%",
                opacity: 0,
                duration: 0.4,
                ease: "power4.in",
            });
        }
    }, { dependencies: [isSearchOpen] });

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
                        <button onClick={handleSearchOpen} className="hover:opacity-70 transition-opacity shrink-0">
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

            {/* Search Backdrop */}
            <div
                ref={searchOverlayRef}
                onClick={handleSearchClose}
                className="fixed inset-0 bg-[#18181b]/20 z-[59] opacity-0 pointer-events-none"
            />

            {/* Search Bar */}
            <div
                ref={searchBarRef}
                className="fixed top-0 left-0 w-full z-[60] -translate-y-full opacity-0"
            >
                <div className="w-full bg-white border-b-2 border-[#18181b] shadow-[0_4px_0px_#18181b] flex items-center px-4 md:px-8 h-[72px]">
                    <span className="material-symbols-outlined !text-[22px] text-[#18181b] mr-4">search</span>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="ZOEK PRODUCTEN..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Escape") handleSearchClose(); }}
                        className="flex-1 bg-transparent border-none outline-none text-sm md:text-base font-extrabold uppercase tracking-widest text-[#18181b] placeholder:text-[#18181b]/25 placeholder:font-bold"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="mr-3 text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 hover:text-primary transition-colors"
                        >
                            Wissen
                        </button>
                    )}
                    <button
                        onClick={handleSearchClose}
                        className="size-10 bg-white border border-[#18181b] flex items-center justify-center shadow-[3px_3px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                    >
                        <span className="material-symbols-outlined !text-[18px] text-[#18181b]">close</span>
                    </button>
                </div>
            </div>

            {/* Sliding Menu Overlay */}
            <div
                ref={overlayRef}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-zinc-950/20 backdrop-blur-sm z-[200] opacity-0 pointer-events-none"
            />

            <div
                ref={menuRef}
                className="fixed top-0 left-0 h-[100dvh] w-full max-w-[420px] bg-background-light border-r border-[#18181b] z-[201] flex flex-col pt-4 -translate-x-full"
            >
                {/* Menu Header */}
                <div className="flex items-center justify-between px-6 pb-4 border-b border-[#18181b]">
                    <button onClick={() => setIsMenuOpen(false)} className="size-10 bg-white border border-[#18181b] flex items-center justify-center shadow-[3px_3px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#18181b] transition-all">
                        <span className="material-symbols-outlined !text-[18px] text-[#18181b]">close</span>
                    </button>
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-[20px] [letter-spacing:-0.05em] text-[#18181b] font-serif font-semibold leading-[30px] hover:opacity-80 transition-opacity">
                        Cozy Mssls.
                    </Link>
                    <div className="w-10" />
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-stretch w-full">
                    {/* Primary Nav Links */}
                    <Link onClick={() => setIsMenuOpen(false)} href="/" className="group py-5 border-b border-[#18181b] flex items-center justify-between w-full hover:bg-mint-light -mx-6 px-6 transition-colors">
                        <span className="text-2xl font-extrabold tracking-tighter uppercase italic text-[#18181b] group-hover:text-primary transition-colors">Home</span>
                        <span className="material-symbols-outlined !text-[20px] text-[#18181b]/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                    </Link>

                    <Link onClick={() => setIsMenuOpen(false)} href="/shop" className="group py-5 border-b border-[#18181b] flex items-center justify-between w-full hover:bg-mint-light -mx-6 px-6 transition-colors">
                        <span className="text-2xl font-extrabold tracking-tighter uppercase italic text-[#18181b] group-hover:text-primary transition-colors">Shop</span>
                        <span className="material-symbols-outlined !text-[20px] text-[#18181b]/30 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                    </Link>

                    {categories.map((cat) => (
                        <div key={cat.id} className="border-b border-[#18181b] flex flex-col w-full">
                            <div className="group flex justify-between items-center w-full py-5 hover:bg-mint-light -mx-6 px-6 transition-colors">
                                <Link onClick={() => setIsMenuOpen(false)} href={`/shop?category=${cat.id}`} className="text-2xl font-extrabold tracking-tighter uppercase italic text-[#18181b] group-hover:text-primary transition-colors text-left flex-1">
                                    {cat.label}
                                </Link>
                                {cat.subcategories && cat.subcategories.length > 0 && (
                                    <button onClick={(e) => toggleCategory(cat.id, e)} className="size-8 border border-[#18181b] flex items-center justify-center bg-white hover:bg-[#ffe4e6] transition-colors shadow-[2px_2px_0px_#18181b]">
                                        <span className="material-symbols-outlined !text-[16px] text-[#18181b]">
                                            {openSubcategories[cat.id] ? "remove" : "add"}
                                        </span>
                                    </button>
                                )}
                            </div>
                            {openSubcategories[cat.id] && cat.subcategories && cat.subcategories.length > 0 && (
                                <div className="flex flex-col pb-5 pl-4 space-y-1 border-t border-[#18181b]/10 pt-3 -mx-6 px-6">
                                    {cat.subcategories.map(sub => (
                                        <Link key={sub.id} onClick={() => setIsMenuOpen(false)} href={`/shop?category=${sub.id}`} className="group/sub flex items-center gap-3 py-2 text-left w-full">
                                            <span className="w-4 h-px bg-[#18181b]/20 group-hover/sub:bg-primary group-hover/sub:w-6 transition-all" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-[#18181b]/60 group-hover/sub:text-primary transition-colors">{sub.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Secondary Nav Links */}
                    <div className="mt-10 flex flex-col gap-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/30 mb-3">Meer</p>
                        <Link onClick={() => setIsMenuOpen(false)} href="/over-ons" className="group flex items-center gap-3 py-3">
                            <span className="material-symbols-outlined !text-[18px] text-[#18181b]/40 group-hover:text-primary transition-colors">info</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-[#18181b]/70 group-hover:text-primary transition-colors">Over Ons</span>
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/contact" className="group flex items-center gap-3 py-3">
                            <span className="material-symbols-outlined !text-[18px] text-[#18181b]/40 group-hover:text-primary transition-colors">mail</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-[#18181b]/70 group-hover:text-primary transition-colors">Contact</span>
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/veelgestelde-vragen" className="group flex items-center gap-3 py-3">
                            <span className="material-symbols-outlined !text-[18px] text-[#18181b]/40 group-hover:text-primary transition-colors">help</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-[#18181b]/70 group-hover:text-primary transition-colors">Veelgestelde Vragen</span>
                        </Link>
                    </div>

                    {/* Account Quick Actions */}
                    <div className="mt-8 flex gap-3">
                        <Link onClick={() => setIsMenuOpen(false)} href="/account" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:bg-mint-light hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#18181b] transition-all">
                            <span className="material-symbols-outlined !text-[16px] text-[#18181b]">person</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]">Account</span>
                        </Link>
                        <Link onClick={() => setIsMenuOpen(false)} href="/wishlist" className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-[#18181b] shadow-[3px_3px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[4px_4px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#18181b] transition-all">
                            <span className="material-symbols-outlined !text-[16px] text-[#18181b]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]">Favorieten</span>
                        </Link>
                    </div>
                </div>

                {/* Menu Footer */}
                <div className="px-6 py-6 border-t border-[#18181b] bg-mint mt-auto shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-3">Volg Ons</p>
                    <div className="flex gap-3">
                        <a href="#" className="size-10 bg-white border border-[#18181b] flex items-center justify-center shadow-[2px_2px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        <a href="#" className="size-10 bg-white border border-[#18181b] flex items-center justify-center shadow-[2px_2px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#18181b] transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
