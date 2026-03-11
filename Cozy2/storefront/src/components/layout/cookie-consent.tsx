"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consentStatus = localStorage.getItem("cozy_cookie_consent");
        if (!consentStatus) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cozy_cookie_consent", "accepted");
        setIsVisible(false);
        // Here you would normally trigger the initialization of tracking scripts (Google Analytics, etc.)
        // window.dataLayer = window.dataLayer || []; ...
    };

    const handleDecline = () => {
        localStorage.setItem("cozy_cookie_consent", "declined");
        setIsVisible(false);
        // Only functional cookies (like the Medusa Cart ID) will be used.
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 md:p-8 pointer-events-none">
            <div className="max-w-2xl mx-auto bg-background-light/95 backdrop-blur-xl border border-zinc-950/10 rounded-3xl p-6 sm:p-8 shadow-2xl pointer-events-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center animate-fade-in-up">

                <div className="flex-1 space-y-3">
                    <h3 className="font-serif text-2xl text-zinc-950 font-medium">Jouw privacy, jouw keuze.</h3>
                    <p className="font-sans text-sm text-zinc-950/70 leading-relaxed">
                        Wij gebruiken functionele cookies om de website goed te laten werken (bijvoorbeeld om te onthouden wat er in je mandje zit). Daarnaast willen we graag analytische cookies plaatsen om je winkelervaring te verbeteren. Meer weten? Lees ons <Link href="/privacybeleid" className="underline hover:text-zinc-950">Privacybeleid</Link>.
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
                    <button
                        onClick={handleAccept}
                        className="w-full sm:w-auto px-6 py-3 bg-zinc-950 text-background-light rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg hover:bg-black active:scale-[0.98]"
                    >
                        Accepteer Alles
                    </button>
                    <button
                        onClick={handleDecline}
                        className="w-full sm:w-auto px-6 py-3 bg-white/50 text-zinc-950 border border-zinc-950/10 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white active:scale-[0.98]"
                    >
                        Alleen Functioneel
                    </button>
                </div>

            </div>
        </div>
    );
}
