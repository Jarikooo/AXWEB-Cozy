"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Search, Menu, X, Heart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MegaMenu } from "./mega-menu";
import { sdk } from "@/lib/medusa";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useDebounce } from "use-debounce";
import { Skeleton } from "@/components/ui/skeleton";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Custom hook for the Typewriter "Command Input" effect
// Cycles through prompts infinitely when input is empty
const prompts = [
    "Search for 'linen throw'...",
    "Looking for a 'ceramic mug'?",
    "Find your 'wooden stool'...",
    "Search 'scandinavian vase'...",
];

function useTypewriter(strings: string[], typingSpeed = 50, deletingSpeed = 30, delayBetween = 2500) {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);

    useEffect(() => {
        const i = loopNum % strings.length;
        const fullText = strings[i];

        const timer = setTimeout(() => {
            setText(fullText.substring(0, text.length + (isDeleting ? -1 : 1)));

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), delayBetween);
            } else if (isDeleting && text === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        }, isDeleting ? deletingSpeed : typingSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, strings, typingSpeed, deletingSpeed, delayBetween]);

    return text;
}

export function FloatingNav() {
    const navRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchWrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { setIsCartOpen, itemCount } = useCart();
    const { wishlist } = useWishlist();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const typewriterPlaceholder = useTypewriter(prompts);

    // Focus input when search opens
    React.useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 300);
        } else if (!isSearchOpen) {
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [isSearchOpen]);

    // Live Search Logic with useDebounce
    React.useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                // Fetch products matching query from Medusa
                const { products } = await sdk.store.product.list({
                    q: debouncedQuery,
                    limit: 4,
                    fields: "id,title,handle,thumbnail,variants.*,variants.calculated_price.*"
                });

                setSearchResults(products || []);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
        }
    };

    useGSAP(() => {
        // Animate Nav Scroll state
        if (navRef.current) {
            ScrollTrigger.create({
                start: "top -50",
                end: 99999,
                toggleClass: {
                    targets: navRef.current,
                    className: "nav-scrolled"
                }
            });
        }

        // Animate Search Bar Dropdown mimicking MegaMenu
        if (searchWrapperRef.current) {
            if (isSearchOpen) {
                gsap.set(searchWrapperRef.current, { display: "flex" });
                gsap.fromTo(searchWrapperRef.current,
                    { y: -40, filter: "blur(10px)", opacity: 0 },
                    { y: 0, filter: "blur(0px)", opacity: 1, duration: 0.5, ease: "power3.out" }
                );
            } else {
                gsap.to(searchWrapperRef.current, {
                    y: -40, filter: "blur(10px)", opacity: 0, duration: 0.3, ease: "power3.in",
                    onComplete: () => {
                        gsap.set(searchWrapperRef.current, { display: "none" });
                    }
                });
            }
        }
    }, { dependencies: [isSearchOpen] });

    return (
        <>
            <div className={`fixed top-6 left-0 right-0 ${isMenuOpen || isSearchOpen ? 'z-[101]' : 'z-50'} flex flex-col items-center px-4 w-full pointer-events-none transition-all duration-300`}>
                <nav
                    ref={navRef}
                    className="
                        pointer-events-auto
                        flex items-center justify-between
                        px-8 py-4 w-full max-w-5xl
                        rounded-4xl
                        transition-all duration-500 ease-out
                        relative z-50
                        
                        /* Initial state: Soft translucent background for contrast on hero images */
                        bg-background-light/40 text-zinc-950 border border-zinc-950/10 backdrop-blur-sm
                        
                        /* Scrolled state applied via GSAP toggleClass */
                        [&.nav-scrolled]:bg-background-light/80 
                        [&.nav-scrolled]:backdrop-blur-md 
                        [&.nav-scrolled]:text-primary
                        [&.nav-scrolled]:border-primary/20
                        [&.nav-scrolled]:shadow-sm
                    "
                >
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsMenuOpen(true)} className="font-sans text-sm tracking-wide font-medium uppercase hover:opacity-70 transition-opacity">
                            Shop
                        </button>
                        <Link href="/over-ons" className="font-sans text-sm tracking-wide font-medium uppercase hover:opacity-70 transition-opacity hidden md:block">
                            Over Ons
                        </Link>
                    </div>

                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="font-serif text-2xl font-semibold tracking-tight absolute left-1/2 -translate-x-1/2">
                        Cozy Mssls.
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/wishlist" aria-label="Wishlist" className="hover:opacity-70 transition-opacity relative hidden sm:block">
                            <Heart size={18} strokeWidth={2} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1.5 bg-primary text-background-light text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link href="/account" aria-label="Account" className="hover:opacity-70 transition-opacity hidden sm:block">
                            <User size={18} strokeWidth={2} />
                        </Link>
                        <button
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Search size={18} strokeWidth={2} />
                        </button>
                        <button aria-label="Cart" onClick={() => setIsCartOpen(true)} className="hover:opacity-70 transition-opacity relative">
                            <ShoppingBag size={18} strokeWidth={2} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1.5 bg-primary text-background-light text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                        <button aria-label="Menu" onClick={() => setIsMenuOpen(true)} className="hover:opacity-70 transition-opacity md:hidden">
                            <Menu size={18} strokeWidth={2} />
                        </button>
                    </div>
                </nav>

                {/* Dropdown Search Bar - Rendered absolute behind nav */}
                <div
                    ref={searchWrapperRef}
                    className="absolute top-12 left-0 right-0 flex flex-col items-center px-4 w-full pointer-events-none hidden -z-10"
                    style={{ perspective: "1000px" }}
                >
                    <div className="w-full max-w-4xl flex flex-col shadow-xl rounded-b-[1.5rem] rounded-t-none overflow-hidden pointer-events-auto border border-zinc-950/15 border-t-0 bg-background-light/95 backdrop-blur-md pt-5">
                        <form
                            onSubmit={handleSearch}
                            className="w-full flex items-center px-6 py-4"
                        >
                            <Search size={18} className="text-zinc-950/40 mr-4 shrink-0" />
                            <div className="flex-1 relative flex items-center">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none font-sans text-zinc-950 text-sm w-full z-10"
                                    aria-label="Search input"
                                />
                                {!searchQuery && (
                                    <div className="absolute left-0 text-zinc-950/40 font-sans text-sm pointer-events-none w-full flex items-center">
                                        {typewriterPlaceholder}<span className="inline-block w-[1px] h-4 ml-[2px] bg-zinc-950/40 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-zinc-950/40 hover:text-zinc-950 transition-colors mr-3 shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="text-primary hover:text-zinc-950 font-sans text-xs uppercase tracking-widest font-semibold transition-colors border-l border-zinc-950/10 pl-4 shrink-0"
                            >
                                Close
                            </button>
                        </form>

                        {/* Live Search Results Dropdown Area */}
                        {(searchQuery.trim().length > 0) && (
                            <div className="w-full border-t border-zinc-950/10 bg-white/50 px-6 py-4 max-h-[60vh] overflow-y-auto">
                                {isSearching ? (
                                    <div className="flex flex-col gap-4">
                                        <h4 className="font-sans text-xs uppercase tracking-widest font-medium text-zinc-950/40 mb-1">Searching...</h4>
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex items-center gap-4 py-2">
                                                <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                                                <div className="flex flex-col flex-1 gap-2">
                                                    <Skeleton className="w-48 h-5 rounded-md" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <h4 className="font-sans text-xs uppercase tracking-widest font-medium text-zinc-950/50 mb-2">Products</h4>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.handle}`}
                                                onClick={() => setIsSearchOpen(false)}
                                                className="flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-zinc-950/5 transition-colors group"
                                            >
                                                {product.thumbnail ? (
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-950/5 shrink-0">
                                                        <Image
                                                            src={product.thumbnail}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-950/5 shrink-0" />
                                                )}
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="font-serif italic text-lg truncate group-hover:text-primary transition-colors">{product.title}</span>
                                                </div>
                                                {/* Price logic could go here, omitting for layout simplicity for now or adding if needed */}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center py-8 text-zinc-950/50 font-sans text-sm">
                                        No products found for "{searchQuery}".
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
