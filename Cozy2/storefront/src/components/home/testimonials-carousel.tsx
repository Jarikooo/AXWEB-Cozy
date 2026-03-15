"use client";

import React, { useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { motion, useInView, useAnimation } from "framer-motion";
import * as Avatar from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

const REVIEWS = [
    {
        id: "r1",
        author: "Lisa de Vries",
        role: "Vaste klant",
        text: "Elke keer als ik binnenloop vind ik weer iets bijzonders. De producten zijn prachtig en het personeel denkt altijd met je mee.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop",
        layout: "wide",
    },
    {
        id: "r2",
        author: "Mark Jansen",
        role: "Interieurliefhebber",
        text: "De kwaliteit van de spullen is echt top. Je merkt dat alles met zorg is uitgezocht. Perfecte cadeauwinkel ook!",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
        layout: "tall",
    },
    {
        id: "r3",
        author: "Anne Bakker",
        role: "Online klant",
        text: "Snel geleverd en prachtig ingepakt. Het voelde echt als een cadeautje voor mezelf. Komt zeker terug!",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250&auto=format&fit=crop",
        layout: "standard",
    },
    {
        id: "r4",
        author: "Peter van Dijk",
        role: "Cadeau-koper",
        text: "Altijd als ik een origineel cadeau zoek, begin ik hier. De collectie wisselt regelmatig dus er is altijd iets nieuws te ontdekken.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop",
        layout: "wide",
    },
    {
        id: "r5",
        author: "Sophie Hendriks",
        role: "Woonliefhebber",
        text: "De Scandinavische items zijn fantastisch. Mijn hele woonkamer is inmiddels Cozy-proof. Aanrader voor iedereen die van mooi wonen houdt.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
        layout: "tall",
    },
    {
        id: "r6",
        author: "Thomas Visser",
        role: "Eerste keer klant",
        text: "Via Instagram ontdekt en meteen verliefd. De webshop is net zo fijn als de winkel zelf. Alles klopte, van bestelling tot bezorging.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&auto=format&fit=crop",
        layout: "standard",
    },
];

export function TestimonialsCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: true,
            watchDrag: false,
        },
        [
            AutoScroll({
                playOnInit: true,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                speed: 1.2,
            }),
        ]
    );

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
            className="relative w-full py-16 md:py-24 overflow-hidden bg-[#ffe4e6] border-b border-zinc-950 flex flex-col gap-10"
        >
            {/* Header */}
            <div className="container mx-auto px-4 md:px-8 max-w-5xl">
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    animate={controls}
                    className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6"
                >
                    <div className="max-w-xl relative z-10">
                        <h2 className="text-zinc-950 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.9] tracking-tighter uppercase italic mb-4">
                            Wat Klanten Zeggen.
                        </h2>
                        <p className="text-zinc-950/70 text-sm md:text-base max-w-[45ch] leading-relaxed">
                            Echte ervaringen van echte klanten. Ontdek waarom zij steeds terugkomen.
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
                {/* Fading Edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#ffe4e6] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#ffe4e6] to-transparent z-10 pointer-events-none" />

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y h-full items-stretch py-8">
                        {REVIEWS.map((review) => (
                            <div
                                key={review.id}
                                className={cn(
                                    "relative flex-none mx-2 md:mx-3 group",
                                    review.layout === "wide" ? "w-[85vw] md:w-[600px]" :
                                        review.layout === "tall" ? "w-[75vw] md:w-[400px]" :
                                            "w-[80vw] md:w-[480px]"
                                )}
                            >
                                <div className="h-full w-full bg-white border border-zinc-950 p-6 md:p-10 shadow-[4px_4px_0px_#09090b] hover:shadow-[8px_8px_0px_#09090b] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 flex flex-col justify-between min-h-[300px]">

                                    {/* Decorative Quote Mark */}
                                    <div className="absolute top-4 right-8 text-primary/10 text-8xl pointer-events-none leading-none select-none font-extrabold hidden md:block">
                                        &ldquo;
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
