"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { MolliePaymentButton } from "@/components/checkout/mollie-button";
import Image from "next/image";
import Link from "next/link";
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
                    country_code: "nl",
                }
            });
            setIsSaved(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatPrice = (amount?: number) => {
        if (amount === undefined) return "";
        return new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: cart?.currency_code || "eur",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const isCartEmpty = !cart || !cart.items || cart.items.length === 0;

    return (
        <main className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="w-full border-b border-[#18181b] bg-mint">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-10 md:pb-14">
                    <Link href="/shop" className="flex items-center gap-2 text-[#18181b]/60 hover:text-[#18181b] transition-colors text-xs font-bold uppercase tracking-widest mb-6 w-fit group">
                        <span className="material-symbols-outlined !text-[16px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Terug naar Shop
                    </Link>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.9] mb-4">
                        Afrekenen
                    </h1>
                    <p className="text-sm text-[#18181b]/60 max-w-md leading-relaxed">
                        Vul je gegevens in om de bestelling af te ronden.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-20 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="bg-white p-6 md:p-10 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">

                            {/* Step Indicator */}
                            <div className="flex items-center gap-3 border-b border-[#18181b]/10 pb-6 mb-8">
                                <div className={`size-8 flex items-center justify-center font-bold text-xs border border-[#18181b] transition-colors ${isSaved ? "bg-mint text-[#18181b]" : "bg-[#18181b] text-white"}`}>
                                    {isSaved ? (
                                        <span className="material-symbols-outlined !text-[16px]">check</span>
                                    ) : (
                                        "1"
                                    )}
                                </div>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-[#18181b]">Bezorggegevens</h2>
                            </div>

                            {isSaved ? (
                                <div className="flex flex-col gap-4">
                                    <div className="bg-mint border border-[#18181b] p-6 flex items-center gap-4 shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                                        <span className="material-symbols-outlined !text-[24px] text-[#18181b]">check_circle</span>
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-1">Bezorggegevens bevestigd</p>
                                            <p className="text-sm text-[#18181b]/60">{firstName} {lastName} &middot; {address}, {zip} {city}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsSaved(false)}
                                        className="w-fit text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 hover:text-[#18181b] transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined !text-[14px]">edit</span>
                                        Gegevens wijzigen
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateShipping} className="flex flex-col gap-5">
                                    {/* Email */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="checkout-email" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">E-mailadres</label>
                                        <input
                                            id="checkout-email"
                                            required
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30"
                                            placeholder="jan@voorbeeld.nl"
                                        />
                                    </div>

                                    {/* Name Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="checkout-firstName" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Voornaam</label>
                                            <input
                                                id="checkout-firstName"
                                                required
                                                type="text"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30"
                                                placeholder="Jan"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="checkout-lastName" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Achternaam</label>
                                            <input
                                                id="checkout-lastName"
                                                required
                                                type="text"
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30"
                                                placeholder="Jansen"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="checkout-address" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Adres</label>
                                        <input
                                            id="checkout-address"
                                            required
                                            type="text"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30"
                                            placeholder="Kerkstraat 12"
                                        />
                                    </div>

                                    {/* City & Zip Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="checkout-city" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Plaats</label>
                                            <input
                                                id="checkout-city"
                                                required
                                                type="text"
                                                value={city}
                                                onChange={e => setCity(e.target.value)}
                                                className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30"
                                                placeholder="Maassluis"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="checkout-zip" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Postcode</label>
                                            <input
                                                id="checkout-zip"
                                                required
                                                type="text"
                                                value={zip}
                                                onChange={e => setZip(e.target.value)}
                                                className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30"
                                                placeholder="3144 AB"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isUpdating || isCartEmpty}
                                        className="w-full mt-2 py-5 bg-primary text-white font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {isUpdating ? "Opslaan..." : "Bezorggegevens Bevestigen"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Order Summary & Payment */}
                    <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">

                        {/* Order Summary */}
                        <div className="bg-white p-6 md:p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#18181b] mb-6">Bestelling</h3>

                            {isCartEmpty ? (
                                <div className="py-10 text-center border border-dashed border-[#18181b]/20">
                                    <span className="material-symbols-outlined !text-[32px] text-[#18181b]/15 mb-3 block">shopping_bag</span>
                                    <p className="text-sm text-[#18181b]/50 font-bold">Je winkelwagen is leeg.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <ul className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto">
                                        {cart.items?.map((item: any) => (
                                            <li key={item.id} className="flex gap-4 items-center">
                                                <div className="relative w-16 h-20 border border-[#18181b] overflow-hidden bg-[#f4f4f5] shrink-0">
                                                    {item.variant?.product?.thumbnail && (
                                                        <Image src={item.variant.product.thumbnail} alt={item.title} fill className="object-cover" />
                                                    )}
                                                    <div className="absolute top-0 right-0 w-5 h-5 bg-[#18181b] text-white flex items-center justify-center text-[9px] font-bold">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-[#18181b] leading-tight truncate">{item.title}</p>
                                                    <p className="text-[10px] text-[#18181b]/40 uppercase tracking-widest mt-1">{item.variant?.title}</p>
                                                    <p className="text-sm font-bold text-[#18181b] mt-2">{formatPrice(item.unit_price * item.quantity)}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t border-[#18181b]/10 pt-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#18181b]/60">Subtotaal</span>
                                            <span className="font-bold text-[#18181b]">{formatPrice(cart.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#18181b]/60">Verzending</span>
                                            <span className="font-bold text-primary">Gratis</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center border-t border-[#18181b] pt-6">
                                        <span className="text-lg font-extrabold uppercase tracking-tighter text-[#18181b]">Totaal</span>
                                        <span className="text-2xl font-extrabold tracking-tighter text-primary">{formatPrice(cart.total ?? cart.subtotal)}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="bg-white p-6 md:p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            <div className="flex items-center gap-3 border-b border-[#18181b]/10 pb-6 mb-6">
                                <div className={`size-8 flex items-center justify-center font-bold text-xs border border-[#18181b] transition-colors ${!isSaved ? "bg-white text-[#18181b]/30" : "bg-[#18181b] text-white"}`}>
                                    2
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#18181b]">Betaling</h3>
                            </div>

                            {!isSaved ? (
                                <div className="py-8 text-center border border-dashed border-[#18181b]/20">
                                    <span className="material-symbols-outlined !text-[28px] text-[#18181b]/15 mb-3 block">lock</span>
                                    <p className="text-sm text-[#18181b]/50">
                                        Bevestig eerst je bezorggegevens om door te gaan naar de betaling.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-[#18181b]/60">
                                        Je wordt doorgestuurd naar Mollie om veilig af te rekenen. We accepteren iDeal, Klarna en alle gangbare creditcards.
                                    </p>
                                    <MolliePaymentButton cart={cart} notReady={isCartEmpty} />
                                </div>
                            )}
                        </div>

                        {/* Trust Signals */}
                        <div className="flex items-center justify-center gap-6 py-4">
                            <div className="flex items-center gap-2 text-[#18181b]/30">
                                <span className="material-symbols-outlined !text-[16px]">lock</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Veilig betalen</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#18181b]/30">
                                <span className="material-symbols-outlined !text-[16px]">local_shipping</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Gratis verzending</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
