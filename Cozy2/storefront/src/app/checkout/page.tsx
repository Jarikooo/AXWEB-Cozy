"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { MolliePaymentButton } from "@/components/checkout/mollie-button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { sdk } from "@/lib/medusa";

export default function CheckoutPage() {
    const { cart } = useCart();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleUpdateShipping = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cart) return;

        setIsUpdating(true);
        try {
            await sdk.store.cart.update(cart.id, {
                email,
                shipping_address: {
                    first_name: firstName,
                    last_name: lastName,
                    address_1: address,
                    city,
                    postal_code: zip,
                    country_code: "nl", // default to NL for Mollie iDeal base
                }
            });
            setIsSaved(true);
        } catch (error) {
            console.error(error);
            alert("Failed to save shipping info.");
        } finally {
            setIsUpdating(false);
        }
    };

    const formatPrice = (amount?: number) => {
        if (amount === undefined) return "";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: cart?.currency_code || "eur",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <div className="min-h-[100dvh] bg-[#f9fafb] text-zinc-950 font-sans p-4 md:p-8 flex items-center justify-center pt-24 pb-24">
            <div className="max-w-[1200px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                {/* Left Column: Form */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors w-fit font-semibold text-xs uppercase tracking-widest mb-2">
                        <ArrowLeft size={16} /> Return to Shop
                    </Link>

                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight text-zinc-950 mb-2">Checkout</h1>
                        <p className="text-zinc-500 text-sm">Please provide your details to complete the order.</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 flex flex-col gap-8 relative overflow-hidden">

                        {/* Status Indicator */}
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isSaved ? "bg-emerald-500 text-white" : "bg-zinc-900 text-white"}`}>
                                1
                            </div>
                            <h2 className="text-xl font-medium tracking-tight">Delivery Details</h2>
                        </div>

                        <form onSubmit={handleUpdateShipping} className="flex flex-col gap-6">

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Email Address</label>
                                <input required type="email" value={email} onChange={e => { setEmail(e.target.value); setIsSaved(false); }} className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm" placeholder="jane.doe@example.com" />
                            </div>

                            {/* Name Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">First Name</label>
                                    <input required type="text" value={firstName} onChange={e => { setFirstName(e.target.value); setIsSaved(false); }} className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm" placeholder="Jane" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Last Name</label>
                                    <input required type="text" value={lastName} onChange={e => { setLastName(e.target.value); setIsSaved(false); }} className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm" placeholder="Doe" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Address</label>
                                <input required type="text" value={address} onChange={e => { setAddress(e.target.value); setIsSaved(false); }} className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm" placeholder="Oudegracht 123" />
                            </div>

                            {/* City & Zip Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">City</label>
                                    <input required type="text" value={city} onChange={e => { setCity(e.target.value); setIsSaved(false); }} className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm" placeholder="Amsterdam" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Postal Code</label>
                                    <input required type="text" value={zip} onChange={e => { setZip(e.target.value); setIsSaved(false); }} className="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-5 py-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm" placeholder="1012 AB" />
                                </div>
                            </div>

                            {/* Submit Details Button */}
                            {!isSaved ? (
                                <button type="submit" disabled={isUpdating || isCartEmpty} className="mt-4 w-full py-5 bg-zinc-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isUpdating ? "Saving Details..." : "Confirm Delivery Details"}
                                </button>
                            ) : (
                                <div className="mt-4 w-full py-5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-emerald-100/50">
                                    Delivery Details Confirmed ✓
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right Column: Order Summary & Payment */}
                <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-32">

                    {/* Order Summary Box */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 flex flex-col relative overflow-hidden">
                        <h3 className="text-xl font-medium tracking-tight mb-8">Order Summary</h3>

                        {isCartEmpty ? (
                            <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                <p className="text-zinc-500 text-sm font-medium">Your cart is empty.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <ul className="flex flex-col gap-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.items?.map((item: any) => (
                                        <li key={item.id} className="flex gap-4 items-center group">
                                            <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                                                {item.variant?.product?.thumbnail && (
                                                    <Image src={item.variant.product.thumbnail} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                                )}
                                                <div className="absolute top-0 right-0 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-bl-lg flex items-center justify-center text-[10px] font-bold text-zinc-800">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-serif italic text-lg leading-tight truncate text-zinc-950">{item.title}</p>
                                                <p className="text-xs text-zinc-500 mt-1">Variant: {item.variant?.title}</p>
                                                <p className="text-sm font-medium text-zinc-900 mt-2">{formatPrice(item.unit_price * item.quantity)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="h-px w-full bg-slate-100 my-2" />

                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center text-zinc-500 text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-zinc-900">{formatPrice(cart.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-zinc-500 text-sm">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600 font-medium tracking-tight">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-2xl font-serif font-medium mt-4 pt-6 border-t border-slate-100">
                                    <span className="text-zinc-950">Total</span>
                                    <span className="text-primary">{formatPrice(cart.total ?? cart.subtotal)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Payment Box */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-200/50 flex flex-col gap-6 relative overflow-hidden">

                        <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${!isSaved ? "bg-zinc-100 text-zinc-400" : "bg-zinc-900 text-white"}`}>
                                2
                            </div>
                            <h3 className="text-xl font-medium tracking-tight">Payment</h3>
                        </div>

                        {!isSaved ? (
                            <div className="bg-zinc-50 rounded-2xl p-6 text-center border border-dashed border-zinc-200">
                                <LockKeyhole className="mx-auto mb-3 text-zinc-300" size={24} strokeWidth={1.5} />
                                <p className="text-sm text-zinc-500">Please confirm your delivery details first to proceed to secure payment.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <p className="text-sm text-zinc-500 mb-2">You will be redirected to Mollie to complete your purchase securely. We accept iDeal, Klarna, and all major credit cards.</p>
                                <MolliePaymentButton cart={cart} notReady={isCartEmpty} />
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}
