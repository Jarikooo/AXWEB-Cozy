"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/lib/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import { FeaturedGrid } from "../shop/featured-grid";

export function SlideOutCart() {
    const { cart, isCartOpen, setIsCartOpen, removeItem, updateItem } = useCart();
    const cartRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (isCartOpen) {
            // Open animation
            gsap.to(overlayRef.current, {
                opacity: 1,
                pointerEvents: "auto",
                duration: 0.4,
                ease: "power3.out",
            });
            gsap.to(cartRef.current, {
                x: "0%",
                duration: 0.6,
                ease: "power4.out",
            });
        } else {
            // Close animation
            gsap.to(overlayRef.current, {
                opacity: 0,
                pointerEvents: "none",
                duration: 0.4,
                ease: "power3.in",
            });
            gsap.to(cartRef.current, {
                x: "100%",
                duration: 0.5,
                ease: "power4.in",
            });
        }
    }, { dependencies: [isCartOpen] });

    // Ensure cart doesn't prevent hydration by formatting numbers safely
    const formatPrice = (amount?: number) => {
        if (amount === undefined) return "";
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: cart?.currency_code || "eur",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <>
            <div
                ref={overlayRef}
                onClick={() => setIsCartOpen(false)}
                className="fixed inset-0 bg-zinc-950/30 z-[200] opacity-0 pointer-events-none"
            />

            <div
                ref={cartRef}
                className="fixed top-0 right-0 h-[100dvh] w-full max-w-[400px] bg-background-light  border-l border-zinc-950/10 z-[201] flex flex-col translate-x-full shadow-2xl"
            >
                <div className="flex items-center justify-between p-6 border-b border-zinc-950 ">
                    <div className="flex items-center gap-2 text-zinc-950 ">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        <h2 className="text-xl font-bold tracking-tight uppercase">Winkelwagen</h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="flex items-center justify-center p-2 text-zinc-950  hover:bg-primary/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
                    {!cart || !cart.items || cart.items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-12 py-12 p-6">
                            <div className="flex flex-col items-center gap-6 text-zinc-950/60 ">
                                <span className="text-2xl font-bold italic uppercase tracking-widest text-zinc-950 ">Je winkelwagen is leeg.</span>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest transition-colors hover:bg-primary/90 shadow-xl"
                                >
                                    Verder Winkelen
                                </button>
                            </div>

                            <div className="w-full mt-8 text-left">
                                <FeaturedGrid title="Trending Nu" limit={2} />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-zinc-950/10 ">
                            {cart.items.map((item: any) => (
                                <div key={item.id} className="p-6 py-8 flex gap-4 items-start group">
                                    <div className="w-24 h-24 shrink-0 bg-zinc-100  border border-zinc-950/5  relative overflow-hidden">
                                        {item.variant?.product?.thumbnail ? (
                                            <Image
                                                src={item.variant.product.thumbnail}
                                                alt={item.title}
                                                fill
                                                className="object-cover mix-blend-multiply "
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-100 " />
                                        )}
                                    </div>

                                    <div className="flex flex-col flex-1 h-24 justify-between">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col truncate pr-2">
                                                <p className="text-sm font-bold leading-tight uppercase tracking-wide text-zinc-950  truncate w-full" title={item.title}>
                                                    {item.title}
                                                </p>
                                                <p className="text-xs font-medium text-zinc-600  mt-1 uppercase tracking-tighter truncate w-full" title={item.variant?.title}>
                                                    {item.variant?.title}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-zinc-400 hover:text-primary transition-colors shrink-0"
                                                aria-label="Verwijder item"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center border border-zinc-950  bg-white  sharp-shadow">
                                                <button
                                                    onClick={() => {
                                                        if (updateItem && item.quantity > 1) {
                                                            updateItem(item.id, item.quantity - 1);
                                                        } else if (item.quantity === 1) {
                                                            removeItem(item.id);
                                                        }
                                                    }}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-zinc-50 :bg-zinc-800 border-r border-zinc-950  text-zinc-950 "
                                                >
                                                    <span className="material-symbols-outlined text-xs">remove</span>
                                                </button>
                                                <span className="w-8 text-center text-xs font-bold text-zinc-950 ">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        if (updateItem) {
                                                            updateItem(item.id, item.quantity + 1);
                                                        }
                                                    }}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-zinc-50 :bg-zinc-800 border-l border-zinc-950  text-zinc-950 "
                                                >
                                                    <span className="material-symbols-outlined text-xs">add</span>
                                                </button>
                                            </div>
                                            <p className="text-sm font-bold tracking-tight text-zinc-950 ">
                                                {formatPrice(item.unit_price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart && cart.items && cart.items.length > 0 && (
                    <div className="p-6 space-y-6 bg-white  border-t border-zinc-950  mt-auto flex-shrink-0">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm uppercase tracking-widest font-medium text-zinc-950 ">
                                <span>Subtotaal</span>
                                <span>{formatPrice(cart.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm uppercase tracking-widest font-medium text-zinc-400">
                                <span>Verzending</span>
                                <span>Berekend bij afrekenen</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="bg-primary text-white py-5 text-sm font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-transform sharp-shadow border border-zinc-950 flex justify-center w-full"
                        >
                            Afrekenen
                        </Link>
                        <p className="text-[10px] text-center text-zinc-400 uppercase tracking-widest leading-relaxed">
                            Veilig afrekenen bij Cozy Mssls. <br />
                            BTW inbegrepen in de eindprijs.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
