"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginCustomer } from "@/app/actions/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await loginCustomer(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/account");
            // Hard refresh to update Navbar/Wishlist global state
            router.refresh();
        }
    };

    const [cartId, setCartId] = useState<string | null>(null);
    React.useEffect(() => { setCartId(localStorage.getItem("cart_id")); }, []);

    return (
        <div className="min-h-[100dvh] bg-[#f9fafb] text-zinc-950 font-sans p-4 md:p-8 flex flex-col justify-center items-center py-32 relative overflow-hidden">

            {/* Subtle background noise/texture */}
            <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noisy-texture.png")' }}></div>

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                <button
                    onClick={() => router.push('/shop')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-sans text-xs font-medium uppercase tracking-widest animate-fade-in-up group mb-12 self-start"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Terug naar de winkel
                </button>

                <div className="w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 animate-fade-in-up">
                    <div className="text-center mb-10">
                        <h1 className="font-serif italic text-4xl text-zinc-950 mb-3">Welkom terug</h1>
                        <p className="text-zinc-500 text-sm font-medium tracking-wide">
                            Log in om je verlanglijst en bestellingen te bekijken.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="p-4 bg-primary/10 text-primary rounded-xl text-sm font-medium border border-primary/20 text-center">
                                {error}
                            </div>
                        )}
                        {cartId && <input type="hidden" name="cartId" value={cartId} />}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-1">
                                E-mailadres
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium"
                                placeholder="jouw@email.nl"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950/70 ml-1">
                                    Wachtwoord
                                </label>
                                <span className="text-[10px] uppercase font-bold text-zinc-400 hover:text-primary cursor-pointer transition-colors">
                                    Vergeten?
                                </span>
                            </div>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full bg-white/50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-950 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-zinc-950 text-background-light rounded-2xl py-4 font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">{loading ? "Bezig met inloggen..." : "Inloggen"}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-zinc-500">
                            Nog geen account?{" "}
                            <Link href="/account/register" className="font-bold text-primary hover:underline underline-offset-4">
                                Maak er één aan
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
