"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { ProductReviews } from "@/components/product/product-reviews";
import { PDPSkeleton } from "@/components/product/pdp-skeleton";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP);
}

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const handleOrId = params.handle as string;

    const { addItem } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMedusaProducts().then(({ products }) => {
            const found = products.find(p => p.handle === handleOrId || p.id === handleOrId);
            if (found) {
                setProduct(found);
                if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
                if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);

                const related = products.filter(p => p.id !== found.id && (p.category === found.category)).slice(0, 4);
                if (related.length === 0) setRelatedProducts(products.filter(p => p.id !== found.id).slice(0, 4));
                else setRelatedProducts(related);
            }
            setLoading(false);
        }).catch(err => {
            console.error("Failed to fetch product", err);
            setLoading(false);
        });
    }, [handleOrId]);

    useGSAP(() => {
        if (!containerRef.current || loading || !product) return;

        const tl = gsap.timeline();

        if (imageRef.current) {
            tl.fromTo(imageRef.current,
                { opacity: 0, x: -40 },
                { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
                0
            );
        }

        if (detailsRef.current) {
            const children = detailsRef.current.children;
            tl.fromTo(children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
                0.15
            );
        }
    }, { scope: containerRef, dependencies: [loading, product] });

    const activeVariantId = product?.variantMap?.[`${selectedColor}-${selectedSize}`] || product?.variantId;

    const handleAddToCart = async () => {
        if (!activeVariantId || !product) return;
        setIsAdding(true);
        try {
            await addItem(activeVariantId, quantity);
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) {
        return <PDPSkeleton />;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-white">
                <div className="text-center">
                    <h1 className="font-extrabold uppercase italic text-4xl md:text-6xl text-zinc-950 mb-4">Product niet gevonden.</h1>
                    <Link href="/shop" className="inline-block text-xs font-bold uppercase tracking-widest text-zinc-950 border border-zinc-950 px-6 py-3 hover:bg-[#ffe4e6] transition-colors">
                        Terug naar shop
                    </Link>
                </div>
            </div>
        );
    }

    const priceFormatted = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    }).format(product.price);

    const productImages = [product.image, product.secondaryImage].filter(Boolean) as string[];

    return (
        <div ref={containerRef} className="flex flex-col w-full bg-white min-h-screen">
            {/* Main Product Section — 2-column on desktop */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-8 md:pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-start">
                    {/* Left: Image Gallery */}
                    <div ref={imageRef} className="flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="relative aspect-[4/5] w-full bg-background-light border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            {productImages.length > 0 ? (
                                <Image
                                    src={productImages[selectedImageIndex]}
                                    alt={product.name}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-contain mix-blend-multiply p-6 md:p-10"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                    <span className="material-symbols-outlined text-6xl">image</span>
                                </div>
                            )}

                            {/* Badges */}
                            {product.isNew && (
                                <div className="absolute top-4 left-4 bg-[#f9a8d4] text-zinc-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 border border-[#18181b]">
                                    Nieuw
                                </div>
                            )}

                            {/* Wishlist Button — same as shop list page */}
                            <button
                                onClick={() => {
                                    if (isInWishlist(product.id)) {
                                        removeFromWishlist(product.id);
                                    } else {
                                        addToWishlist(product);
                                    }
                                }}
                                className="absolute -top-3 -right-3 z-20 size-10 bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] flex items-center justify-center hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                                aria-label={isInWishlist(product.id) ? "Verwijder uit verlanglijst" : "Voeg toe aan verlanglijst"}
                            >
                                <span className={`material-symbols-outlined !text-[20px] text-[#18181b]`} style={{ fontVariationSettings: isInWishlist(product.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                            </button>
                        </div>

                        {/* Thumbnail Strip */}
                        {productImages.length > 1 && (
                            <div className="flex gap-3">
                                {productImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImageIndex(i)}
                                        className={`relative w-20 h-20 border bg-background-light overflow-hidden transition-all ${
                                            selectedImageIndex === i
                                                ? "border-zinc-950 shadow-[3px_3px_0px_#18181b]"
                                                : "border-zinc-950/30 hover:border-zinc-950"
                                        }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} view ${i + 1}`}
                                            fill
                                            sizes="80px"
                                            className="object-contain mix-blend-multiply p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details (sticky on desktop) */}
                    <div ref={detailsRef} className="flex flex-col md:sticky md:top-28">
                        {/* Category Tag */}
                        <div className="mb-4">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-zinc-950/60 border border-zinc-950/20 px-3 py-1.5">
                                {product.category || "Object"} — Cozy Collectie
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-zinc-950 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[0.95] tracking-tighter uppercase italic mb-4">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <p className="text-zinc-950 text-2xl md:text-3xl font-bold tracking-tight mb-8">
                            {priceFormatted}
                        </p>

                        {/* Description (visible by default on desktop) */}
                        <p className="text-sm text-zinc-950/70 leading-relaxed mb-10 max-w-lg">
                            {product.description || "Ontworpen met minimalistische lijnen en speelse kleuren. Een echte blijmaker voor in huis."}
                        </p>

                        {/* Color Selector */}
                        {product.colors && product.colors.length > 0 && product.colors[0] !== "Default" && (
                            <div className="flex flex-col gap-3 mb-6">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">Kleur</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((c) => {
                                        const isSelected = selectedColor === c;
                                        return (
                                            <button
                                                key={c}
                                                onClick={() => setSelectedColor(c)}
                                                className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-all ${isSelected
                                                    ? "bg-mint text-zinc-950 border-zinc-950 shadow-[4px_4px_0px_#18181b] -translate-y-[1px] -translate-x-[1px]"
                                                    : "bg-white text-zinc-950 border-zinc-950 hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#18181b]"
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                            <div className="flex flex-col gap-3 mb-6">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">Maat</label>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((s) => {
                                        const isSelected = selectedSize === s;
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => setSelectedSize(s)}
                                                className={`px-5 py-2.5 border text-[10px] font-bold uppercase tracking-widest transition-all ${isSelected
                                                    ? "bg-mint text-zinc-950 border-zinc-950 shadow-[4px_4px_0px_#18181b] -translate-y-[1px] -translate-x-[1px]"
                                                    : "bg-white text-zinc-950 border-zinc-950 hover:bg-[#ffe4e6] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_#18181b]"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="flex flex-col gap-3 mb-8">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">Aantal</label>
                            <div className="flex items-center border border-zinc-950 w-fit bg-white shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center text-zinc-950 hover:bg-[#ffe4e6] transition-colors border-r border-zinc-950"
                                >
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                </button>
                                <span className="w-14 text-center font-bold text-sm">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center text-zinc-950 hover:bg-[#ffe4e6] transition-colors border-l border-zinc-950"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!activeVariantId || isAdding}
                            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 text-center uppercase tracking-widest transition-all border border-zinc-950 shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#18181b] mb-10"
                        >
                            {isAdding ? "Toevoegen..." : "In Winkelwagen"}
                        </button>

                        {/* Accordions */}
                        <div className="border-t border-zinc-950">
                            <div
                                className="flex justify-between items-center py-5 border-b border-zinc-950 cursor-pointer group"
                                onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                            >
                                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Beschrijving</span>
                                <span className="material-symbols-outlined text-sm transition-transform duration-300" style={{ transform: openAccordion === 'desc' ? 'rotate(45deg)' : 'rotate(0deg)' }}>add</span>
                            </div>
                            {openAccordion === 'desc' && (
                                <div className="py-5 text-sm text-zinc-950/70 leading-relaxed border-b border-zinc-950">
                                    {product.description || "Ontworpen met minimalistische lijnen en speelse kleuren. Dit object belichaamt de Copenhagen spirit."}
                                </div>
                            )}

                            <div
                                className="flex justify-between items-center py-5 border-b border-zinc-950 cursor-pointer group"
                                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                            >
                                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Verzending & Retour</span>
                                <span className="material-symbols-outlined text-sm transition-transform duration-300" style={{ transform: openAccordion === 'shipping' ? 'rotate(45deg)' : 'rotate(0deg)' }}>add</span>
                            </div>
                            {openAccordion === 'shipping' && (
                                <div className="py-5 text-sm text-zinc-950/70 leading-relaxed border-b border-zinc-950">
                                    Gratis standaard verzending bij bestellingen boven €150. 30 dagen bedenktijd. Retourneren kan in originele staat.
                                </div>
                            )}

                            <div
                                className="flex justify-between items-center py-5 border-b border-zinc-950 cursor-pointer group"
                                onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                            >
                                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Onderhoud</span>
                                <span className="material-symbols-outlined text-sm transition-transform duration-300" style={{ transform: openAccordion === 'care' ? 'rotate(45deg)' : 'rotate(0deg)' }}>add</span>
                            </div>
                            {openAccordion === 'care' && (
                                <div className="py-5 text-sm text-zinc-950/70 leading-relaxed border-b border-zinc-950">
                                    Behandel met zorg. Reinig met een zachte, droge doek. Bewaar op een droge plaats, uit direct zonlicht.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="w-full border-t border-zinc-950 bg-mint/50">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-12 text-zinc-950/40">Misschien vind je dit ook leuk</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8">
                            {relatedProducts.map(rp => (
                                <div className="flex flex-col group" key={rp.id}>
                                    <Link href={`/products/${rp.handle || rp.id}`} className="block">
                                        <div className="relative aspect-square w-full bg-white border border-zinc-950 overflow-hidden mb-3">
                                            {rp.image ? (
                                                <Image
                                                    alt={rp.name}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    src={rp.image}
                                                />
                                            ) : <div className="w-full h-full bg-zinc-100" />}
                                        </div>
                                        <h4 className="text-sm font-bold text-zinc-950 truncate group-hover:text-primary transition-colors">{rp.name}</h4>
                                        <span className="text-sm text-zinc-950/60 mt-0.5 block">{new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(rp.price)}</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews */}
            <section className="w-full border-t border-zinc-950 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <ProductReviews productId={product.id} />
                </div>
            </section>
        </div>
    );
}
