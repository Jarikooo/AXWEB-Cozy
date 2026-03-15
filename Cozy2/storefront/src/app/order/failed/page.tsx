"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrderFailedPage() {
    const router = useRouter();
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light flex items-center justify-center">
            <div className="absolute top-12 left-6 md:left-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors font-sans text-sm font-medium animate-fade-in-up group"
                >
                    <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Terug
                </button>
            </div>
            <div className="max-w-2xl mx-auto text-center">

                <div className="w-24 h-24 bg-red-100 border border-[#18181b] flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined text-5xl text-red-600">warning</span>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <h1 className="text-4xl md:text-5xl text-zinc-950 font-extrabold tracking-tighter uppercase italic mb-6">
                        Betaling mislukt of geannuleerd
                    </h1>
                    <div className="bg-white p-8 border border-[#18181b] shadow-[4px_4px_0px_#18181b] mb-8 max-w-lg mx-auto">
                        <p className="font-sans text-zinc-950/80 leading-relaxed">
                            Er is helaas iets misgegaan tijdens het verwerken van je betaling, of je hebt de betaling geannuleerd.
                        </p>
                        <p className="font-sans text-zinc-950/80 leading-relaxed mt-4">
                            Wees gerust, er is <strong className="font-medium text-zinc-950">geen</strong> geld afgeschreven en je winkelmandje is bewaard gebleven. Je kunt het eenvoudig opnieuw proberen met dezelfde of een andere betaalmethode.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/checkout"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-zinc-950 hover:bg-primary/90"
                        >
                            Opnieuw Proberen
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 border border-zinc-950 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-mint-light"
                        >
                            Neem Contact Op
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
