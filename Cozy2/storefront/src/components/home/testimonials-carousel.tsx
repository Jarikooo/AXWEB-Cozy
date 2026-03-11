"use client";

import React, { useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { motion, useInView, useAnimation } from "framer-motion";
import * as Avatar from "@radix-ui/react-avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Review DATA - Using realistic, premium copy (No "Jane Doe" or generic text per SKILL.md)
const REVIEWS = [
    {
        id: "r1",
        author: "Elara Vane",
        role: "Interior Architect",
        text: "The sheer material quality of these pieces transcends typical e-commerce. It's a tactile experience before it even arrives.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
        layout: "wide", // Dictates block spanning
    },
    {
        id: "r2",
        author: "Julian Thorne",
        role: "Collector",
        text: "Meticulous curation. You aren't just buying furniture; you're adopting a very specific, uncompromising aesthetic standard.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
        layout: "tall",
    },
    {
        id: "r3",
        author: "Sophia Croft",
        role: "Editor, Form & Space",
        text: "Cozy Mssls. has mastered the art of quiet luxury. Their curations dictate the atmosphere of a room instantly.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop",
        layout: "standard",
    },
    {
        id: "r4",
        author: "Marcus Vance",
        role: "Creative Director",
        text: "I rarely trust online curation for significant pieces, but the tactile translation here is flawless. Highly considered.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
        layout: "wide",
    },
    {
        id: "r5",
        author: "Elena Rostov",
        role: "Boutique Owner",
        text: "Every piece feels like it has a lineage. The weight, the texture—it’s undeniable quality that anchors a space.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
        layout: "tall",
    },
    {
        id: "r6",
        author: "Harrison Lin",
        role: "Architectural Designer",
        text: "The restraint in design is what makes it so powerful. It doesn't scream for attention; it simply commands the room.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop",
        layout: "standard",
    },
];

export function TestimonialsCarousel() {
    // Embla setup with AutoScroll plugin
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: true,
            watchDrag: false, // Disables drag to prevent mouse wheel/pad scroll blocking
        },
        [
            AutoScroll({
                playOnInit: true,
                stopOnInteraction: false,
                stopOnMouseEnter: false, // Prevents scroll hijacking on hover
                speed: 1.2, // Smooth, slow pan
            }),
        ]
    );

    // Intersection Observer for scroll reveal
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const headerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "circOut" as const } },
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-16 md:py-24 overflow-hidden bg-[#f8e0ec] border-b border-zinc-950 flex flex-col gap-10"
        >
            {/* Asymmetric Header */}
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate={controls}
                    className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6"
                >
                    <div className="max-w-xl relative object-cover z-10">
                        <h2 className="text-zinc-950 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.9] tracking-tighter uppercase italic mb-4">
                            Quiet Authority.
                        </h2>
                        <p className="text-zinc-950/70 text-sm md:text-base max-w-[45ch] leading-relaxed">
                            We don't ask for trust; our curation commands it. Hear from those who have established their spaces with our pieces.
                        </p>
                    </div>

                </motion.div>
            </div>

            {/* Infinite Carousel track */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="w-full relative"
            >
                {/* Fading Edges mapped exactly to the background color */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#f8e0ec] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#f8e0ec] to-transparent z-10 pointer-events-none" />

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y h-full items-stretch py-8">
                        {REVIEWS.map((review) => (
                            <div
                                key={review.id}
                                className={cn(
                                    "relative flex-none mx-2 md:mx-3 group",
                                    // Dictate width based on 'layout' property for asymmetry
                                    review.layout === "wide" ? "w-[85vw] md:w-[600px]" :
                                        review.layout === "tall" ? "w-[75vw] md:w-[400px]" :
                                            "w-[80vw] md:w-[480px]"
                                )}
                            >
                                {/* Brulalist / Copenhagen Playful Card container */}
                                <div className="h-full w-full bg-white border border-zinc-950 p-6 md:p-10 shadow-[4px_4px_0px_#09090b] hover:shadow-[8px_8px_0px_#09090b] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 flex flex-col justify-between min-h-[300px]">

                                    {/* Decorative Quote Mark */}
                                    <div className="absolute top-4 right-8 text-primary/10 text-8xl font-serif pointer-events-none leading-none select-none italic font-extrabold hidden md:block">
                                        "
                                    </div>

                                    <p className="text-base md:text-xl font-medium text-zinc-950 leading-relaxed tracking-tight mb-8 z-10 relative">
                                        {review.text}
                                    </p>

                                    <div className="flex items-center gap-4 z-10 relative mt-auto border-t border-zinc-950 pt-6">
                                        <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-10 h-10 border border-zinc-950 shadow-[2px_2px_0px_#09090b] select-none rounded-none">
                                            <Avatar.Image
                                                className="w-full h-full object-cover"
                                                src={review.avatar}
                                                alt={review.author}
                                            />
                                            <Avatar.Fallback
                                                className="w-full h-full flex items-center justify-center bg-mint text-zinc-950 text-xs font-bold uppercase"
                                                delayMs={600}
                                            >
                                                {review.author.charAt(0)}
                                            </Avatar.Fallback>
                                        </Avatar.Root>

                                        <div className="flex flex-col">
                                            <span className="text-xs md:text-sm font-bold text-zinc-950 uppercase tracking-widest leading-none">{review.author}</span>
                                            <span className="text-[10px] md:text-xs text-zinc-950/50 uppercase tracking-wider mt-1">{review.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
