import React from "react";
import Link from "next/link";

export default function ReturnPolicyPage() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background-light">
            <div className="max-w-4xl mx-auto space-y-12">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-zinc-950/60 hover:text-zinc-950 transition-colors text-sm font-bold uppercase tracking-widest group"
                >
                    <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Terug
                </Link>
                <div className="text-center border-b border-zinc-950/10 pb-12 mb-12">
                    <h1 className="text-xs font-bold uppercase tracking-widest text-zinc-950/60 mb-4">
                        Klantenservice
                    </h1>
                    <h2 className="text-4xl md:text-5xl text-zinc-950 font-extrabold tracking-tighter uppercase italic">
                        Retourbeleid
                    </h2>
                </div>

                <div className="prose prose-lg prose-headings:text-zinc-950 prose-headings:font-bold prose-p:text-zinc-950/80 prose-li:text-zinc-950/80 prose-a:text-zinc-950 prose-a:underline hover:prose-a:text-zinc-950/70 max-w-none">

                    <h3>14 Dagen Bedenktijd (Herroepingsrecht)</h3>
                    <p>
                        Je hebt het recht om je bestelling tot 14 dagen na ontvangst zonder opgave van redenen te annuleren. Na annulering heb je nogmaals 14 dagen om je product retour te sturen.
                    </p>
                    <p>
                        Je krijgt dan het volledige orderbedrag inclusief de originele verzendkosten gecrediteerd. Enkel de kosten voor retour van jouw thuis naar de webwinkel zijn voor eigen rekening.
                    </p>

                    <h3>Voorwaarden voor retourneren</h3>
                    <p>Om in aanmerking te komen voor een retourzending, moet het product aan de volgende voorwaarden voldoen:</p>
                    <ul>
                        <li>Het artikel dient onbeschadigd te zijn en geen gebruikssporen te vertonen.</li>
                        <li>Het artikel dient, indien redelijkerwijs mogelijk, in de originele verpakking geretourneerd te worden.</li>
                        <li>Eventueel meegeleverde accessoires dienen ook geretourneerd te worden.</li>
                    </ul>
                    <p>
                        Indien je gebruik maakt van je herroepingsrecht, zal het product met alle geleverde toebehoren en in de originele staat en verpakking aan de ondernemer geretourneerd worden. Wijze waarop je het wil retourneren is jouw verantwoordelijkheid (wij raden altijd aan om te verzenden inclusief Track &amp; Trace).
                    </p>

                    <h3>Hoe meld ik een retour aan?</h3>
                    <p>Volg deze stappen om je retourzending soepel te laten verlopen:</p>
                    <ol>
                        <li>Stuur een e-mail naar <strong>info@cozymssls.nl</strong> om je retour aan te kondigen. Vermeld hierin duidelijk je ordernummer en (optioneel, maar gewaardeerd) de reden van retour.</li>
                        <li>Wij sturen je vervolgens de retourinstructies en het adres waar je het pakket naartoe kunt sturen.</li>
                        <li>Verpak het product zorgvuldig in een stevige doos (bij voorkeur de originele verpakking).</li>
                        <li>Geef het pakket af bij een pakketpunt en bewaar je verzendbewijs goed.</li>
                    </ol>

                    <h3>Terugbetaling</h3>
                    <p>
                        Wij zullen het verschuldigde orderbedrag binnen 14 dagen na aanmelding van je retour terugstorten mits het product reeds in goede orde retour ontvangen is. De terugbetaling vindt plaats via de oorspronkelijke betaalmethode (Mollie).
                    </p>

                    <h3>Uitzonderingen</h3>
                    <p>Sommige producten kunnen niet worden geretourneerd, waaronder:</p>
                    <ul>
                        <li>Producten die om redenen van gezondheidsbescherming of hygiëne niet geschikt zijn om te worden geretourneerd en waarvan de verzegeling na levering is verbroken (zoals beddengoed, kussens of handdoeken, mits geopend/gebruikt).</li>
                        <li>Gepersonaliseerde of op maat gemaakte artikelen.</li>
                    </ul>

                    <div className="mt-12 p-8 bg-mint border border-[#18181b] shadow-[4px_4px_0px_#18181b] text-center not-prose">
                        <h4 className="text-2xl text-zinc-950 font-extrabold uppercase tracking-tighter italic">Heb je vragen over je retour?</h4>
                        <p className="text-zinc-950/70 text-sm mb-6 mt-2">Ons klantenserviceteam staat klaar om je te helpen.</p>
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest border border-[#18181b] shadow-[4px_4px_0px_#18181b] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[6px_6px_0px_#18181b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#18181b] transition-all no-underline"
                        >
                            Neem Contact Op
                        </Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
