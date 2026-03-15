"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { BrandsCarousel } from "./brands-carousel";
import { CuratedCollections } from "./curated-collections";

export function StitchHome() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Subscribing...");
        try {
            const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
            if (res.ok) { setStatus("Subscribed!"); setEmail(""); }
            else { setStatus("Error"); }
        } catch {
            setStatus("Error");
        }
    };

    return (
        <main>
            {/* Hero Section */}
            <section className="bg-mint border-b border-zinc-950 p-6 pt-24 md:p-12 md:pt-32">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 max-w-5xl mx-auto items-center">
                    <div className="border border-zinc-950 bg-white aspect-[4/5] md:aspect-square md:flex-1 overflow-hidden relative sharp-shadow w-full">
                        <img alt="Minimalist interior with colorful ceramic vases" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvKQlLTlZRFj4GGTyU-9EwyaYJ_FGzquUAN5HnNPE_s0I5etHcPsoSlNLXbNj8rkDziclemsY1FTnGTTjYrIzmyxHkTy9Gdh36F2Fy9I5atRtSTSLXhCruAmmwoXNhRU78X-kq3FRksPc3Rl8F19I6SiQe7qIlhADuaoV1tvruSGeQw3k7EGIcJbI0fxpu4Mz1E6aU81kB_vrfWdmOPLtjQDP06t1z6BO0YYCtF7zR2caUhrOrZvgNJqOc5Hdjfh9vGTgTJH_ZosU" />
                        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                            New Drop
                        </div>
                    </div>
                    <div className="space-y-4 md:flex-1">
                        <h1 className="text-zinc-950  text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[0.9] tracking-tighter uppercase italic">
                            Copenhagen <br />Curiosities
                        </h1>
                        <p className="text-zinc-950/70  text-sm md:text-base leading-relaxed max-w-[80%]">
                            A structured collection of playful home objects for the modern minimalist.
                        </p>
                        <Link href="/shop" className="inline-block bg-primary text-white font-bold uppercase tracking-widest text-xs md:text-sm px-8 py-4 border border-zinc-950 hover:bg-primary/90 transition-colors">
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brands Carousel Section */}
            <BrandsCarousel />

            {/* Testimonials Carousel Section */}
            <TestimonialsCarousel />

            {/* Curated Collections Section (Trending / Sharon's Favorites) */}
            <CuratedCollections />

            {/* Newsletter Section */}
            <section className="bg-mint  p-8 md:p-16 border-b border-zinc-950">
                <div className="space-y-6 text-center max-w-md mx-auto">
                    <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tighter italic">Join the Club</h2>
                    <p className="text-sm text-zinc-950/70 ">10% off your first curation of curiosities.</p>
                    <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-white  border border-zinc-950 px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-zinc-950/30"
                            placeholder="YOUR@EMAIL.COM"
                            type="email"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-zinc-950 text-white font-bold uppercase tracking-widest text-xs py-4 border border-zinc-950 active:bg-zinc-800 transition-colors disabled:opacity-50"
                            disabled={!!status && status !== "Error"}
                        >
                            {status || "Sign Me Up"}
                        </button>
                    </form>
                </div>
            </section>
        </main>
    )
}
