import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmedPage() {
    return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-[#f9fafb] text-zinc-950 text-center relative overflow-hidden">

            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="bg-white/60 backdrop-blur-xl border border-white p-12 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] max-w-lg w-full flex flex-col items-center gap-6 relative z-10">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>

                <h1 className="font-serif text-4xl font-medium tracking-tight">Order Confirmed!</h1>
                <p className="text-zinc-500 font-sans leading-relaxed text-sm max-w-sm">
                    Thank you for shopping at Cozy Mssls. We've received your order and payment via Mollie. You'll receive a confirmation email shortly.
                </p>

                <Link href="/" className="mt-6 px-8 py-4 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-zinc-800 transition-all active:scale-95 shadow-md">
                    Return to Store
                </Link>
            </div>
        </div>
    );
}
