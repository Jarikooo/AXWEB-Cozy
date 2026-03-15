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

                <div className="w-24 h-24 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center mx-auto mb-8">
                    <span className="material-symbols-outlined !text-[48px] text-[#18181b]">warning</span>
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <h1 className="text-4xl md:text-5xl text-zinc-950 font-extrabold tracking-tighter uppercase italic mb-6">
                        Betaling mislukt of geannuleerd
                    </h1>
                    <div className="bg-white p-8 border border-[#18181b] shadow-[4px_4px_0px_#18181b] mb-8 max-w-lg mx-auto">
                        <p className="text-sm text-zinc-950/80 leading-relaxed">
                            Er is helaas iets misgegaan tijdens het verwerken van je betaling, of je hebt de betaling geannuleerd.
                        </p>
                        <p className="text-sm text-zinc-950/80 leading-relaxed mt-4">
                            Wees gerust, er is <strong className="font-bold text-zinc-950">geen</strong> geld afgeschreven en je winkelmandje is bewaard gebleven. Je kunt het eenvoudig opnieuw proberen met dezelfde of een andere betaalmethode.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/checkout"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                        >
                            Opnieuw Proberen
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 border border-[#18181b] text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                        >
                            Neem Contact Op
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
