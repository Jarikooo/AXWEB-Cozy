"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function OverOnsPage() {
    const mainRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!mainRef.current) return;

        // Hero text stagger
        gsap.from("[data-hero-text]", {
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.15,
        });

        // Scroll-triggered sections
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
            gsap.from(el, {
                y: 40,
                opacity: 0,
                duration: 0.7,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });
        });

        // Parallax images
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            gsap.to(el, {
                y: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        });
    }, { scope: mainRef });

    return (
        <main ref={mainRef} className="w-full bg-white overflow-x-hidden">
            {/* ── Hero Section ── */}
            <section className="w-full bg-mint border-b border-[#18181b]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-16 md:pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end">
                        <div>
                            <p data-hero-text className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40 mb-4">Over Ons</p>
                            <h1 data-hero-text className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.9]">
                                Ons<br />Verhaal.
                            </h1>
                        </div>
                        <div data-hero-text className="md:pb-2">
                            <p className="text-lg md:text-xl text-[#18181b]/70 leading-relaxed max-w-md">
                                Veel liefs uit de boutique! Een vrolijke conceptstore vol <span className="font-extrabold text-primary italic">échte blijmakers</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Story Section 1: Van Droom naar Werkelijkheid ── */}
            <section className="w-full bg-white border-b border-[#18181b]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
                        {/* Image */}
                        <div data-reveal data-parallax className="relative">
                            <div className="relative aspect-[4/5] w-full border border-[#18181b] shadow-[8px_8px_0px_#18181b] overflow-hidden">
                                <Image
                                    src="/images/c1.jpg"
                                    alt="Cozy Maassluis winkel interieur"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            {/* Decorative tag */}
                            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-primary text-white px-5 py-3 border border-[#18181b] shadow-[4px_4px_0px_#18181b] z-10">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Sinds 2020</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div data-reveal className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-[#ffe4e6] border border-[#18181b] flex items-center justify-center shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                    <span className="material-symbols-outlined !text-[18px] text-[#18181b]">auto_awesome</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40">Ethos</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.95]">
                                Van droom<br />naar werkelijkheid.
                            </h2>
                            <p className="text-sm md:text-base text-[#18181b]/60 leading-relaxed max-w-lg">
                                In 2020 stopten we met dromen en zijn we gewoon gestart! Cozy Mssls is onze vrolijke conceptstore vol échte blijmakers. We selecteren alleen wat we zelf prachtig vinden: van Scandinavisch design tot Nederlandse pareltjes.
                            </p>
                            <p className="text-sm md:text-base text-[#18181b]/60 leading-relaxed max-w-lg">
                                Een plek waar je altijd iets bijzonders vindt voor jezelf of om weg te geven.
                            </p>
                            <Link
                                href="/shop"
                                className="mt-2 w-fit flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-[#18181b] transition-colors group"
                            >
                                Ontdek de collectie
                                <span className="material-symbols-outlined !text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values Strip ── */}
            <section className="w-full bg-[#ffe4e6] border-b border-[#18181b]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
                    <div data-reveal className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
                        {[
                            { icon: "favorite", title: "Met Liefde", desc: "Elk product is door Sharon persoonlijk uitgezocht." },
                            { icon: "eco", title: "Duurzaam", desc: "Kwaliteit boven kwantiteit, altijd." },
                            { icon: "redeem", title: "Cadeautje?", desc: "Wij pakken het met alle liefde voor je in." },
                        ].map((v) => (
                            <div key={v.title} className="flex items-start gap-4 p-6 bg-white border border-[#18181b] shadow-[4px_4px_0px_rgba(9,9,11,0.05)]">
                                <div className="size-12 bg-mint border border-[#18181b] flex items-center justify-center shrink-0 shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                    <span className="material-symbols-outlined !text-[20px] text-[#18181b]" style={v.icon === "favorite" ? { fontVariationSettings: "'FILL' 1" } : undefined}>{v.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#18181b] mb-1">{v.title}</h3>
                                    <p className="text-xs text-[#18181b]/50 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Story Section 2: Vakmanschap ── */}
            <section className="w-full bg-white border-b border-[#18181b]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-28">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
                        {/* Content (left on desktop) */}
                        <div data-reveal className="flex flex-col gap-6 order-2 md:order-1">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-mint border border-[#18181b] flex items-center justify-center shadow-[3px_3px_0px_rgba(9,9,11,0.05)]">
                                    <span className="material-symbols-outlined !text-[18px] text-[#18181b]">workspace_premium</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#18181b]/40">Vakmanschap</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.95]">
                                Met liefde<br />voor je uitgezocht.
                            </h2>
                            <p className="text-sm md:text-base text-[#18181b]/60 leading-relaxed max-w-lg">
                                Het is elke dag een feestje om onze winkel te stylen en jou te adviseren. We houden van kwaliteit, duurzaamheid en een wisselend aanbod dat meebeweegt met de seizoenen.
                            </p>
                            <p className="text-sm md:text-base text-[#18181b]/60 leading-relaxed max-w-lg">
                                Heb je het perfecte cadeau gevonden? Dan pakken wij het met alle liefde voor je in. Tot snel in de winkel of 24/7 in onze webshop!
                            </p>
                            <Link
                                href="/contact"
                                className="mt-2 w-fit flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-[#18181b] transition-colors group"
                            >
                                Neem contact op
                                <span className="material-symbols-outlined !text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Image */}
                        <div data-reveal data-parallax className="relative order-1 md:order-2">
                            <div className="relative aspect-square w-full border border-[#18181b] shadow-[8px_8px_0px_#18181b] overflow-hidden">
                                <Image
                                    src="/images/c2.webp"
                                    alt="Cozy Maassluis producten"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            {/* Decorative tag */}
                            <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 bg-white text-[#18181b] px-5 py-3 border border-[#18181b] shadow-[4px_4px_0px_#18181b] z-10">
                                <span className="text-[10px] font-bold uppercase tracking-widest">Maassluis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="w-full bg-mint">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                    <div data-reveal className="bg-[#ffe4e6] border border-[#18181b] p-8 md:p-16 shadow-[4px_4px_0px_rgba(9,9,11,0.05)] flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="max-w-lg">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter uppercase italic text-[#18181b] leading-[0.95] mb-4">
                                Kom langs<br />of shop online.
                            </h2>
                            <p className="text-sm text-[#18181b]/60 leading-relaxed">
                                Onze winkel in Maassluis staat altijd voor je open. Liever vanuit de bank? Onze webshop is 24/7 beschikbaar met dezelfde persoonlijke touch.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                            <Link
                                href="/shop"
                                className="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center"
                            >
                                Ontdek de Shop
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-white text-[#18181b] font-bold uppercase tracking-widest text-xs border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:bg-mint-light hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all text-center"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
