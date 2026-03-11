"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MapPin } from "lucide-react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP);
}

// -- 1. Ceramics Shuffler --
const INIT_CARDS = [
    { id: 1, title: "HKliving 70s Ceramics", color: "bg-[#E6D5C3]" },
    { id: 2, title: "Ib Laursen Plaids", color: "bg-[#D9C5B2]" },
    { id: 3, title: "StoryTiles Art", color: "bg-[#CCB5A1]" },
];

function CeramicsShuffler() {
    const [cards, setCards] = useState(INIT_CARDS);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCards((prev) => {
                const newCards = [...prev];
                const last = newCards.pop();
                if (last) newCards.unshift(last);
                return newCards;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        if (!containerRef.current) return;
        const cardElements = gsap.utils.toArray<HTMLElement>(".shuffler-card", containerRef.current);

        cardElements.forEach((card, index) => {
            gsap.to(card, {
                y: index * 20,
                scale: 1 - index * 0.05,
                opacity: 1 - index * 0.2,
                zIndex: 10 - index,
                duration: 0.8,
                ease: "back.out(1.2)", // Spring-bounce transition
            });
        });
    }, { scope: containerRef, dependencies: [cards] });

    return (
        <div className="relative h-64 w-full flex items-center justify-center perspective-[1000px]" ref={containerRef}>
            {cards.map((card, i) => (
                <div
                    key={card.id}
                    className={`shuffler-card absolute w-64 h-40 ${card.color} rounded-2xl shadow-lg flex items-center justify-center p-6 border border-white/20 backdrop-blur-sm`}
                    style={{ transformOrigin: "top center" }}
                >
                    <span className="font-serif italic text-zinc-950 text-lg text-center leading-tight">
                        {card.title}
                    </span>
                </div>
            ))}
        </div>
    );
}

// -- 2. Editorial Typewriter --
const TYPE_MESSAGES = [
    "Prachtige zijden bloemen...",
    "Klaarzetten van de nieuwe collectie...",
    "Jouw cadeaus feestelijk inpakken...",
];

function EditorialTypewriter() {
    const [text, setText] = useState("");
    const [msgIndex, setMsgIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentMsg = TYPE_MESSAGES[msgIndex];
        let timeout: NodeJS.Timeout;

        if (!isDeleting && text === currentMsg) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && text === "") {
            setIsDeleting(false);
            setMsgIndex((prev) => (prev + 1) % TYPE_MESSAGES.length);
        } else {
            const speed = isDeleting ? 30 : 60;
            timeout = setTimeout(() => {
                setText(
                    isDeleting
                        ? currentMsg.substring(0, text.length - 1)
                        : currentMsg.substring(0, text.length + 1)
                );
            }, speed);
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, msgIndex]);

    return (
        <div className="h-full flex flex-col justify-between pt-4">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-mint animate-ping" />
                <span className="text-xs uppercase tracking-widest font-semibold text-mint">In Store</span>
            </div>

            <div className="flex-1 flex items-center">
                <h3 className="font-serif italic text-2xl md:text-3xl text-zinc-950">
                    {text}
                    <span className="inline-block w-[3px] h-6 bg-primary ml-1 -mb-1 animate-pulse" />
                </h3>
            </div>

            <div className="mt-8">
                <a href="/over-ons" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors group">
                    <span className="w-8 h-8 rounded-full bg-zinc-950 text-background-light flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin size={12} className="ml-0.5" fill="currentColor" />
                    </span>
                    Plan je bezoek
                </a>
            </div>
        </div>
    );
}

