"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export function Philosophy() {
    const containerRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const text1Ref = useRef<HTMLHeadingElement>(null);
    const text2Ref = useRef<HTMLHeadingElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Parallax background
        if (imageRef.current) {
            gsap.to(imageRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }

        // Split text reveal for "Standard webshops ask..."
        if (text1Ref.current) {
            gsap.fromTo(
                text1Ref.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: text1Ref.current,
                        start: "top 85%",
                    },
                }
            );
        }

        // Split text reveal for "We ask: What makes you happy?"
        if (text2Ref.current) {
            gsap.fromTo(
                text2Ref.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "back.out(1.5)",
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: text2Ref.current,
                        start: "top 80%",
                    },
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen bg-zinc-950 text-background-light overflow-hidden flex items-center py-32"
        >
            {/* Texture Background Container */}
            <div
                ref={imageRef}
                className="absolute inset-0 w-full h-[120%] -top-[10%] opacity-20 pointer-events-none mix-blend-overlay"
            >
                <Image
                    src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=2600&auto=format&fit=crop"
                    alt="Linen paper texture"
                    fill
                    sizes="100vw"
                    className="object-cover object-center grayscale"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 md:gap-24 items-start md:items-center">

                {/* Left Side: The Standard */}
                <div className="flex-1">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] font-medium mb-6 text-background-light/50">
                        The Industry Standard
                    </p>
                    <h2 ref={text1Ref} className="font-sans font-medium text-3xl md:text-5xl leading-tight text-white/80 opacity-0">
                        Standard webshops ask:<br />
                        <span className="text-white">What do you need?</span>
                    </h2>
                </div>

                {/* Separator line on mobile, hidden on desktop */}
                <div className="w-full h-px bg-white/10 md:hidden" />

                {/* Right Side: The Cozy Philosophy */}
                <div className="flex-1">
                    <p className="font-sans text-xs uppercase tracking-[0.2em] font-medium mb-6 text-primary">
                        The Cozy Manifesto
                    </p>
                    <h2 ref={text2Ref} className="font-serif italic text-4xl md:text-6xl leading-tight text-primary opacity-0">
                        We ask:<br />
                        What makes you happy?
                    </h2>
                </div>

            </div>
        </section>
    );
}
