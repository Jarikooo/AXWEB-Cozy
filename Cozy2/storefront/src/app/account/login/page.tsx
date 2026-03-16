"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginCustomer } from "@/app/actions/auth";

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
            router.refresh();
        }
    };

    const [cartId, setCartId] = useState<string | null>(null);
    React.useEffect(() => { setCartId(localStorage.getItem("cart_id")); }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Split layout: form left, promo right */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-screen">
                {/* Left: Login Form */}
                <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-28 md:pt-16 pb-16">
                    <div className="max-w-md w-full mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase italic text-zinc-950 leading-[0.9] mb-3">
                            Welkom<br />Terug.
                        </h1>
                        <p className="text-sm text-zinc-950/60 mb-10">
                            Log in om je verlanglijst en bestellingen te bekijken.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {error && (
                                <div className="p-4 bg-[#ffe4e6] text-zinc-950 border border-[#18181b] text-sm font-bold">
                                    {error}
                                </div>
                            )}
                            {cartId && <input type="hidden" name="cartId" value={cartId} />}

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                                    E-mailadres
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full bg-white border border-[#18181b] px-5 py-4 text-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                    placeholder="jouw@email.nl"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                                        Wachtwoord
                                    </label>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full bg-white border border-[#18181b] px-5 py-4 text-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-zinc-950 text-white py-5 text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? "Bezig met inloggen..." : "Inloggen"}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-[#18181b]">
                            <p className="text-sm text-zinc-950/60">
                                Nog geen account?{" "}
                                <Link href="/account/register" className="font-bold text-primary hover:underline underline-offset-4">
                                    Maak er één aan
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Promo Panel */}
                <div className="hidden md:flex flex-col justify-between bg-mint border-l border-[#18181b] p-12 lg:p-16">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tighter uppercase italic text-zinc-950 leading-[0.95] mb-6">
                            Jouw persoonlijke<br />Cozy ruimte.
                        </h2>
                        <p className="text-sm text-zinc-950/60 leading-relaxed max-w-sm">
                            Met een account bewaar je je favorieten, volg je je bestellingen en ontvang je als eerste exclusieve aanbiedingen.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-white border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">favorite</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-1">Verlanglijst</h4>
                                <p className="text-xs text-zinc-950/50">Bewaar producten en synchroniseer overal.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-white border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">local_shipping</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-1">Gratis Verzending</h4>
                                <p className="text-xs text-zinc-950/50">Vanaf €150 altijd gratis thuisbezorgd.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-white border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">verified</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-1">30 Dagen Bedenktijd</h4>
                                <p className="text-xs text-zinc-950/50">Niet tevreden? Retourneer eenvoudig.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
