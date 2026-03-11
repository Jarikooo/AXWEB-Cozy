import React from "react";
import { getCustomer, logoutCustomer } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Heart, Package, LogOut, User as UserIcon } from "lucide-react";

export default async function AccountPage() {
    const customer = await getCustomer();

    if (!customer) {
        redirect("/account/login");
    }

    return (
        <div className="min-h-[100dvh] bg-[#f9fafb] text-zinc-950 font-sans p-4 md:p-8 flex flex-col pt-32 pb-32">

            <div className="max-w-6xl w-full mx-auto mb-16 border-b border-zinc-200 pb-8">
                <Link
                    href="/shop"
                    className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors font-sans text-sm font-medium animate-fade-in-up group w-fit mb-6"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Terug naar de winkel
                </Link>
                <div className="flex justify-between items-end">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-zinc-950 flex items-center gap-4">
                        Mijn Account
                    </h1>
                    <form action={logoutCustomer}>
                        <button
                            type="submit"
                            className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors flex items-center gap-2"
                        >
                            <LogOut size={16} /> Uitloggen
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm flex flex-col gap-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-950/5 flex items-center justify-center text-zinc-950">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <h2 className="font-serif italic text-2xl text-zinc-950 mb-1">
                            {customer.first_name} {customer.last_name}
                        </h2>
                        <p className="text-zinc-500 text-sm font-medium">{customer.email}</p>
                    </div>
                    <div className="pt-6 border-t border-zinc-100 mt-2">
                        <Link
                            href="/account/settings"
                            className="text-xs font-bold uppercase tracking-widest text-zinc-950 hover:text-primary transition-colors"
                        >
                            Bewerk Profiel
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Link href="/wishlist" className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                            <Heart size={24} className="fill-primary/20" />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-xl text-zinc-950 mb-2">Verlanglijst</h3>
                            <p className="text-zinc-500 text-sm">Bekijk je opgeslagen items die nu gesynchroniseerd zijn.</p>
                        </div>
                    </Link>

                    <Link href="/account/orders" className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-950/10 flex items-center justify-center text-zinc-950 mb-8 group-hover:scale-110 transition-transform">
                            <Package size={24} />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-xl text-zinc-950 mb-2">Bestellingen</h3>
                            <p className="text-zinc-500 text-sm">Volg de status van je recente aankopen.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
