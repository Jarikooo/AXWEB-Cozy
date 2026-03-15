"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/lib/context/wishlist-context";
import { useCart } from "@/lib/context/cart-context";
import { FeaturedGrid } from "@/components/shop/featured-grid";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addItem } = useCart();
    const router = useRouter();
    const [addingId, setAddingId] = useState<string | null>(null);

    const totalValue = wishlist.reduce((sum, p) => sum + p.price, 0);
    const freeShippingThreshold = 150;
    const amountToFreeShipping = Math.max(0, freeShippingThreshold - totalValue);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(price);

    const handleAddToCart = async (product: typeof wishlist[0]) => {
        if (!product.variantId) return;
        setAddingId(product.id);
        try {
            await addItem(product.variantId, 1);
        } finally {
            setAddingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Page Header */}
            <div className="w-full border-b border-[#18181b] bg-mint">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-10 md:pb-14">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase italic text-zinc-950 leading-[0.9] mb-3">
                        Verlanglijst
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-sm text-zinc-950/60">
                            {wishlist.length === 0
                                ? "Je hebt nog geen favorieten opgeslagen."
                                : `${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} bewaard`
                            }
                        </p>
                        {wishlist.length > 0 && (
                            <button
                                onClick={clearWishlist}
                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-950/40 hover:text-zinc-950 transition-colors flex items-center gap-2 w-fit"
                            >
                                <span className="material-symbols-outlined !text-[14px]">delete</span>
                                Lijst wissen
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-16 flex-1">
                {wishlist.length === 0 ? (
                    <div className="flex flex-col items-center gap-16 w-full">
                        {/* Empty State */}
                        <div className="text-center py-20 px-8 w-full border border-dashed border-zinc-950/20">
                            <span className="material-symbols-outlined !text-[48px] text-zinc-950/15 mb-6 block">favorite</span>
                            <h2 className="font-extrabold uppercase italic text-2xl md:text-3xl text-zinc-950 tracking-tighter mb-4">
                                Nog geen favorieten.
                            </h2>
                            <p className="text-sm text-zinc-950/60 mb-10 max-w-md mx-auto leading-relaxed">
                                Ontdek onze collecties en klik op het hartje om jouw favoriete items te bewaren.
                            </p>
                            <Link
                                href="/shop"
                                className="inline-block bg-primary text-white font-bold uppercase tracking-widest text-xs px-10 py-4 border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-primary/90 hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                            >
                                Ontdek de Collectie
                            </Link>
                        </div>

                        {/* Trending Products */}
                        <FeaturedGrid title="Trending Nu" limit={4} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {/* Free Shipping Banner */}
                        <div className="w-full bg-mint border border-[#18181b] p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined !text-[20px] text-zinc-950">local_shipping</span>
                                {amountToFreeShipping > 0 ? (
                                    <p className="text-xs font-bold text-zinc-950">
                                        Nog <span className="text-primary">{formatPrice(amountToFreeShipping)}</span> tot gratis verzending!
                                    </p>
                                ) : (
                                    <p className="text-xs font-bold text-zinc-950">
                                        Je komt in aanmerking voor <span className="text-primary">gratis verzending</span>!
                                    </p>
                                )}
                            </div>
                            {amountToFreeShipping > 0 && (
                                <div className="w-full sm:w-48 h-2 bg-white border border-[#18181b] overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${Math.min(100, (totalValue / freeShippingThreshold) * 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
                            {wishlist.map((product) => (
                                <div key={product.id} className="group flex flex-col relative">
                                    {/* Image Box */}
                                    <div className="relative aspect-square w-full bg-white border border-[#18181b]">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-100" />
                                        )}

                                        {/* New badge */}
                                        {product.isNew && (
                                            <div className="absolute top-2 left-2 z-10 bg-[#f9a8d4] text-[#18181b] text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-[#18181b]">New</div>
                                        )}

                                        {/* Remove button — top right, overlapping */}
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="absolute -top-3 -right-3 z-20 size-10 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                                            aria-label="Verwijder van verlanglijst"
                                        >
                                            <span className="material-symbols-outlined !text-[18px] text-[#18181b]">close</span>
                                        </button>

                                        {/* Add to Cart — bottom center, overlapping */}
                                        <div className="absolute -bottom-5 inset-x-0 z-20 flex justify-center pointer-events-none">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!product.variantId || addingId === product.id}
                                                className="pointer-events-auto w-3/4 max-w-[200px] h-12 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center gap-2 hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 text-[10px] font-bold uppercase tracking-widest text-[#18181b]"
                                            >
                                                {addingId === product.id ? (
                                                    "Toevoegen..."
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined !text-[18px]">shopping_cart</span>
                                                        In wagen
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Link overlay */}
                                        <Link href={`/products/${product.handle || product.id}`} className="absolute inset-0 z-10" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="pt-8 pb-2 flex flex-col items-center text-center">
                                        <Link href={`/products/${product.handle || product.id}`}>
                                            <h3 className="text-sm font-bold text-[#18181b] mb-1 hover:underline">{product.name}</h3>
                                        </Link>
                                        <span className="font-bold text-[#18181b]">{formatPrice(product.price)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom CTA Section */}
                        <div className="border-t border-[#18181b] pt-10 mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-950/40 mb-1">Totale waarde verlanglijst</p>
                                <p className="text-3xl font-extrabold tracking-tighter text-zinc-950">{formatPrice(totalValue)}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="/shop"
                                    className="px-8 py-4 bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center"
                                >
                                    Verder Winkelen
                                </Link>
                                <Link
                                    href="/shop"
                                    className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center"
                                >
                                    Bekijk de Collectie
                                </Link>
                            </div>
                        </div>

                        {/* Trending Section */}
                        <div className="border-t border-[#18181b] pt-12 mt-4">
                            <FeaturedGrid title="Misschien vind je dit ook leuk" limit={4} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
