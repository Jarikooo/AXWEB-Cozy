"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef1 = useRef<HTMLHeadingElement>(null);
    const textRef2 = useRef<HTMLHeadingElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline();

        // Staggered fade up for text and CTA
        tl.fromTo(
            [textRef1.current, textRef2.current, ctaRef.current],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", delay: 0.2 }
        );

        // Parallax effect on image
        if (imageRef.current) {
            gsap.to(imageRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden flex items-end bg-[#E6D5C3] rounded-b-[4rem] z-10">
            {/* The Background Image restored */}
            <div ref={imageRef} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                <Image
                    src="/hero-bg.jpg"
                    alt="Warm Scandi living room"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* A gradient overlay blending from the image down into solid beige at the bottom where the text sits. */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#E6D5C3]/90 via-[#E6D5C3]/30 to-transparent" />
            </div>

            {/* Soft noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }} />

            {/* Content pushed to bottom-left third */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-32 md:pb-40">
                <div className="max-w-xl">
                    <h1 ref={textRef1} className="font-sans font-medium text-xl md:text-2xl text-background-light uppercase tracking-widest mb-2 opacity-0 drop-shadow-md">
                        Maak van je huis een
                    </h1>
                    <h2 ref={textRef2} className="font-serif italic text-7xl md:text-8xl lg:text-9xl text-primary leading-none opacity-0 drop-shadow-lg">
                        thuis.
                    </h2>
                    {/* CTA Button */}
                    <div ref={ctaRef} className="mt-10 opacity-0">
                        <Link href="/shop" className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 text-background-light rounded-full text-sm font-semibold uppercase tracking-widest hover:bg-primary transition-colors group">
                            Explore the Shop
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
