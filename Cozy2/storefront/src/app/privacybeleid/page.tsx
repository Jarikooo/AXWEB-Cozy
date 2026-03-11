"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function PrivacyPolicyPage() {
    const router = useRouter();
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light">
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors font-sans text-sm font-medium animate-fade-in-up group"
                >
                    <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Terug
                </button>
                <div className="text-center border-b border-zinc-950/10 pb-12 mb-12">
                    <h1 className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/60 mb-4">
                        Juridisch
                    </h1>
                    <h2 className="font-serif text-4xl md:text-5xl text-zinc-950 font-medium tracking-tight">
                        Privacybeleid
                    </h2>
                    <p className="font-sans text-zinc-950/50 mt-4">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
                </div>

                <div className="prose prose-lg prose-headings:font-serif prose-headings:text-zinc-950 prose-headings:font-medium prose-p:font-sans prose-p:text-zinc-950/80 prose-li:font-sans prose-li:text-zinc-950/80 prose-a:text-zinc-950 prose-a:underline hover:prose-a:text-zinc-950/70 max-w-none">

                    <h3>1. Inleiding</h3>
                    <p>
                        Bij Cozy Mssls nemen we uw privacy serieus. In dit privacybeleid leggen we uit welke persoonsgegevens we verzamelen, waarom we deze verzamelen en hoe we hiermee omgaan. Dit beleid is van toepassing op al onze diensten en op het gebruik van onze website.
                    </p>

                    <h3>2. Welke gegevens verzamelen wij?</h3>
                    <p>Wanneer u gebruik maakt van onze webshop, kunnen wij de volgende gegevens verzamelen:</p>
                    <ul>
                        <li><strong>Contactgegevens:</strong> Naam, e-mailadres, telefoonnummer.</li>
                        <li><strong>Adresgegevens:</strong> Factuur- en afleveradres (vereist voor levering).</li>
                        <li><strong>Betaalgegevens:</strong> Wij verwerken uw betaling via een beveiligde externe betaalprovider (Mollie). Wij slaan zelf geen creditcard- of bankgegevens op.</li>
                        <li><strong>Bestelgeschiedenis:</strong> Informatie over de producten die u heeft gekocht.</li>
                        <li><strong>Technische gegevens:</strong> IP-adres, browsertype en apparaatinformatie via functionele cookies.</li>
                    </ul>

                    <h3>3. Waarom verzamelen wij deze gegevens?</h3>
                    <p>Wij gebruiken uw gegevens voor de volgende doeleinden:</p>
                    <ul>
                        <li>Het verwerken en verzenden van uw geplaatste bestellingen.</li>
                        <li>Het afhandelen van uw betaling.</li>
                        <li>Klantenservice en het beantwoorden van uw vragen.</li>
                        <li>Het sturen van belangrijke updates over uw bestelling (bijv. verzendbevestiging).</li>
                        <li>Het naleven van wettelijke verplichtingen (zoals administratie voor de Belastingdienst).</li>
                    </ul>

                    <h3>4. Hoe lang bewaren we uw gegevens?</h3>
                    <p>
                        Wij bewaren uw persoonsgegevens niet langer dan strikt nodig is om de doelen te realiseren waarvoor uw gegevens worden verzameld. Gegevens met betrekking tot uw aankoop bewaren wij 7 jaar in verband met de wettelijke administratieplicht.
                    </p>

                    <h3>5. Gegevens delen met derden</h3>
                    <p>
                        Wij verkopen uw gegevens niet aan derden en verstrekken deze uitsluitend indien dit nodig is voor de uitvoering van onze overeenkomst met u of om te voldoen aan een wettelijke verplichting. Hieronder vallen bijvoorbeeld onze betaalprovider (Mollie), verzendpartners en IT-dienstverleners.
                    </p>

                    <h3>6. Cookies</h3>
                    <p>
                        Wij maken gebruik van cookies om de website goed te laten functioneren en het gebruiksgemak te vergroten. Voordat wij niet-functionele cookies (zoals analytische of tracking cookies) plaatsen, vragen wij altijd eerst om uw expliciete toestemming via onze cookiebanner.
                    </p>

                    <h3>7. Uw rechten</h3>
                    <p>
                        U heeft het recht om uw persoonsgegevens in te zien, te corrigeren of te verwijderen. Daarnaast heeft u het recht om uw eventuele toestemming voor de gegevensverwerking in te trekken of bezwaar te maken tegen de verwerking van uw persoonsgegevens door Cozy Mssls.
                    </p>
                    <p>
                        Wilt u gebruik maken van een van deze rechten? Stuur dan een e-mail naar <a href="mailto:info@cozymssls.nl">info@cozymssls.nl</a>.
                    </p>

                    <h3>8. Contactgegevens</h3>
                    <p>
                        Cozy Mssls<br />
                        Straatnaam 123<br />
                        1234 AB, Amsterdam<br />
                        Nederland<br />
                        KVK: 12345678<br />
                        E-mail: <a href="mailto:info@cozymssls.nl">info@cozymssls.nl</a>
                    </p>

                </div>
            </div>
        </main>
    );
}
