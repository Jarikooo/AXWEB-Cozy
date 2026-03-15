import Link from "next/link";

export default function OrderConfirmedPage() {
    return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-mint text-zinc-950 text-center relative overflow-hidden">

            <div className="bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] p-12 max-w-lg w-full flex flex-col items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-mint border border-[#18181b] flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined !text-[40px] text-[#18181b]">check_circle</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase italic">Bestelling Bevestigd!</h1>
                <p className="text-zinc-950/70 text-sm leading-relaxed max-w-sm">
                    Bedankt voor je bestelling bij Cozy Mssls. We hebben je betaling ontvangen. Je ontvangt binnenkort een bevestigingsmail.
                </p>

                <Link href="/" className="mt-6 px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-primary/90 hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all">
                    Terug naar de Winkel
                </Link>
            </div>
        </div>
    );
}
