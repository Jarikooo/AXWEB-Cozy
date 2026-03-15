"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
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
            <div className="max-w-4xl mx-auto text-center">

                <div className="relative w-64 h-64 mx-auto mb-12 animate-fade-in-up">
                    <Image
                        src="https://images.unsplash.com/photo-1596484552834-6a848a604f5e?q=80&w=2664&auto=format&fit=crop"
                        alt="Broken Vase"
                        fill
                        className="object-cover mix-blend-multiply opacity-80"
                        priority
                    />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <h1 className="text-6xl md:text-8xl text-zinc-950 font-extrabold tracking-tighter uppercase italic mb-4">
                        404
                    </h1>
                    <h2 className="font-sans text-xl md:text-2xl text-zinc-950/80 font-light mb-8">
                        Oeps! Deze pagina lijkt niet te bestaan.
                    </h2>
                    <p className="font-sans text-zinc-950/60 max-w-md mx-auto mb-12">
                        De pagina die je zoekt is mogelijk verplaatst, hernoemd of bestaat niet meer. Laten we je terug in de goede richting sturen.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/shop"
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                        >
                            Verder Winkelen
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 border border-[#18181b] text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                        >
                            Terug naar Home
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
