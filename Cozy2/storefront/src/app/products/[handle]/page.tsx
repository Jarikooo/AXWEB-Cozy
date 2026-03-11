"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { fetchMedusaProducts } from "@/lib/medusa";
import { Product } from "@/types";
import { useCart } from "@/lib/context/cart-context";
import { WishlistButton } from "@/components/product/wishlist-button";
import { ProductReviews } from "@/components/product/product-reviews";
import { PDPSkeleton } from "@/components/product/pdp-skeleton";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const handleOrId = params.handle as string;

    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    // simple accordion states
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    useEffect(() => {
        // Find product by handle or ID
        fetchMedusaProducts().then(({ products }) => {
            const found = products.find(p => p.handle === handleOrId || p.id === handleOrId);
            if (found) {
                setProduct(found);
                if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
                if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);

                // Set related products (simple heuristic: same category, or just first few)
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
            <div className="min-h-screen flex items-center justify-center p-8">
                <h1 className="font-extrabold uppercase italic text-4xl text-zinc-950">Product not found.</h1>
            </div>
        );
    }

    const priceFormatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "eur",
        minimumFractionDigits: 2,
    }).format(product.price);

    return (
        <div className="flex flex-col w-full bg-white  min-h-screen md:max-w-2xl mx-auto border-x border-zinc-950 shadow-2xl">
            {/* Header / Back Action (In design, PDP had its own top bar, but we use global header. We'll add a back button row though) */}
            <div className="flex items-center bg-background-light  p-4 justify-start border-b border-zinc-950 sticky top-16 z-40">
                <button onClick={() => router.back()} className="text-zinc-950  flex items-center justify-start hover:opacity-70 transition-opacity">
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="ml-2 text-xs font-bold uppercase tracking-widest">Back</span>
                </button>
            </div>

            <div className="p-6 md:p-12 bg-white  border-b border-zinc-950">
                <div className="aspect-square w-full bg-background-light  flex items-center justify-center p-8 sharp-shadow border border-zinc-950">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={600}
                            height={600}
                            className="w-full h-full object-contain mix-blend-multiply "
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            No Image
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 pt-10 pb-6">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <h1 className="text-zinc-950  text-3xl font-bold leading-tight tracking-tight uppercase">
                        {product.name}
                    </h1>
                    <WishlistButton
                        product={product}
                        className="text-zinc-950  shrink-0 mt-1 hover:text-primary transition-colors bg-transparent border-0 p-0"
                        iconSize={28}
                    />
                </div>
                <p className="text-zinc-950/60  text-sm uppercase tracking-widest mb-6">{product.category || "Object"} — Copenhagen Edition</p>

                <h2 className="text-zinc-950  text-2xl font-bold tracking-tight mb-8">{priceFormatted}</h2>

                {/* Selectors */}
                {product.colors && product.colors.length > 0 && product.colors[0] !== "Default" && (
                    <div className="flex flex-col gap-3 mb-6">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-950 ">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map((c) => {
                                const isSelected = selectedColor === c;
                                return (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedColor(c)}
                                        className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-colors ${isSelected
                                            ? 'bg-zinc-950 text-white border-zinc-950   '
                                            : 'bg-transparent text-zinc-950 border-zinc-950 hover:bg-zinc-100   :bg-zinc-800'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "One Size" && (
                    <div className="flex flex-col gap-3 mb-6">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-950 ">Size</label>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((s) => {
                                const isSelected = selectedSize === s;
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-colors ${isSelected
                                            ? 'bg-zinc-950 text-white border-zinc-950   '
                                            : 'bg-transparent text-zinc-950 border-zinc-950 hover:bg-zinc-100   :bg-zinc-800'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3 mb-8">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-950 ">Quantity</label>
                    <div className="flex items-center gap-4 border border-zinc-950  w-fit p-1 bg-white  sharp-shadow">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center text-zinc-950  hover:bg-zinc-100 :bg-zinc-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-950  hover:bg-zinc-100 :bg-zinc-800 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={!activeVariantId || isAdding}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 text-center uppercase tracking-widest transition-colors mb-12 sharp-shadow border border-zinc-950"
                >
                    {isAdding ? "Adding..." : "Add to Cart"}
                </button>

                <div className="border-t border-zinc-950/20 ">
                    <div
                        className="flex justify-between items-center py-5 border-b border-zinc-950/20  cursor-pointer"
                        onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Description</span>
                        <span className="material-symbols-outlined text-sm">{openAccordion === 'desc' ? 'remove' : 'add'}</span>
                    </div>
                    {openAccordion === 'desc' && (
                        <div className="py-4 text-sm text-zinc-950/80  leading-relaxed">
                            {product.description || "Designed with minimal lines and playful colors, this object embodies the Copenhagen spirit."}
                        </div>
                    )}

                    <div
                        className="flex justify-between items-center py-5 border-b border-zinc-950/20  cursor-pointer"
                        onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Shipping & Returns</span>
                        <span className="material-symbols-outlined text-sm">{openAccordion === 'shipping' ? 'remove' : 'add'}</span>
                    </div>
                    {openAccordion === 'shipping' && (
                        <div className="py-4 text-sm text-zinc-950/80  leading-relaxed">
                            Free standard shipping on orders over €150. 30-Day Happiness Guarantee. Returns accepted in original condition.
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 py-16 bg-mint/50  border-t border-zinc-950">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-12 text-center text-zinc-950/40 ">You might also like</h3>
                <div className="grid grid-cols-2 gap-6 md:gap-12">
                    {relatedProducts.map(rp => (
                        <div className="flex flex-col group cursor-pointer" key={rp.id} onClick={() => router.push(`/products/${rp.handle || rp.id}`)}>
                            <div className="aspect-[3/4] bg-background-light  mb-4 p-4 border border-zinc-950 group-hover:scale-[1.02] transition-transform">
                                {rp.image ? (
                                    <Image alt={rp.name} width={200} height={300} className="w-full h-full object-contain mix-blend-multiply " src={rp.image} />
                                ) : <div className="w-full h-full bg-zinc-100" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-950  truncate">{rp.name}</span>
                            <span className="text-[10px] text-zinc-950/60  mt-1">€{rp.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 py-12 border-t border-zinc-950 bg-white ">
                <ProductReviews productId={product.id} />
            </div>

        </div>
    );
}
