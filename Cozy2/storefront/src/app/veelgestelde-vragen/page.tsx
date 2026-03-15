"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Helper Component for Accordion Item
function FAQItem({ question, answer }: { question: string, answer: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-zinc-950/10">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg sm:text-xl text-zinc-950 font-bold group-hover:text-zinc-950/70 transition-colors">
                    {question}
                </span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <span className="material-symbols-outlined text-2xl text-zinc-950/50">expand_more</span>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
            >
                <div className="font-sans text-zinc-950/70 leading-relaxed pr-8">
                    {answer}
                </div>
            </div>
        </div>
    );
}

export default function FAQPage() {
    const router = useRouter();
    const faqs = [
        {
            category: "Bestellingen & Verzending",
            items: [
                {
                    question: "Wat is de levertijd van mijn bestelling?",
                    answer: "Voor bestellingen binnen Nederland streven wij ernaar om binnen 1-2 werkdagen te leveren. Bestel je voor 22:00 uur? Dan wordt je bestelling vaak dezelfde dag nog verzonden. Voor België geldt een levertijd van 2-3 werkdagen."
                },
                {
                    question: "Wat zijn de verzendkosten?",
                    answer: "Standaard verzending binnen Nederland en België is gratis voor bestellingen boven €50. Voor bestellingen onder dit bedrag rekenen wij een klein verzendtarief van €4,95."
                },
                {
                    question: "Kan ik mijn bestelling nog wijzigen of annuleren?",
                    answer: "Als je bestelling nog niet is verwerkt in ons magazijn, kunnen we deze mogelijk nog wijzigen of annuleren. Neem hiervoor zo snel mogelijk contact op met onze klantenservice via info@cozymssls.nl."
                }
            ]
        },
        {
            category: "Retourneren",
            items: [
                {
                    question: "Wat is jullie retourbeleid?",
                    answer: "Je hebt het recht om je bestelling binnen 14 dagen na ontvangst zonder opgave van redenen te annuleren en te retourneren. De geretourneerde producten dienen in originele staat en verpakking te zijn."
                },
                {
                    question: "Hoe stuur ik een artikel retour?",
                    answer: "Je kunt je retour aanmelden door een e-mail te sturen naar info@cozymssls.nl met je ordernummer. Wij sturen je vervolgens de retourinstructies. De kosten voor retourzending zijn voor eigen rekening."
                },
                {
                    question: "Wanneer krijg ik mijn aankoopbedrag terug?",
                    answer: "Zodra wij je retourzending hebben ontvangen en geïnspecteerd, storten wij het aankoopbedrag doorgaans binnen 5 werkdagen terug op de oorspronkelijke betaalmethode."
                }
            ]
        },
        {
            category: "Producten",
            items: [
                {
                    question: "Zijn jullie producten duurzaam?",
                    answer: "Waar mogelijk werken wij met duurzame en milieuvriendelijke materialen. We hechten veel waarde aan kwaliteit en levensduur, zodat je zo lang mogelijk van je aankoop kunt genieten."
                },
                {
                    question: "Ik heb een klacht over een product, wat nu?",
                    answer: "Dat vinden we erg vervelend om te horen. Neem alstublieft contact op met onze klantenservice met een beschrijving en foto('s) van het probleem. We zoeken dan samen naar een passende oplossing."
                }
            ]
        }
    ];

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors font-sans text-sm font-medium mb-12 animate-fade-in-up group"
                >
                    <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Terug
                </button>
                <div className="text-center mb-16">
                    <h1 className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/60 mb-4">
                        Hulp Nodig?
                    </h1>
                    <h2 className="text-4xl md:text-6xl text-zinc-950 font-extrabold tracking-tighter uppercase italic mb-6">
                        Veelgestelde Vragen
                    </h2>
                    <p className="font-sans text-zinc-950/70 max-w-lg mx-auto">
                        Vind hier snel antwoorden op de meest gestelde vragen. Staat je vraag er niet tussen? Neem dan gerust contact met ons op.
                    </p>
                </div>

                <div className="space-y-16 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    {faqs.map((section, index) => (
                        <div key={index} className="bg-white p-8 md:p-12 border border-[#18181b] shadow-[4px_4px_0px_#18181b]">
                            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/50 mb-6">
                                {section.category}
                            </h3>
                            <div className="border-t border-zinc-950/10">
                                {section.items.map((item, idx) => (
                                    <FAQItem key={idx} question={item.question} answer={item.answer} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <p className="text-xl text-zinc-950 font-extrabold uppercase tracking-tighter italic mb-6">Niet gevonden wat je zocht?</p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all"
                    >
                        Neem Contact Op
                    </a>
                </div>
            </div>
        </main>
    );
}
