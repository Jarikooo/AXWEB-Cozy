"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
    const router = useRouter();
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light flex items-center justify-center">
            <div className="absolute top-12 left-6 md:left-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors font-sans text-sm font-medium animate-fade-in-up group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Terug
                </button>
            </div>
            <div className="max-w-4xl mx-auto text-center">

                <div className="relative w-64 h-64 mx-auto mb-12 animate-fade-in-up">
                    <Image
                        src="https://images.unsplash.com/photo-1596484552834-6a848a604f5e?q=80&w=2664&auto=format&fit=crop"
                        alt="Broken Vase"
                        fill
                        className="object-cover rounded-full mix-blend-multiply opacity-80"
                        priority
                    />
                </div>

                <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <h1 className="font-serif text-6xl md:text-8xl text-zinc-950 font-medium tracking-tight mb-4">
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
                            className="w-full sm:w-auto px-8 py-4 bg-zinc-950 text-background-light rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:bg-black"
                        >
                            Verder Winkelen
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-white/50 backdrop-blur-sm text-zinc-950 border border-zinc-950/10 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white"
                        >
                            Terug naar Home
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}
