import React from "react";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light flex items-center justify-center">
            <div className="max-w-4xl mx-auto text-center">
                <div className="w-40 h-40 mx-auto mb-12 bg-mint border border-[#18181b] shadow-[6px_6px_0px_#18181b] flex items-center justify-center">
                    <span className="material-symbols-outlined !text-[64px] text-[#18181b]/30">search_off</span>
                </div>

                <h1 className="text-6xl md:text-8xl text-zinc-950 font-extrabold tracking-tighter uppercase italic mb-4">
                    404
                </h1>
                <h2 className="text-xl md:text-2xl text-zinc-950/80 font-extrabold tracking-tighter uppercase italic mb-8">
                    Oeps! Deze pagina lijkt niet te bestaan.
                </h2>
                <p className="text-sm text-zinc-950/60 max-w-md mx-auto mb-12 leading-relaxed">
                    De pagina die je zoekt is mogelijk verplaatst, hernoemd of bestaat niet meer. Laten we je terug in de goede richting sturen.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        href="/shop"
                        className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center"
                    >
                        Verder Winkelen
                    </Link>
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-950 border border-[#18181b] text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center"
                    >
                        Terug naar Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
