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

// Extracted prop definition to enable parent passing the product ID and auth state
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

    // Form Interaction States
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState(false);

    // Dynamic Fetch & Session Check
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

    // GSAP Panel Expansion
    useGSAP(() => {
        if (showForm && formRef.current) {
            gsap.fromTo(formRef.current,
                { height: 0, opacity: 0, scale: 0.95 },
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
            // Optimistic local update
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
        <section className="w-full py-16 md:py-24 border-t border-zinc-950/10">
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-zinc-950 tracking-tight mb-4">
                            Curator Perspectives.
                        </h2>
                        <p className="text-zinc-950/60 text-lg leading-relaxed">
                            Insights and experiences from those who have integrated this piece into their spaces.
                        </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-1">
                        <span className="text-4xl font-serif text-zinc-950 leading-none">{averageRating}</span>
                        <span className="text-sm tracking-widest uppercase text-zinc-950/50">Based on {reviews.length} Reviews</span>
                    </div>
                </div>

                {/* Authentication & Form Gating */}
                <div className="mb-16">
                    {!hasSession ? (
                        <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                            <div>
                                <h3 className="text-xl font-serif text-zinc-950 mb-2">Have you experienced this piece?</h3>
                                <p className="text-zinc-950/60 font-sans text-sm">Sign in to share your thoughts and help others curate their spaces.</p>
                            </div>
                            <Link href="/account/login">
                                <button className="px-8 py-4 bg-zinc-950 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shrink-0">
                                    Log In to Review
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="w-full">
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-8 py-4 bg-zinc-950 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center gap-2 mx-auto md:mx-0"
                                >
                                    <FileText size={16} /> Write a Review
                                </button>
                            )}

                            <AnimatePresence>
                                {showForm && (
                                    <form
                                        ref={formRef}
                                        onSubmit={handleReviewSubmit}
                                        className="w-full bg-white border border-zinc-950/10 rounded-[2rem] p-8 shadow-xl overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-2xl font-serif text-zinc-950">Share Your Perspective</h3>
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="text-xs font-bold uppercase tracking-widest text-zinc-950/50 hover:text-zinc-950 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        {formError && (
                                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                                                {formError}
                                            </div>
                                        )}
                                        {formSuccess && (
                                            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium">
                                                Your review has been successfully published.
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-6">
                                            {/* Star Rating */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950/50">Overall Rating</label>
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
                                                                size={32}
                                                                fill={(hoveredRating || rating) >= star ? "#A05A45" : "transparent"}
                                                                color={(hoveredRating || rating) >= star ? "#A05A45" : "#E5E7EB"}
                                                                strokeWidth={1.5}
                                                                className="transition-colors duration-200"
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-zinc-950/50">Headline</label>
                                                <input
                                                    id="title"
                                                    name="title"
                                                    type="text"
                                                    required
                                                    autoComplete="off"
                                                    placeholder="Summarize your experience..."
                                                    className="w-full bg-zinc-50 border border-zinc-950/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-zinc-950/50">Details</label>
                                                <textarea
                                                    id="content"
                                                    name="content"
                                                    required
                                                    rows={4}
                                                    placeholder="What did you love? What could be improved? Help others decide by sharing specific details."
                                                    className="w-full bg-zinc-50 border border-zinc-950/10 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || formSuccess}
                                                className="w-full md:w-auto self-end mt-4 px-10 py-4 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#8F4E3A] disabled:opacity-50 transition-colors shadow-lg shadow-primary/20"
                                            >
                                                {isSubmitting ? "Submitting..." : (formSuccess ? "Published!" : "Publish Review")}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Masonry / Grid Layout for Reviews */}
                <div ref={containerRef} className="min-h-[120px]">
                    {loading ? (
                        <div className="w-full h-32 flex items-center justify-center">
                            <span className="text-sm font-medium tracking-widest text-zinc-950/50 uppercase animate-pulse">Loading Insights...</span>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="w-full py-16 text-center border border-dashed border-zinc-950/10 rounded-[2rem]">
                            <p className="text-lg font-serif text-zinc-950 italic">No perspectives shared yet.</p>
                            <p className="text-sm text-zinc-950/50 mt-2">Be the first to curate an insight for this piece.</p>
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
                                        "group relative bg-white/60 backdrop-blur-xl rounded-[2rem] p-8 lg:p-10 border border-white hover:border-primary/20 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] flex flex-col hover:-translate-y-1 overflow-hidden",
                                        index % 2 === 1 ? "md:mt-12" : "",
                                        index % 3 === 2 ? "lg:mt-24" : ""
                                    )}
                                >
                                    {/* Subtle gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-6 relative z-10">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < review.rating ? "#A05A45" : "transparent"}
                                                color={i < review.rating ? "#A05A45" : "#E5E7EB"}
                                                className={i < review.rating ? "drop-shadow-sm" : ""}
                                            />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <h4 className="text-xl font-medium text-zinc-950 font-serif mb-3 relative z-10 group-hover:text-primary transition-colors">{review.title}</h4>
                                    <p className="text-md text-zinc-950/70 font-sans leading-relaxed mb-8 relative z-10 italic">
                                        "{review.content}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center justify-between mt-auto relative z-10 pt-6 border-t border-zinc-950/5">
                                        <div className="flex items-center gap-4">
                                            <Avatar.Root className="inline-flex items-center justify-center align-middle overflow-hidden w-12 h-12 rounded-full border-2 border-white shadow-sm select-none bg-gradient-to-br from-zinc-950/10 to-transparent">
                                                <Avatar.Fallback
                                                    className="w-full h-full flex items-center justify-center bg-transparent text-zinc-950 text-sm font-serif italic"
                                                >
                                                    {review.customer_id === "me" ? "M" : "A"}
                                                </Avatar.Fallback>
                                            </Avatar.Root>

                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-zinc-950">Verified Curator</span>
                                                <span className="text-[10px] text-zinc-950/50 uppercase tracking-widest mt-0.5">
                                                    {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
