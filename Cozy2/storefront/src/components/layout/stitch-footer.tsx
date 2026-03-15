"use client";

import Link from "next/link";

export function StitchFooter() {
    return (
        <footer className="bg-background-light border-t border-zinc-950 w-full pt-16 pb-8 px-4 md:px-12 flex flex-col mt-auto z-40 relative">
            <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

                {/* Brand & Mission */}
                <div className="md:col-span-2 flex flex-col items-start gap-4">
                    <Link href="/" className="inline-block">
                        <h2 className="text-zinc-950 text-3xl font-extrabold leading-tight tracking-tighter uppercase">
                            Cozy Mssls.
                        </h2>
                    </Link>
                    <p className="text-xs font-bold text-zinc-950/60 uppercase tracking-widest max-w-xs leading-relaxed">
                        Een vrolijke conceptstore vol echte blijmakers voor jouw thuis.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col items-start gap-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-950 mb-2">Ontdek</h3>
                    <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Alle Producten</Link>
                    <Link href="/wishlist" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Verlanglijst</Link>
                    <Link href="/account" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Mijn Account</Link>
                    <Link href="/over-ons" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Over Ons</Link>
                    <Link href="/contact" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Contact</Link>
                </div>

                {/* Legal & Info */}
                <div className="flex flex-col items-start gap-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-950 mb-2">Juridisch</h3>
                    <Link href="/veelgestelde-vragen" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Veelgestelde Vragen</Link>
                    <Link href="/privacybeleid" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Privacybeleid</Link>
                    <Link href="/algemene-voorwaarden" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Algemene Voorwaarden</Link>
                    <Link href="/retourbeleid" className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 hover:text-primary transition-colors">Retourbeleid</Link>
                </div>

            </div>

            <div className="w-full max-w-[1400px] mx-auto border-t border-zinc-950/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-950/40">
                    &copy; {new Date().getFullYear()} Cozy Mssls. Alle rechten voorbehouden.
                </p>
                <div className="flex items-center gap-6">
                    <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-zinc-950/40 hover:text-primary transition-colors">Instagram</a>
                    <a href="#" className="text-[10px] uppercase font-bold tracking-widest text-zinc-950/40 hover:text-primary transition-colors">Pinterest</a>
                </div>
            </div>
        </footer>
    );
}
