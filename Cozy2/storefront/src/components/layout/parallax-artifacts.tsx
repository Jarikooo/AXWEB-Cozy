"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxArtifacts() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // We create different parallax speeds for each artifact
    // High positive numbers move up faster than scrolling, negative moves slower
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -600]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -800]);

    const y4 = useTransform(scrollYProgress, [0, 1], [0, -400]);
    const y5 = useTransform(scrollYProgress, [0, 1], [0, -700]);
    const y6 = useTransform(scrollYProgress, [0, 1], [0, -350]);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
            {/* The container is constrained to view, but artifacts bleed out into the margins */}
            <div className="relative w-full max-w-[1600px] h-full">
                
                {/* 1. Artifact 1: Minimalist Arc (Top Left) - Light Mint */}
                <motion.div
                    style={{ y: y1 }}
                    className="absolute top-[10%] -left-[8%] opacity-30 blur-[2px]"
                >
                    <svg width="200" height="400" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 10 390 C 10 180 180 10 190 10" stroke="#E8F4F1" strokeWidth="20" strokeLinecap="round"/>
                        <circle cx="160" cy="50" r="15" fill="#E8F4F1" />
                    </svg>
                </motion.div>

                {/* 2. Artifact 4: Wavy Line (Middle Left) - New - Lighter Pink */}
                <motion.div
                    style={{ y: y4 }}
                    className="absolute top-[35%] -left-[12%] opacity-60 blur-[4px]"
                >
                    <svg width="150" height="300" viewBox="0 0 150 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 75 10 Q 140 85 75 160 T 75 290" stroke="#F87EB9" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </motion.div>

                 {/* 3. Artifact 3: Hollow Star/Flower (Bottom Left) - Main Pink */}
                 <motion.div
                    style={{ y: y3 }}
                    className="absolute top-[65%] -left-[4%] opacity-50 blur-[2px]"
                >
                    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M75 10L90 60L140 75L90 90L75 140L60 90L10 75L60 60L75 10Z" stroke="#F655A6" strokeWidth="6" strokeLinejoin="round"/>
                    </svg>
                </motion.div>

                {/* 4. Artifact 5: Abstract Circles (Far Bottom Left) - New - Darker Mint */}
                <motion.div
                    style={{ y: y5 }}
                    className="absolute top-[85%] -left-[10%] opacity-70 blur-[3px]"
                >
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="50" stroke="#A5D6C9" strokeWidth="8"/>
                        <circle cx="60" cy="60" r="25" stroke="#A5D6C9" strokeWidth="4" strokeDasharray="5 5"/>
                    </svg>
                </motion.div>

                {/* 5. Artifact 6: Hollow Diamond (Top Right) - New - Darker Mint */}
                <motion.div
                    style={{ y: y6 }}
                    className="absolute top-[18%] -right-[10%] opacity-50 blur-[3px]"
                >
                    <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="90" y="20" width="100" height="100" transform="rotate(45 90 20)" stroke="#88C8B8" strokeWidth="10" strokeLinejoin="round"/>
                    </svg>
                </motion.div>

                {/* 6. Artifact 2: Solid Organic Shape (Middle/Bottom Right) - Main Pink */}
                <motion.div
                    style={{ y: y2 }}
                    className="absolute top-[55%] -right-[5%] opacity-30 blur-[6px]"
                >
                    <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M150 0C67.1573 0 0 67.1573 0 150C0 232.843 67.1573 300 150 300C215.158 300 300 248.675 300 150C300 51.3248 232.843 0 150 0Z" fill="#F655A6"/>
                    </svg>
                </motion.div>

            </div>
        </div>
    );
}
