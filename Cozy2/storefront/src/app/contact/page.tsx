"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        const form = e.currentTarget;
        const data = {
            firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value,
            lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const result = await res.json();
                setError(result.error || "Er is iets misgegaan.");
            }
        } catch {
            setError("Kan geen verbinding maken. Probeer het later opnieuw.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="w-full border-b border-[#18181b] bg-mint">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-32 pb-10 md:pb-14">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-3">Contact</p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.9] mb-4">
                        Laten we<br />praten.
                    </h1>
                    <p className="text-sm text-[#18181b]/60 max-w-md leading-relaxed">
                        Heb je vragen over een product, je bestelling, of wil je gewoon hallo zeggen? We horen graag van je.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-20 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Contact Info */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="bg-white p-6 md:p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="size-12 bg-mint border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                    <span className="material-symbols-outlined !text-[20px] text-[#18181b]">mail</span>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-1">E-mail</h3>
                                    <a href="mailto:info@cozymssls.nl" className="text-sm text-[#18181b]/70 hover:text-primary transition-colors">
                                        info@cozymssls.nl
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="size-12 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                    <span className="material-symbols-outlined !text-[20px] text-[#18181b]">call</span>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-1">Telefoon</h3>
                                    <a href="tel:+31612345678" className="text-sm text-[#18181b]/70 hover:text-primary transition-colors">
                                        +31 (0)6 12 34 56 78
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="size-12 bg-mint border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                    <span className="material-symbols-outlined !text-[20px] text-[#18181b]">location_on</span>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-1">Adres</h3>
                                    <p className="text-sm text-[#18181b]/70">Maassluis, Nederland</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[#18181b] mb-4">Bedrijfsgegevens</h3>
                            <ul className="space-y-2 text-sm text-[#18181b]/60">
                                <li><strong className="text-[#18181b]">Cozy Mssls B.V.</strong></li>
                                <li>Straatnaam 123</li>
                                <li>1234 AB, Maassluis</li>
                                <li>Nederland</li>
                                <li className="pt-2">KVK: 12345678</li>
                                <li>BTW: NL123456789B01</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white p-6 md:p-10 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
                                    <div className="size-16 bg-mint border border-[#18181b] flex items-center justify-center shadow-[3px_3px_0px_rgba(9,9,11,0.05)] mb-4">
                                        <span className="material-symbols-outlined !text-[28px] text-[#18181b]">check</span>
                                    </div>
                                    <h3 className="text-2xl font-extrabold tracking-tighter uppercase italic text-[#18181b]">Bericht verzonden</h3>
                                    <p className="text-sm text-[#18181b]/60">
                                        Bedankt voor je bericht. We streven ernaar om binnen 24 uur te reageren.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-4 px-8 py-3 bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-mint-light hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                                    >
                                        Nieuw bericht sturen
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    {error && (
                                        <div className="p-4 bg-[#ffe4e6] text-[#18181b] border border-[#18181b] text-sm font-bold">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Voornaam</label>
                                            <input type="text" id="firstName" name="firstName" required className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30" placeholder="Jan" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Achternaam</label>
                                            <input type="text" id="lastName" name="lastName" required className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30" placeholder="Jansen" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">E-mailadres</label>
                                        <input type="email" id="email" name="email" required className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30" placeholder="jan@voorbeeld.nl" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Onderwerp</label>
                                        <input type="text" id="subject" name="subject" required className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30" placeholder="Waar gaat het over?" />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-[#18181b]">Bericht</label>
                                        <textarea id="message" name="message" rows={5} required className="w-full bg-white border border-[#18181b] px-5 py-4 text-[#18181b] text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-[#18181b]/30 resize-none" placeholder="Typ hier je bericht..." />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full mt-2 py-5 bg-primary text-white font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {submitting ? "Verzenden..." : "Verstuur Bericht"}
                                    </button>
                                    <p className="text-center text-xs text-[#18181b]/40">
                                        Door dit formulier te verzenden ga je akkoord met ons <Link href="/privacybeleid" className="underline hover:text-[#18181b]">privacybeleid</Link>.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
