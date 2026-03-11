"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ContactPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call for the mockup
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 1200);
    };

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors font-sans text-sm font-medium mb-12 animate-fade-in-up group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Terug
                </button>
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Left Column: Info & Details */}
                    <div className="lg:col-span-5 space-y-12 animate-fade-in-up">
                        <div>
                            <h1 className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/60 mb-4">
                                Contact
                            </h1>
                            <h2 className="font-serif text-5xl text-zinc-950 font-medium tracking-tight mb-6">
                                Laten we praten.
                            </h2>
                            <p className="font-sans text-zinc-950/70 leading-relaxed max-w-md">
                                Heb je vragen over een product, je bestelling, of wil je gewoon hallo zeggen? Vul het formulier in en we nemen zo snel mogelijk contact met je op.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-zinc-950 mb-2">E-mail</h3>
                                <a href="mailto:info@cozymssls.nl" className="font-serif text-xl text-zinc-950/80 hover:text-zinc-950 transition-colors">
                                    info@cozymssls.nl
                                </a>
                            </div>

                            <div>
                                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-zinc-950 mb-2">Telefoon</h3>
                                <a href="tel:+31612345678" className="font-serif text-xl text-zinc-950/80 hover:text-zinc-950 transition-colors">
                                    +31 (0)6 12 34 56 78
                                </a>
                            </div>

                            <div className="pt-8 border-t border-zinc-950/10">
                                <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-zinc-950 mb-4">Bedrijfsgegevens</h3>
                                <ul className="space-y-2 font-sans text-sm text-zinc-950/70">
                                    <li><strong className="font-medium text-zinc-950">Cozy Mssls B.V.</strong></li>
                                    <li>Straatnaam 123</li>
                                    <li>1234 AB, Amsterdam</li>
                                    <li>Nederland</li>
                                    <li className="pt-2">KVK: 12345678</li>
                                    <li>BTW: NL123456789B01</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <div className="bg-white/50 backdrop-blur-md rounded-4xl p-8 md:p-12 shadow-sm border border-white/40">
                            {submitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="font-serif text-2xl text-zinc-950">Bericht verzonden</h3>
                                    <p className="font-sans text-zinc-950/70">
                                        Bedankt voor je bericht. We streven ernaar om binnen 24 uur te reageren.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 px-8 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-colors"
                                    >
                                        Nieuw bericht sturen
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-2">Voornaam</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                required
                                                className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-zinc-950 font-sans placeholder:text-zinc-950/30 outline-none transition-all"
                                                placeholder="Jan"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-2">Achternaam</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                required
                                                className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-zinc-950 font-sans placeholder:text-zinc-950/30 outline-none transition-all"
                                                placeholder="Jansen"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-2">E-mailadres</label>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-zinc-950 font-sans placeholder:text-zinc-950/30 outline-none transition-all"
                                            placeholder="jan@voorbeeld.nl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-2">Onderwerp</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            required
                                            className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-zinc-950 font-sans placeholder:text-zinc-950/30 outline-none transition-all"
                                            placeholder="Waar gaat het over?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-2">Bericht</label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            required
                                            className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 focus:ring-1 focus:ring-zinc-950 font-sans placeholder:text-zinc-950/30 outline-none transition-all resize-none"
                                            placeholder="Typ hier je bericht..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-4 bg-zinc-950 text-background-light rounded-2xl font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                                        >
                                            {submitting ? "Verzenden..." : "Verstuur Bericht"}
                                        </button>
                                    </div>
                                    <p className="text-center font-sans text-xs text-zinc-950/50">
                                        Door dit formulier te verzenden ga je akkoord met ons <Link href="/privacybeleid" className="underline hover:text-zinc-950">privacybeleid</Link>.
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
