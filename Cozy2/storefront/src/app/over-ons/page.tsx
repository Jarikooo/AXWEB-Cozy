"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ParallaxArtifacts } from "@/components/layout/parallax-artifacts";

export default function OverOnsPage() {
    const router = useRouter();
    return (
        <main className="w-full bg-[#F8F5F7] font-sans overflow-x-hidden relative">
            <ParallaxArtifacts />
            <div className="flex flex-col w-full mx-auto max-w-[1280px] relative bg-[#F8F5F7] z-10 shadow-[0_0_60px_rgba(0,0,0,0.02)]">
                <div className="flex flex-col w-full shrink-0 relative pt-24 pr-12 pb-32 pl-32 bg-[#E8F4F1]">
                    <div className="text-[96px] leading-[100%] tracking-[-0.04em] relative inline-block text-[#0F172A] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-black whitespace-pre-wrap">
                        Ons<br />verhaal.
                    </div>
                    <div className="text-[20px] mt-6 ml-32 max-w-md leading-[150%] inline-block text-[#F655A6] font-['Plus_Jakarta_Sans',system-ui,sans-serif] font-medium">
                        Veel liefs uit de boutique!
                    </div>
                </div>

                <div className="flex items-center justify-center w-full shrink-0 pr-12 pb-40 gap-24 relative bg-white">
                    <div className="relative w-[420px] h-[525px] shrink-0">
                        <div className="absolute top-[54px] bottom-[-54px] rounded-sm overflow-clip bg-cover bg-center min-h-px inset-x-0" style={{ backgroundImage: 'url(/images/c1.jpg)' }} />
                    </div>
                    <div className="flex flex-col w-[380px] h-[385px] gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-px bg-[#F655A6] shrink-0" />
                            <div className="text-[12px] tracking-[2px] uppercase inline-block text-[#F655A6] font-sans leading-4">
                                Ethos
                            </div>
                        </div>
                        <div className="text-[36px] leading-[110%] tracking-[-0.02em] inline-block text-[#0F172A] font-sans">
                            Van droom naar werkelijkheid!
                        </div>
                        <div className="text-[16px] leading-[160%] inline-block h-[284px] w-[483px] text-[#475569] font-sans whitespace-pre-wrap shrink-0">
                            <br /><br />In 2020 stopten we met dromen en zijn we gewoon gestart! Cozy Mssls is onze vrolijke conceptstore vol échte blijmakers. We selecteren alleen wat we zelf prachtig vinden: van Scandinavisch design tot Nederlandse pareltjes. Een plek waar je altijd iets bijzonders vindt voor jezelf of om weg te geven.<br /><br />
                        </div>
                        <div className="text-[16px] mt-4 inline-block text-[#F655A6] font-sans leading-5 cursor-pointer">
                            Ontdek de materialen →
                        </div>
                    </div>
                    <div className="absolute top-[43px] left-[156px] right-[652px] bottom-[62px] border border-solid border-[#F655A666] min-w-px min-h-px pointer-events-none" />
                </div>

                <div className="flex items-center justify-center w-full shrink-0 pb-40 pl-12 gap-24">
                    <div className="flex flex-col items-end w-[378px] gap-6 h-[348px] shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="text-[12px] tracking-[2px] uppercase inline-block text-right text-[#F655A6] font-sans leading-4">
                                Vakmanschap
                            </div>
                            <div className="w-8 h-px bg-[#F655A6] shrink-0" />
                        </div>
                        <div className="text-[36px] leading-[110%] tracking-[-0.02em] inline-block text-right text-[#0F172A] font-sans">
                            Met liefde voor je uitgezocht.
                        </div>
                        <div className="text-[16px] leading-[160%] inline-block text-right text-[#475569] font-sans whitespace-pre-wrap">
                            <br /><br />Het is elke dag een feestje om onze winkel te stylen en jou te adviseren. We houden van kwaliteit, duurzaamheid en een wisselend aanbod dat meebeweegt met de seizoenen. Heb je het perfecte cadeau gevonden? Dan pakken wij het met alle liefde voor je in. Tot snel in de winkel of 24/7 in onze webshop!<br /><br />
                        </div>
                    </div>
                    <div className="relative w-[420px] h-[420px] shrink-0">
                        <div className="absolute border border-solid border-[#F655A666] min-w-px min-h-px -inset-6" style={{ translate: '-16px -16px' }} />
                        <div className="absolute rounded-sm overflow-clip bg-cover bg-center inset-0" style={{ backgroundImage: 'url(/images/c2.webp)' }} />
                    </div>
                </div>
            </div>
        </main>
    );
}
