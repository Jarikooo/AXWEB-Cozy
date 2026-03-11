"use client";

import React, { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const BRANDS = [
    { id: "b1", name: "Anna + Nina" },
    { id: "b2", name: "Doing Goods" },
    { id: "b3", name: "HKLiving" },
    { id: "b4", name: "IB Laursen" },
    { id: "b5", name: "Storytiles" },
    { id: "b6", name: "All the luck in the world" },
];

export function BrandsCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
            skipSnaps: false,
            // Add dragFree for smoother scrolling without forced snapping jumps
            dragFree: true,
        },
        [
            Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
            }),
        ]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section className="relative w-full py-16 md:py-24 overflow-hidden bg-background border-b border-zinc-950">
            <div className="container mx-auto px-4 text-center mb-10">
                <h2 className="text-zinc-950 text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-widest">
                    Explore Our Collections
                </h2>
            </div>

            <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center px-4 sm:px-12">
                {/* Navigation Buttons */}
                <button
                    onClick={scrollPrev}
                    className="absolute left-4 z-10 hidden sm:flex h-12 w-12 items-center justify-center border border-zinc-950 bg-white text-zinc-950 hover:bg-zinc-100 hover:scale-105 transition-all focus:outline-none"
                    aria-label="Previous brand"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Embla Viewport */}
                <div className="overflow-hidden w-full px-4" ref={emblaRef}>
                    {/* Added negative margin to offset child padding, creating the gap */}
                    <div className="flex -ml-4 touch-pan-y h-full py-8 items-center cursor-grab active:cursor-grabbing">
                        {BRANDS.map((brand, index) => {
                            const isActive = index === selectedIndex;
                            return (
                                <div
                                    key={brand.id}
                                    // Make sure each slide has padding-left to create the gap between slides
                                    // min-w-0 is crucial for flexbox sizing
                                    className="relative flex-none pl-4 min-w-0 w-[60vw] sm:w-[40vw] md:w-[30vw] lg:w-[25vw] transition-all duration-500 ease-out"
                                    style={{
                                        transform: isActive ? "scale(1.05)" : "scale(0.9)",
                                        opacity: isActive ? 1 : 0.6,
                                    }}
                                >
                                    <div className="aspect-[3/4] sm:aspect-square w-full bg-white border border-zinc-950 shadow-[4px_4px_0px_#09090b] flex items-center justify-center p-6 text-center">
                                        <span className="text-xl md:text-2xl font-extrabold text-zinc-950 uppercase italic tracking-tighter">
                                            {brand.name}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={scrollNext}
                    className="absolute right-4 z-10 hidden sm:flex h-12 w-12 items-center justify-center border border-zinc-950 bg-white text-zinc-950 hover:bg-zinc-100 hover:scale-105 transition-all focus:outline-none"
                    aria-label="Next brand"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            <div className="flex sm:hidden justify-center gap-4 mt-6">
                <button
                    onClick={scrollPrev}
                    className="h-10 w-10 flex items-center justify-center border border-zinc-950 bg-white text-zinc-950"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={scrollNext}
                    className="h-10 w-10 flex items-center justify-center border border-zinc-950 bg-white text-zinc-950"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </section>
    );
}
