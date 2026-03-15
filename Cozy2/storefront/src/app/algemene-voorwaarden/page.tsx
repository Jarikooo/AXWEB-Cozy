"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function TermsAndConditionsPage() {
    const router = useRouter();
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light">
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors font-sans text-sm font-medium animate-fade-in-up group"
                >
                    <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Terug
                </button>
                <div className="text-center border-b border-zinc-950/10 pb-12 mb-12">
                    <h1 className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-950/60 mb-4">
                        Juridisch
                    </h1>
                    <h2 className="text-4xl md:text-5xl text-zinc-950 font-extrabold tracking-tighter uppercase italic">
                        Algemene Voorwaarden
                    </h2>
                    <p className="font-sans text-zinc-950/50 mt-4">Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL')}</p>
                </div>

                <div className="prose prose-lg prose-headings:font-display prose-headings:text-zinc-950 prose-headings:font-bold prose-p:font-sans prose-p:text-zinc-950/80 prose-li:font-sans prose-li:text-zinc-950/80 prose-a:text-zinc-950 prose-a:underline hover:prose-a:text-zinc-950/70 max-w-none">

                    <h3>Artikel 1 - Definities</h3>
                    <p>In deze algemene voorwaarden wordt verstaan onder:</p>
                    <ul>
                        <li><strong>Ondernemer:</strong> Cozy Mssls.</li>
                        <li><strong>Consument:</strong> de natuurlijke persoon die niet handelt in de uitoefening van een beroep of bedrijf en een overeenkomst op afstand aangaat met de ondernemer.</li>
                        <li><strong>Overeenkomst op afstand:</strong> een overeenkomst waarbij in het kader van een door de ondernemer georganiseerd systeem voor verkoop op afstand van producten, tot en met het sluiten van de overeenkomst uitsluitend gebruik wordt gemaakt van één of meer technieken voor communicatie op afstand.</li>
                        <li><strong>Bedenktijd:</strong> de termijn waarbinnen de consument gebruik kan maken van zijn herroepingsrecht (14 dagen).</li>
                    </ul>

                    <h3>Artikel 2 - Identiteit van de ondernemer</h3>
                    <p>
                        Cozy Mssls<br />
                        Straatnaam 123<br />
                        1234 AB, Maassluis<br />
                        Nederland<br /><br />
                        E-mailadres: info@cozymssls.nl<br />
                        Telefoonnummer: +31 (0)6 12 34 56 78<br />
                        KVK-nummer: 12345678<br />
                        Btw-identificatienummer: NL123456789B01
                    </p>

                    <h3>Artikel 3 - Toepasselijkheid</h3>
                    <p>
                        Deze algemene voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument. Voordat de overeenkomst op afstand wordt gesloten, wordt de tekst van deze algemene voorwaarden aan de consument beschikbaar gesteld.
                    </p>

                    <h3>Artikel 4 - Het aanbod</h3>
                    <p>
                        Indien een aanbod een beperkte geldigheidsduur heeft of onder voorwaarden geschiedt, wordt dit nadrukkelijk in het aanbod vermeld. Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten. De beschrijving is voldoende gedetailleerd om een goede beoordeling van het aanbod door de consument mogelijk te maken. Kennelijke vergissingen of kennelijke fouten in het aanbod binden de ondernemer niet.
                    </p>

                    <h3>Artikel 5 - De overeenkomst</h3>
                    <p>
                        De overeenkomst komt tot stand op het moment van aanvaarding door de consument van het aanbod en het voldoen aan de daarbij gestelde voorwaarden. Indien de consument het aanbod langs elektronische weg heeft aanvaard, bevestigt de ondernemer onverwijld langs elektronische weg de ontvangst van de aanvaarding van het aanbod.
                    </p>

                    <h3>Artikel 6 - Herroepingsrecht (Retourbeleid)</h3>
                    <p>
                        De consument kan een overeenkomst met betrekking tot de aankoop van een product gedurende een bedenktijd van 14 dagen zonder opgave van redenen ontbinden. De ondernemer mag de consument vragen naar de reden van herroeping, maar deze niet tot opgave van zijn reden(en) verplichten. De bedenktijd gaat in op de dag nadat de consument, of een vooraf door de consument aangewezen derde, die niet de vervoerder is, het product heeft ontvangen.
                        Zie voor meer informatie ons <a href="/retourbeleid">Retourbeleid</a>.
                    </p>

                    <h3>Artikel 7 - De prijs</h3>
                    <p>
                        Gedurende de in het aanbod vermelde geldigheidsduur worden de prijzen van de aangeboden producten niet verhoogd, behoudens prijswijzigingen als gevolg van veranderingen in btw-tarieven. De in het aanbod van producten genoemde prijzen zijn inclusief btw.
                    </p>

                    <h3>Artikel 8 - Levering en uitvoering</h3>
                    <p>
                        De ondernemer zal de grootst mogelijke zorgvuldigheid in acht nemen bij het in ontvangst nemen en bij de uitvoering van bestellingen van producten. Als plaats van levering geldt het adres dat de consument aan de ondernemer kenbaar heeft gemaakt. Geaccepteerde bestellingen zullen met bekwame spoed doch uiterlijk binnen 30 dagen worden uitgevoerd, tenzij een andere leveringstermijn is overeengekomen.
                    </p>

                    <h3>Artikel 9 - Betaling</h3>
                    <p>
                        Voor zover niet anders is overeengekomen, dienen de door de consument verschuldigde bedragen te worden voldaan voorafgaand aan de levering. Betalingen verlopen veilig via onze geregistreerde betaalprovider (Mollie).
                    </p>

                    <h3>Artikel 10 - Klachtenregeling</h3>
                    <p>
                        Klachten over de uitvoering van de overeenkomst moeten binnen bekwame tijd nadat de consument de gebreken heeft geconstateerd, volledig en duidelijk omschreven worden ingediend bij de ondernemer via info@cozymssls.nl. Bij de ondernemer ingediende klachten worden binnen een termijn van 14 dagen gerekend vanaf de datum van ontvangst beantwoord.
                    </p>

                    <p className="font-sans text-sm text-zinc-950/50 italic mt-8">
                        * Dit is een standaard concept ("boilerplate") Algemene Voorwaarden. Zorg dat je dit document controleert op juridische volledigheid voor jouw specifieke situatie.
                    </p>

                </div>
            </div>
        </main>
    );
}
