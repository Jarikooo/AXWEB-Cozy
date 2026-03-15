import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { firstName, lastName, email, subject, message } = body;

        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Alle velden zijn verplicht." },
                { status: 400 }
            );
        }

        if (typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json(
                { error: "Ongeldig e-mailadres." },
                { status: 400 }
            );
        }

        // Log the contact submission server-side
        console.log("[Contact] New submission:", {
            firstName,
            lastName,
            email,
            subject,
            message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
            timestamp: new Date().toISOString(),
        });

        // TODO: Integrate with email service (e.g. Resend, SendGrid, or Medusa notifications)
        // await sendEmail({ to: "info@cozymssls.nl", subject: `Contact: ${subject}`, ... });

        return NextResponse.json(
            { message: "Bericht succesvol verzonden." },
            { status: 200 }
        );
    } catch (error) {
        console.error("[Contact] Error:", error);
        return NextResponse.json(
            { error: "Er is iets misgegaan. Probeer het later opnieuw." },
            { status: 500 }
        );
    }
}
