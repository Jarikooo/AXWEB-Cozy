"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const BRANDS = [
    {
        name: "StoryTiles",
        description: "Miniature art on ceramics.",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2670&auto=format&fit=crop",
    },
    {
        name: "HKliving",
        description: "The 70s Ceramics Collection.",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2670&auto=format&fit=crop",
    },
    {
        name: "Ib Laursen",
        description: "Danish coziness & plaids.",
        image: "https://images.unsplash.com/photo-1583847268964-b28ce8f25f2b?q=80&w=2670&auto=format&fit=crop",
    },
    {
        name: "Doing Goods",
        description: "Handmade rugs & brass accessories.",
        image: "https://images.unsplash.com/photo-1585828854095-20dbb6be0078?q=80&w=2670&auto=format&fit=crop",
    },
    {
        name: "Anna + Nina",
        description: "Eclectic jewelry & homeware.",
        image: "https://images.unsplash.com/photo-1629198725805-4f35e9c0c173?q=80&w=2670&auto=format&fit=crop",
    }
];

export function Brands() {
    const containerRef = useRef<HTMLElement>(null);
    const [startIndex, setStartIndex] = useState(0);

    // Number of total items
    const totalItems = BRANDS.length;

    // The indices of the 3 items currently visible
    const visibleIndices = [
        startIndex % totalItems,
        (startIndex + 1) % totalItems,
        (startIndex + 2) % totalItems,
    ];

    const nextSlide = useCallback(() => {
        setStartIndex((prev) => (prev + 1) % totalItems);
    }, [totalItems]);

    const prevSlide = useCallback(() => {
        setStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [totalItems]);

    // Auto-advance logic: every 5 seconds, keep rotating even if clicked
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Animate headers independently
        gsap.fromTo(
            ".brands-header",
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef });

    // Helper to calculate the rotational offset of each card compared to the current center (startIndex)
    const getOffset = (index: number) => {
        let offset = index - startIndex;
        const half = Math.floor(totalItems / 2);

        // Wrap the offset mathematically to keep it between -2 and 2 (for 5 items)
        if (offset < -half) offset += totalItems;
        if (offset > half) offset -= totalItems;
        return offset;
    };

    return (
        <section ref={containerRef} className="py-16 md:py-20 px-6 md:px-12 bg-background-light text-zinc-950">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 text-center brands-header opacity-0">
                    <h2 className="font-sans text-sm uppercase tracking-[0.2em] font-medium mb-4 text-primary">
                        The Family
                    </h2>
                    <p className="font-serif italic text-4xl md:text-5xl">
                        Brands we trust with our home.
                    </p>
                </div>

                <div className="relative flex items-center justify-center max-w-[90rem] mx-auto h-[500px] md:h-[550px] w-full mt-10">

                    {/* Left Navigation Button */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 md:-left-2 z-30 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg border border-zinc-950/5 hover:scale-110 active:scale-95 transition-transform text-zinc-950 backdrop-blur-sm"
                        aria-label="Previous brand"
                    >
                        <ChevronLeft strokeWidth={2.5} size={20} />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                        {BRANDS.map((brand, brandIndex) => {
                            const offset = getOffset(brandIndex);
                            const isPop = offset === 0;

                            // Calculate target transforms using 3D continuous mapping
                            let translateX = "-50%";
                            let scale = 1;
                            let opacity = 1;
                            let zIndex = 20;

                            if (offset === 0) {
                                // Center
                                translateX = "-50%";
                                scale = 1;
                                opacity = 1;
                                zIndex = 20;
                            } else if (offset === -1) {
                                // Left Visible
                                translateX = "calc(-150% - 1.5rem)";
                                scale = 0.9;
                                opacity = 0.75;
                                zIndex = 10;
                            } else if (offset === 1) {
                                // Right Visible
                                translateX = "calc(50% + 1.5rem)";
                                scale = 0.9;
                                opacity = 0.75;
                                zIndex = 10;
                            } else if (offset < -1) {
                                // Hidden Left
                                translateX = "calc(-250% - 3rem)";
                                scale = 0.8;
                                opacity = 0;
                                zIndex = 0;
                            } else if (offset > 1) {
                                // Hidden Right
                                translateX = "calc(150% + 3rem)";
                                scale = 0.8;
                                opacity = 0;
                                zIndex = 0;
                            }

                            return (
                                <div
                                    key={brand.name} // IMPORTANT: Keeps DOM nodes identical, relying on CSS for movement
                                    className={`
                                        absolute left-1/2 top-4 md:top-0 h-[450px] md:h-full w-[85%] md:w-[32%] max-w-[400px] overflow-hidden rounded-[2rem]
                                        ${isPop
                                            ? 'bg-background-light shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-zinc-950/15'
                                            : 'bg-white shadow-sm border border-zinc-950/5'
                                        }
                                        flex flex-col group transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] origin-center
                                    `}
                                    style={{
                                        transform: `translateX(${translateX}) scale(${scale})`,
                                        opacity,
                                        zIndex,
                                        pointerEvents: isPop ? 'auto' : 'none',
                                    }}
                                >
                                    <div className="relative w-full aspect-square md:flex-1 overflow-hidden bg-zinc-950/5">
                                        <Image
                                            src={brand.image}
                                            alt={brand.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>

                                    <div className="p-8 flex flex-col justify-between items-center text-center bg-inherit">
                                        <div>
                                            <h3 className="font-serif italic text-2xl mb-2">{brand.name}</h3>
                                            <p className="font-sans text-sm opacity-70 mb-6">{brand.description}</p>
                                        </div>

                                        {isPop ? (
                                            <Link href="/shop" className="px-6 py-3 bg-primary text-background-light rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-zinc-950 hover:scale-105 active:scale-95 transition-all shadow-md mt-auto">
                                                Shop Bestsellers
                                            </Link>
                                        ) : (
                                            <Link href="/shop" className="px-6 py-3 border border-transparent hover:border-zinc-950/20 rounded-full text-xs uppercase tracking-widest font-semibold text-zinc-950 transition-all mt-auto opacity-70">
                                                Explore
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Navigation Button */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 md:-right-2 z-30 w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg border border-zinc-950/5 hover:scale-110 active:scale-95 transition-transform text-zinc-950 backdrop-blur-sm"
                        aria-label="Next brand"
                    >
                        <ChevronRight strokeWidth={2.5} size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
