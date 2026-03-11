import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.email || typeof body.email !== 'string') {
            return NextResponse.json(
                { error: 'Valid email is required' },
                { status: 400 }
            );
        }

        // Simulate network delay for the "processing" effect
        await new Promise(resolve => setTimeout(resolve, 800));

        // Hollow route: We do not integrate Mailchimp yet per user request.
        // In the future:
        // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
        // const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

        return NextResponse.json(
            { message: 'Successfully subscribed' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Newsletter error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
