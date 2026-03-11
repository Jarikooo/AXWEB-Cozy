"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    magneticPull?: number;
    className?: string;
}

export function MagneticButton({
    children,
    magneticPull = 0.3, // Strength of the pull effect
    className = "",
    onClick,
    ...props
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Motion values for tracking pointer coordinates
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Premium spring configuration for smooth, heavy physics
    const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };

    // Apply spring physics to the raw motion values
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Calculate translation based on the spring values and pull strength
    const x = useTransform(springX, (latest) => latest * magneticPull);
    const y = useTransform(springY, (latest) => latest * magneticPull);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        // Calculate center of the button
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Set motion values to distance from center
        mouseX.set(clientX - centerX);
        mouseY.set(clientY - centerY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        // Reset motion values to center on leave
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={onClick}
            style={{ x, y }}
            className={`relative inline-flex items-center justify-center overflow-hidden transition-colors ${className}`}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {/* Subtle inner glow / reflection effect appearing on hover */}
            <motion.div
                className="absolute inset-0 z-0 bg-white/10 blur-md pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
            {/* The actual content text */}
            <span className="relative z-10 flex items-center justify-center w-full h-full">
                {children}
            </span>
        </motion.button>
    );
}
