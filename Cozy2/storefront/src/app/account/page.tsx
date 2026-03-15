import React from "react";
import { getCustomer, logoutCustomer } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
    const customer = await getCustomer();

    if (!customer) {
        redirect("/account/login");
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="w-full border-b border-[#18181b] bg-mint">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-10 md:pb-14">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-950/40 mb-3">Mijn Account</p>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter uppercase italic text-zinc-950 leading-[0.9]">
                                Hallo, {customer.first_name}.
                            </h1>
                        </div>
                        <form action={logoutCustomer}>
                            <button
                                type="submit"
                                className="text-[10px] font-bold uppercase tracking-widest text-zinc-950/40 hover:text-zinc-950 transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined !text-[16px]">logout</span>
                                Uitloggen
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-16 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Profile Card */}
                    <div className="bg-white p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)] flex flex-col gap-6">
                        <div className="size-16 bg-mint border border-[#18181b] flex items-center justify-center">
                            <span className="material-symbols-outlined !text-[24px] text-[#18181b]">person</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-950 uppercase tracking-tight mb-1">
                                {customer.first_name} {customer.last_name}
                            </h2>
                            <p className="text-sm text-zinc-950/50">{customer.email}</p>
                        </div>
                        <div className="pt-6 border-t border-[#18181b] mt-auto">
                            <Link
                                href="/account/settings"
                                className="text-xs font-bold uppercase tracking-widest text-zinc-950 hover:text-primary transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined !text-[14px]">edit</span>
                                Bewerk Profiel
                            </Link>
                        </div>
                    </div>

                    {/* Wishlist Card */}
                    <Link href="/wishlist" className="group bg-white p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)] hover:shadow-[6px_6px_0px_rgba(9,9,11,0.08)] hover:-translate-y-[2px] transition-all flex flex-col justify-between">
                        <div className="size-12 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center mb-8 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                            <span className="material-symbols-outlined !text-[20px] text-[#18181b]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">Verlanglijst</h3>
                            <p className="text-sm text-zinc-950/50">Bekijk je opgeslagen favorieten.</p>
                        </div>
                    </Link>

                    {/* Orders Card */}
                    <Link href="/account/orders" className="group bg-white p-8 border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)] hover:shadow-[6px_6px_0px_rgba(9,9,11,0.08)] hover:-translate-y-[2px] transition-all flex flex-col justify-between">
                        <div className="size-12 bg-mint border border-[#18181b] flex items-center justify-center mb-8 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                            <span className="material-symbols-outlined !text-[20px] text-[#18181b]">package_2</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors">Bestellingen</h3>
                            <p className="text-sm text-zinc-950/50">Volg de status van je aankopen.</p>
                        </div>
                    </Link>
                </div>

                {/* Collection Nudge */}
                <div className="mt-12 bg-mint border border-[#18181b] p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-950/40 mb-2">Nieuw Binnen</p>
                        <p className="text-lg md:text-xl font-extrabold tracking-tighter text-zinc-950">
                            Sharon heeft weer pareltjes gevonden.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="shrink-0 px-8 py-4 bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all flex items-center gap-2"
                    >
                        Bekijk de Collectie
                        <span className="material-symbols-outlined !text-[14px]">arrow_forward</span>
                    </Link>
                </div>

                {/* Support Links */}
                <div className="mt-8 pt-8 border-t border-[#18181b]/10 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-zinc-950/30 hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined !text-[14px]">help</span>
                        Hulp nodig?
                    </Link>
                    <Link href="/retourbeleid" className="text-xs font-bold uppercase tracking-widest text-zinc-950/30 hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined !text-[14px]">undo</span>
                        Retourneren
                    </Link>
                    <Link href="/veelgestelde-vragen" className="text-xs font-bold uppercase tracking-widest text-zinc-950/30 hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined !text-[14px]">quiz</span>
                        Veelgestelde vragen
                    </Link>
                </div>
            </div>
        </div>
    );
}
