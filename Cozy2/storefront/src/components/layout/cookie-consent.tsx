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
            <div className="max-w-2xl mx-auto bg-white border border-[#18181b] shadow-[4px_4px_0px_#18181b] p-6 sm:p-8 pointer-events-auto flex flex-col sm:flex-row gap-6 items-start sm:items-center">

                <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-extrabold tracking-tighter uppercase italic text-[#18181b]">Jouw privacy, jouw keuze.</h3>
                    <p className="text-sm text-[#18181b]/70 leading-relaxed">
                        Wij gebruiken functionele cookies om de website goed te laten werken (bijvoorbeeld om te onthouden wat er in je mandje zit). Daarnaast willen we graag analytische cookies plaatsen om je winkelervaring te verbeteren. Meer weten? Lees ons <Link href="/privacybeleid" className="underline font-bold hover:text-primary transition-colors">Privacybeleid</Link>.
                    </p>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
                    <button
                        onClick={handleAccept}
                        className="w-full sm:w-auto px-6 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                    >
                        Accepteer Alles
                    </button>
                    <button
                        onClick={handleDecline}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-[#18181b] border border-[#18181b] font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_#18181b] hover:bg-[#ffe4e6] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                    >
                        Alleen Functioneel
                    </button>
                </div>

            </div>
        </div>
    );
}
