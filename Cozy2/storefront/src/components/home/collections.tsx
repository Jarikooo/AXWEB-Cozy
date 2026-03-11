"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const COLLECTION_DATA = [
    {
        id: "ceramics",
        title: "Newsletter",
        subtitle: "Join our newsletter for curated updates and inspiration.",
        color: "bg-[#E6D5C3]",
        textColor: "text-zinc-950",
    }
];

export function Collections() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (!res.ok) throw new Error("Failed to subscribe");
            setIsSuccess(true);
            setEmail("");
            // Reset success message after 5 seconds
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useGSAP(() => {
        if (!containerRef.current) return;

        const cards = gsap.utils.toArray<HTMLElement>(".collection-card", containerRef.current);

        cards.forEach((card, i) => {
            // The last card doesn't need to be covered/scaled down
            if (i === cards.length - 1) return;

            const nextCard = cards[i + 1];

            ScrollTrigger.create({
                trigger: nextCard,
                start: "top top",
                end: "bottom top",
                scrub: true,
                animation: gsap.timeline()
                    .to(card, {
                        scale: 0.9,
                        opacity: 0.5,
                        filter: "blur(20px)",
                        ease: "none",
                    })
            });
        });

        // Sub-animations for each card
        // Card 1: 3D rotating vase
        const vase = containerRef.current.querySelector(".anim-vase");
        if (vase) {
            gsap.to(vase, {
                rotationY: 360,
                repeat: -1,
                duration: 20,
                ease: "linear",
            });
        }

        // Card 2: Sweeping spotlight over silk flowers grid
        const spotlight = containerRef.current.querySelector(".anim-spotlight");
        if (spotlight) {
            gsap.to(spotlight, {
                x: "200%",
                y: "100%",
                repeat: -1,
                yoyo: true,
                duration: 8,
                ease: "sine.inOut",
            });
        }

        // Card 3: Flickering candle flame path
        const flame = containerRef.current.querySelector(".anim-flame");
        if (flame) {
            gsap.to(flame, {
                scale: 1.1,
                opacity: 0.8,
                repeat: -1,
                yoyo: true,
                duration: 0.15,
                ease: "power1.inOut",
            });
            gsap.to(flame, {
                x: "random(-2, 2)",
                y: "random(-2, 2)",
                repeat: -1,
                yoyo: true,
                duration: 0.2,
            });
        }

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full">
            {COLLECTION_DATA.map((collection, index) => (
                <section
                    key={collection.id}
                    className={`collection-card sticky top-0 w-full h-screen ${collection.color} ${collection.textColor} flex items-center justify-center overflow-hidden`}
                    style={{ zIndex: index }}
                >
                    <div className="absolute inset-0 w-full h-full p-6 md:p-12 flex flex-col justify-between">
                        {/* Header */}
                        <div className="flex justify-between items-start w-full max-w-7xl mx-auto z-10">
                            <span className="font-sans text-xs uppercase tracking-[0.2em] font-medium opacity-70">
                                0{index + 1} // Archive
                            </span>
                        </div>

                        {/* Center Content Group */}
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto w-full gap-12 z-10">
                            <div className="flex-1">
                                <h2 className="font-serif italic text-5xl md:text-7xl lg:text-8xl leading-none mb-4">
                                    {collection.title}
                                </h2>
                                <p className="font-sans text-lg md:text-xl opacity-80 max-w-sm mb-8">
                                    {collection.subtitle}
                                </p>

                                {collection.id === "ceramics" ? (
                                    <form className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl" onSubmit={handleNewsletterSubmit}>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            disabled={isSubmitting || isSuccess}
                                            required
                                            className="w-1/3 bg-transparent border-b border-current px-4 py-3 font-sans outline-none placeholder:text-current/50 transition-colors focus:border-current/100 disabled:opacity-50"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Your email address..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSubmitting || isSuccess}
                                            required
                                            className="flex-1 bg-transparent border-b border-current px-4 py-3 font-sans outline-none placeholder:text-current/50 transition-colors focus:border-current/100 disabled:opacity-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isSuccess}
                                            className="relative whitespace-nowrap px-8 py-3 border border-current rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-current hover:text-white mix-blend-difference transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                        >
                                            {isSubmitting ? 'Joining...' : isSuccess ? 'Welcome!' : 'Subscribe'}
                                            {isSubmitting && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />}
                                        </button>
                                        {error && <p className="absolute -bottom-8 left-0 text-red-500/80 text-xs font-sans mt-2">{error}</p>}
                                    </form>
                                ) : (
                                    <button className="px-8 py-4 border border-current rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-current hover:text-white mix-blend-difference transition-colors">
                                        Explore
                                    </button>
                                )}
                            </div>

                            {/* Unique Animation Artifact Container */}
                            <div className="flex-1 flex items-center justify-center w-full aspect-square md:aspect-auto h-full max-h-[500px]">

                                {/* Conditionals for the specific artifacts */}

                                {/* 1. Newsletter Mail Envelope (Custom 3D rotating object) */}
                                {collection.id === "ceramics" && (
                                    <div className="anim-vase relative w-64 h-40 bg-zinc-950/10 backdrop-blur-md border border-zinc-950/20 rounded-3xl flex items-center justify-center shadow-2xl preserve-3d overflow-hidden">
                                        {/* Envelope flap paths matched to the border color */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none text-zinc-950/40" viewBox="0 0 256 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M 0 24 L 128 104 L 256 24" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M 0 160 L 96 104" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                            <path d="M 256 160 L 160 104" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                        </svg>

                                        {/* 3D Depth Layer */}
                                        <div className="absolute inset-0 rounded-3xl border border-zinc-950/10" style={{ transform: 'translateZ(-1px)' }}></div>
                                    </div>
                                )}



                            </div>
                        </div>

                        {/* Footer */}
                        <div className="w-full max-w-7xl mx-auto flex justify-end z-10">
                            <span className="font-sans text-xs uppercase tracking-[0.2em] font-medium opacity-50">
                                Scroll to uncover
                            </span>
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