// -- 3. Mock Cursor Wishlist Scheduler --
function WishlistScheduler() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const boxReff = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {
        if (!cursorRef.current || !boxReff.current || !btnRef.current) return;

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

        // Initial state
        tl.set(cursorRef.current, { x: 0, y: 150, opacity: 0, scale: 1 });
        tl.set(boxReff.current, { scale: 1, backgroundColor: "transparent" });
        tl.set(btnRef.current, { scale: 1 });

        // Enter cursor
        tl.to(cursorRef.current, { opacity: 1, duration: 0.5 });

        // Move to box
        tl.to(cursorRef.current, {
            x: 100,
            y: 85,
            duration: 1.2,
            ease: "power2.inOut"
        });

        // Click box (scale down cursor and box)
        tl.to(cursorRef.current, { scale: 0.8, duration: 0.1 });
        tl.to(boxReff.current, { scale: 0.9, backgroundColor: "#B85C4F", duration: 0.1 }, "<");

        // Release click
        tl.to(cursorRef.current, { scale: 1, duration: 0.1 });
        tl.to(boxReff.current, { scale: 1, duration: 0.3 }, "<");

        // Move to Add to Cart
        tl.to(cursorRef.current, {
            x: 30,
            y: 200,
            duration: 1,
            ease: "power2.inOut",
            delay: 0.5
        });

        // Click button
        tl.to(cursorRef.current, { scale: 0.8, duration: 0.1 });
        tl.to(btnRef.current, { scale: 0.95, duration: 0.1 }, "<");

        // Release click and fade out
        tl.to(cursorRef.current, { scale: 1, opacity: 0, duration: 0.3 });
        tl.to(btnRef.current, { scale: 1, duration: 0.2 }, "<");

    }, { scope: containerRef });

    return (
        <div className="relative h-full flex flex-col items-center pt-8 overflow-hidden" ref={containerRef}>

            {/* Grid of boxes */}
            <div className="grid grid-cols-3 gap-3 mb-10 w-full max-w-[200px]">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        ref={i === 4 ? boxReff : null}
                        className={`
              w-full aspect-square border-2 border-zinc-950/10 rounded-xl 
              flex items-center justify-center transition-colors
              ${i === 4 ? 'relative' : ''}
            `}
                    >
                        {i === 4 && <div className="absolute inset-0 bg-primary/20 rounded-xl mix-blend-multiply" />}
                    </div>
                ))}
            </div>

            <button
                ref={btnRef}
                className="px-6 py-3 bg-zinc-950 text-background-light rounded-full text-xs uppercase tracking-widest font-semibold w-[80%]"
            >
                Cadeaus Bekijken
            </button>

            {/* Mock SVG Cursor */}
            <div ref={cursorRef} className="absolute top-0 left-0 w-6 h-6 z-20 pointer-events-none drop-shadow-md">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 2L20 10.9L12.5 13.5L16 20.5L12 22.5L8.5 15.5L3 19V2Z" fill="#111111" stroke="#FFFFFF" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
            </div>

        </div>
    );
}

export function Features() {
    return (
        <section className="py-24 px-6 md:px-12 bg-background-light text-zinc-950 w-full">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="font-sans text-sm uppercase tracking-[0.2em] font-medium mb-4 text-primary">
                        Boutique Uitgelicht
                    </h2>
                    <p className="font-serif italic text-3xl md:text-5xl max-w-2xl leading-tight">
                        Wij verkopen niet zomaar producten. We creëren momenten van rust.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1 */}
                    <div className="bg-white rounded-[2rem] p-8 min-h-[400px] flex flex-col border border-zinc-950/5 shadow-sm overflow-hidden group">
                        <h3 className="font-sans font-semibold mb-2">Nieuw Binnen</h3>
                        <p className="text-sm text-zinc-950/60 mb-8">Ontdek de nieuwste items</p>
                        <div className="flex-1 flex items-center justify-center">
                            <CeramicsShuffler />
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#EAE4DC] rounded-[2rem] p-8 min-h-[400px] flex flex-col border border-zinc-950/5 shadow-sm overflow-hidden">
                        <h3 className="font-sans font-semibold mb-2">Bezoek onze Boutique</h3>
                        <p className="text-sm text-zinc-950/60">Gezellig winkelen in Maassluis</p>
                        <div className="flex-1 mt-6">
                            <EditorialTypewriter />
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-[2rem] p-8 min-h-[400px] flex flex-col border border-zinc-950/5 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="font-sans font-semibold mb-2">Unieke Cadeaus</h3>
                                <p className="text-sm text-zinc-950/60">Vind het perfecte cadeau</p>
                            </div>
                        </div>
                        <div className="flex-1 bg-background-light/50 rounded-2xl relative">
                            <WishlistScheduler />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
