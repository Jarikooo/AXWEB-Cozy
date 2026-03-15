"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import * as Avatar from "@radix-ui/react-avatar";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitReview } from "@/app/actions/submit-review";
import Link from "next/link";
import { Star, FileText } from "lucide-react";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Review = {
    id: string;
    product_id: string;
    customer_id: string;
    rating: number;
    title: string;
    content: string;
    created_at: string;
};

interface ProductReviewsProps {
    productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.1 });

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasSession, setHasSession] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        setHasSession(document.cookie.includes("has_session=true"));

        if (!productId) return;
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products/${productId}/reviews`, {
            headers: {
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.reviews) {
                    setReviews(data.reviews);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed fetching reviews:", err);
                setLoading(false);
            });
    }, [productId]);

    useGSAP(() => {
        if (showForm && formRef.current) {
            gsap.fromTo(formRef.current,
                { height: 0, opacity: 0, scale: 0.98 },
                { height: "auto", opacity: 1, scale: 1, duration: 0.6, ease: "power4.out" }
            );
        }
    }, [showForm]);

    async function handleReviewSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError("");
        setFormSuccess(false);
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.append("product_id", productId);
        formData.append("rating", rating.toString());

        const result = await submitReview({}, formData);

        if (result.error) {
            setFormError(result.error);
        } else {
            setFormSuccess(true);
            const newReview = {
                id: `optimistic-${Date.now()}`,
                product_id: productId,
                customer_id: "me",
                rating: rating,
                title: formData.get("title") as string,
                content: formData.get("content") as string,
                created_at: new Date().toISOString()
            };
            setReviews(prev => [newReview, ...prev]);

            setTimeout(() => {
                setShowForm(false);
            }, 2000);
        }
        setIsSubmitting(false);
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100, damping: 20 } },
    };

    return (
        <section className="w-full py-16 md:py-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-950 tracking-tighter uppercase italic mb-4">
                        Reviews.
                    </h2>
                    <p className="text-zinc-950/60 text-sm leading-relaxed">
                        Ervaringen van mensen die dit product in hun ruimte hebben geplaatst.
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1">
                    <span className="text-4xl font-extrabold text-zinc-950 leading-none">{averageRating}</span>
                    <span className="text-[10px] tracking-widest uppercase text-zinc-950/50 font-bold">Op basis van {reviews.length} reviews</span>
                </div>
            </div>

            {/* Authentication & Form Gating */}
            <div className="mb-16">
                {!hasSession ? (
                    <div className="w-full bg-mint border border-zinc-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 uppercase tracking-tight mb-1">Heb je dit product ervaren?</h3>
                            <p className="text-zinc-950/60 text-sm">Log in om je ervaring te delen.</p>
                        </div>
                        <Link href="/account/login">
                            <button className="px-8 py-4 bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors border border-zinc-950 shadow-[4px_4px_0px_#18181b] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_#18181b] shrink-0">
                                Inloggen
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="w-full">
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-8 py-4 bg-zinc-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 border border-zinc-950 shadow-[4px_4px_0px_#18181b] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_#18181b]"
                            >
                                <FileText size={16} /> Review Schrijven
                            </button>
                        )}

                        <AnimatePresence>
                            {showForm && (
                                <form
                                    ref={formRef}
                                    onSubmit={handleReviewSubmit}
                                    className="w-full bg-white border border-zinc-950 p-8 shadow-[4px_4px_0px_rgba(9,9,11,0.05)] overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-zinc-950 uppercase tracking-tight">Deel je ervaring</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-950/50 hover:text-zinc-950 transition-colors"
                                        >
                                            Annuleren
                                        </button>
                                    </div>

                                    {formError && (
                                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 text-sm font-medium">
                                            {formError}
                                        </div>
                                    )}
                                    {formSuccess && (
                                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                                            Je review is succesvol geplaatst.
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-6">
                                        {/* Star Rating */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">Beoordeling</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onMouseEnter={() => setHoveredRating(star)}
                                                        onMouseLeave={() => setHoveredRating(0)}
                                                        onClick={() => setRating(star)}
                                                        className="transition-transform hover:scale-110 focus:outline-none"
                                                    >
                                                        <Star
                                                            size={28}
                                                            fill={(hoveredRating || rating) >= star ? "#f4258c" : "transparent"}
                                                            color={(hoveredRating || rating) >= star ? "#f4258c" : "#d4d4d8"}
                                                            strokeWidth={1.5}
                                                            className="transition-colors duration-200"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-zinc-950">Titel</label>
                                            <input
                                                id="title"
                                                name="title"
                                                type="text"
                                                required
                                                autoComplete="off"
                                                placeholder="Vat je ervaring samen..."
                                                className="w-full bg-white border border-zinc-950 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-zinc-950">Details</label>
                                            <textarea
                                                id="content"
                                                name="content"
                                                required
                                                rows={4}
                                                placeholder="Wat vond je er goed aan? Wat kan beter? Help anderen met specifieke details."
                                                className="w-full bg-white border border-zinc-950 px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary transition-all resize-none placeholder:text-zinc-950/30"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || formSuccess}
                                            className="w-full md:w-auto self-end mt-2 px-10 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 transition-all border border-zinc-950 shadow-[4px_4px_0px_#18181b] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_#18181b]"
                                        >
                                            {isSubmitting ? "Verzenden..." : (formSuccess ? "Geplaatst!" : "Publiceer Review")}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Review Cards Grid */}
            <div ref={containerRef} className="min-h-[120px]">
                {loading ? (
                    <div className="w-full h-32 flex items-center justify-center">
                        <span className="text-sm font-bold tracking-widest text-zinc-950/50 uppercase animate-pulse">Laden...</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="w-full py-16 text-center border border-dashed border-zinc-950/20">
                        <p className="text-lg font-bold text-zinc-950 italic uppercase">Nog geen reviews.</p>
                        <p className="text-sm text-zinc-950/50 mt-2">Wees de eerste die een review achterlaat.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                variants={itemVariants}
                                className={cn(
                                    "group relative bg-white p-8 border border-zinc-950 shadow-[4px_4px_0px_rgba(9,9,11,0.05)] hover:shadow-[6px_6px_0px_rgba(9,9,11,0.08)] flex flex-col hover:-translate-y-1 transition-all duration-300 overflow-hidden",
                                    index % 2 === 1 ? "md:mt-8" : "",
                                    index % 3 === 2 ? "lg:mt-16" : ""
                                )}
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < review.rating ? "#f4258c" : "transparent"}
                                            color={i < review.rating ? "#f4258c" : "#d4d4d8"}
                                        />
                                    ))}
                                </div>

                                {/* Review Text */}
                                <h4 className="text-sm font-bold text-zinc-950 uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">{review.title}</h4>
                                <p className="text-sm text-zinc-950/70 leading-relaxed mb-8 italic">
                                    &ldquo;{review.content}&rdquo;
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 mt-auto pt-5 border-t border-zinc-950/10">
                                    <Avatar.Root className="inline-flex items-center justify-center overflow-hidden w-10 h-10 border border-zinc-950 select-none bg-mint">
                                        <Avatar.Fallback
                                            className="w-full h-full flex items-center justify-center bg-transparent text-zinc-950 text-xs font-bold uppercase"
                                        >
                                            {review.customer_id === "me" ? "JIJ" : "A"}
                                        </Avatar.Fallback>
                                    </Avatar.Root>

                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-950 uppercase">Geverifieerd</span>
                                        <span className="text-[10px] text-zinc-950/50 uppercase tracking-widest mt-0.5">
                                            {new Date(review.created_at).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
