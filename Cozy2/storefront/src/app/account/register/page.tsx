"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerCustomer } from "@/app/actions/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        if (formData.get("password") !== formData.get("confirmPassword")) {
            setError("Wachtwoorden komen niet overeen.");
            setLoading(false);
            return;
        }

        const result = await registerCustomer(formData);

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
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-screen">
                {/* Left: Register Form */}
                <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-28 md:pt-16 pb-16">
                    <div className="max-w-md w-full mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase italic text-zinc-950 leading-[0.9] mb-3">
                            Word lid<br />van de Club.
                        </h1>
                        <p className="text-sm text-zinc-950/60 mb-10">
                            Maak een account en ontvang 10% korting op je eerste bestelling.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {error && (
                                <div className="p-4 bg-[#ffe4e6] text-zinc-950 border border-[#18181b] text-sm font-bold">
                                    {error}
                                </div>
                            )}

                            {cartId && <input type="hidden" name="cartId" value={cartId} />}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                                        Voornaam
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        className="w-full bg-white border border-[#18181b] px-5 py-4 text-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                                        Achternaam
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        className="w-full bg-white border border-[#18181b] px-5 py-4 text-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                    />
                                </div>
                            </div>

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
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                                    Wachtwoord
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    className="w-full bg-white border border-[#18181b] px-5 py-4 text-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                    placeholder="Minimaal 8 tekens"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-950">
                                    Bevestig Wachtwoord
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                    className="w-full bg-white border border-[#18181b] px-5 py-4 text-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-950/30"
                                    placeholder="Herhaal je wachtwoord"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-primary text-white py-5 text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                {loading ? "Bezig..." : "Account Aanmaken"}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-[#18181b]">
                            <p className="text-sm text-zinc-950/60">
                                Heb je al een account?{" "}
                                <Link href="/account/login" className="font-bold text-primary hover:underline underline-offset-4">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Promo Panel */}
                <div className="hidden md:flex flex-col justify-between bg-[#ffe4e6] border-l border-[#18181b] px-12 pb-12 pt-32 lg:px-16 lg:pb-16 lg:pt-36">
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tighter uppercase italic text-zinc-950 leading-[0.95] mb-6">
                            10% Korting<br />op je eerste<br />bestelling.
                        </h2>
                        <p className="text-sm text-zinc-950/60 leading-relaxed max-w-sm">
                            Als dankjewel voor het aanmelden ontvang je direct 10% korting. Sharon selecteert elke maand nieuwe favorieten speciaal voor jou.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-white border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">redeem</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-1">Welkomstkorting</h4>
                                <p className="text-xs text-zinc-950/50">10% op je eerste bestelling, automatisch.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-white border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">mail</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-1">Exclusieve Updates</h4>
                                <p className="text-xs text-zinc-950/50">Als eerste toegang tot nieuwe drops.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="size-10 bg-white border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                <span className="material-symbols-outlined !text-[18px] text-[#18181b]">sync</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-950 mb-1">Verlanglijst Sync</h4>
                                <p className="text-xs text-zinc-950/50">Je favorieten altijd overal beschikbaar.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
