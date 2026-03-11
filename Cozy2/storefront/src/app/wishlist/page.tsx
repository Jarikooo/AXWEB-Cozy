"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/lib/context/wishlist-context";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Heart, Trash2, ShoppingBag, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FeaturedGrid } from "@/components/shop/featured-grid";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] bg-[#f9fafb] text-zinc-950 font-sans p-4 md:p-8 lg:p-16 flex flex-col pt-32 pb-32">

            <div className="max-w-6xl w-full mx-auto mb-16 flex justify-between items-end border-b border-zinc-200 pb-8">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-sans text-sm font-medium animate-fade-in-up group w-fit mb-6"
                    >
                        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Terug
                    </button>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-zinc-950 flex items-center gap-4">
                        <Heart className="text-primary fill-primary" size={40} />
                        Jouw Verlanglijst
                    </h1>
                </div>
                {wishlist.length > 0 && (
                    <button
                        onClick={clearWishlist}
                        className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={14} /> Lijst wissen
                    </button>
                )}
            </div>

            <div className="max-w-6xl w-full mx-auto">
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center gap-12 w-full">
                        <div className="text-center py-20 px-8 w-full bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)]">
                            <Heart size={48} className="mx-auto text-zinc-950/20 mb-6 stroke-1" />
                            <h2 className="font-serif italic text-3xl text-zinc-950 mb-4">Je verlanglijst is momenteel leeg.</h2>
                            <p className="text-zinc-950/60 mb-10 max-w-md mx-auto font-sans leading-relaxed">
                                Ontdek onze collecties en klik op het hartje om jouw favoriete items te bewaren.
                            </p>
                            <MagneticButton
                                onClick={() => router.push('/shop')}
                                className="px-10 py-4 bg-zinc-950 text-white rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors shadow-2xl"
                                magneticPull={0.4}
                            >
                                Verder winkelen
                            </MagneticButton>
                        </div>

                        <div className="w-full">
                            <FeaturedGrid title="Essentials" limit={4} />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.map((product) => {
                            const priceFormatted = new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "eur",
                                minimumFractionDigits: 2,
                            }).format(product.price);

                            return (
                                <div key={product.id} className="group flex flex-col">
                                    <div className="relative w-full aspect-[3/4] bg-background-light/50 rounded-2xl overflow-hidden mb-4">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                                        />

                                        <div className="absolute top-4 right-4 z-20">
                                            <button
                                                onClick={() => removeFromWishlist(product.id)}
                                                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-primary hover:bg-white border border-black/5 shadow-sm transition-all"
                                                aria-label="Verwijder van verlanglijst"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>

                                        <div className="absolute inset-x-4 bottom-4 z-20">
                                            <Link
                                                href={`/products/${product.handle || product.id}`}
                                                className="w-full py-3 bg-white/90 backdrop-blur-md text-zinc-950 rounded-xl font-sans text-[10px] font-bold uppercase tracking-widest flex flex-col items-center justify-center shadow-lg hover:bg-zinc-950 hover:text-white transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                                            >
                                                Bekijk Product
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <h3 className="font-serif italic text-lg text-zinc-950 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <span className="font-sans text-sm font-medium text-zinc-500">
                                            {priceFormatted}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
