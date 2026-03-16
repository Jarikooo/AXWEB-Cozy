"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { BrandsCarousel } from "./brands-carousel";
import { CuratedCollections } from "./curated-collections";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function StitchHome() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [picks, setPicks] = useState<Product[]>([]);
    const [picksLoading, setPicksLoading] = useState(true);
    const heroRef = useRef<HTMLElement>(null);
    const picksRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMedusaProducts({ limit: 4 })
            .then(({ products }) => {
                setPicks(products);
                setPicksLoading(false);
            })
            .catch(() => setPicksLoading(false));
    }, []);

    useGSAP(() => {
        if (!heroRef.current) return;
        gsap.from("[data-hero]", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.12,
        });
    }, { scope: heroRef });

    useGSAP(() => {
        if (!picksRef.current || picksLoading || picks.length === 0) return;
        const cards = picksRef.current.querySelectorAll("[data-pick]");
        if (cards.length === 0) return;
        // Kill any lingering animations and reset to visible before animating
        gsap.killTweensOf(cards);
        gsap.set(cards, { clearProps: "all" });
        gsap.fromTo(cards,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 }
        );
    }, { scope: picksRef, dependencies: [picksLoading, picks] });

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

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(price);

    return (
        <main>
            {/* Hero Section */}
            <section ref={heroRef} className="bg-mint border-b border-[#18181b] px-6 pt-24 md:px-12 md:pt-32 pb-16 md:pb-24">
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 max-w-7xl mx-auto items-center">
                    <div data-hero className="border border-[#18181b] bg-white aspect-[4/5] md:aspect-square md:flex-1 overflow-hidden relative shadow-[8px_8px_0px_#18181b] w-full">
                        <Image
                            alt="Cozy Mssls winkel interieur"
                            src="/images/c1.jpg"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#18181b]">
                            Nieuw Binnen
                        </div>
                    </div>
                    <div className="md:flex-1 flex flex-col gap-6">
                        <div>
                            <p data-hero className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-4">Cozy Mssls.</p>
                            <h1 data-hero className="text-[#18181b] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tighter uppercase italic">
                                Vrolijke<br />Blijmakers
                            </h1>
                        </div>
                        <p data-hero className="text-[#18181b]/60 text-sm md:text-base leading-relaxed max-w-md">
                            Door Sharon persoonlijk uitgezocht — van Scandinavisch design tot Nederlandse pareltjes. Ontdek onze collectie vol échte blijmakers.
                        </p>
                        <div data-hero className="flex flex-col sm:flex-row gap-3">
                            <Link href="/shop" className="inline-block bg-primary text-white font-bold uppercase tracking-widest text-xs px-10 py-4 border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center">
                                Ontdek de Collectie
                            </Link>
                            <Link href="/over-ons" className="inline-block bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs px-10 py-4 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0px_#18181b] transition-all text-center">
                                Ons Verhaal
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sharon's Picks — Real Products First */}
            <section className="bg-white border-b border-[#18181b]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-2">Uitgelicht</p>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.95]">
                                Sharon's Picks.
                            </h2>
                        </div>
                        <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-[#18181b]/40 hover:text-primary transition-colors flex items-center gap-2 shrink-0">
                            Bekijk alles
                            <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div ref={picksRef} className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-14">
                        {picksLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="aspect-square bg-[#18181b]/5 animate-pulse border border-[#18181b]/10" />
                                    <div className="pt-4 space-y-2">
                                        <div className="h-3 w-3/4 bg-[#18181b]/5 animate-pulse" />
                                        <div className="h-3 w-1/3 bg-[#18181b]/5 animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : picks.map((product) => (
                            <div key={product.id} data-pick className="group flex flex-col relative">
                                <div className="relative aspect-square w-full bg-white border border-[#18181b]">
                                    <div className="absolute inset-0 overflow-hidden">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-100" />
                                        )}
                                    </div>
                                    {product.isNew && (
                                        <div className="absolute top-2 left-2 z-10 bg-mint text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">Nieuw</div>
                                    )}
                                    <Link href={`/products/${product.handle || product.id}`} className="absolute inset-0 z-10" />
                                </div>
                                <div className="pt-4 flex flex-col items-center text-center">
                                    <Link href={`/products/${product.handle || product.id}`}>
                                        <h4 className="text-sm font-bold text-[#18181b] mb-1 hover:underline line-clamp-1">{product.name}</h4>
                                    </Link>
                                    <span className="font-bold text-[#18181b] text-sm">
                                        {product.price > 0 ? formatPrice(product.price) : "Op aanvraag"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curated Collections — Conversion-forward imagery */}
            <CuratedCollections />

            {/* Brands Carousel — Trust signal after products */}
            <BrandsCarousel />

            {/* Testimonials — Social proof after seeing what's available */}
            <TestimonialsCarousel />

            {/* Newsletter Section */}
            <section className="bg-mint border-b border-[#18181b] px-6 py-16 md:px-12 md:py-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-lg">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-2">Nieuwsbrief</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tighter italic text-[#18181b] mb-3">Word Lid van de Club.</h2>
                        <p className="text-sm text-[#18181b]/60 leading-relaxed">
                            Ontvang 10% korting op je eerste bestelling en als eerste toegang tot nieuwe collecties.
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-white border border-[#18181b] px-5 py-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-[#18181b]/30 w-full sm:w-72"
                            placeholder="JOUW@EMAIL.NL"
                            type="email"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-[#18181b] text-white font-bold uppercase tracking-widest text-xs px-8 py-4 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.3)] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_rgba(9,9,11,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_rgba(9,9,11,0.3)] transition-all disabled:opacity-50 whitespace-nowrap"
                            disabled={!!status && status !== "Fout"}
                        >
                            {status || "Schrijf Me In"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}
