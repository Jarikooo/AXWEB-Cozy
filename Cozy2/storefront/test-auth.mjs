import Medusa from "@medusajs/js-sdk";

const sdk = new Medusa({
    baseUrl: "http://127.0.0.1:9000",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_561ffedd8d51884a7cb16444923c406e7850811fe93fd52bdc74bdb2f121b9d2",
});

async function run() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = "Password123!";

    console.log("1. Registering auth identity...");
    await sdk.auth.register("customer", "emailpass", { email, password });

    console.log("2. Logging in...");
    const token = await sdk.auth.login("customer", "emailpass", { email, password });
    console.log("Token:", typeof token === 'string' ? "Received" : token);

    console.log("3. Creating Customer Profile...");
    try {
        const createRes = await sdk.client.fetch(`/store/customers`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: {
                first_name: "Test",
                last_name: "User",
                email,
            }
        });
        console.log("Create Profile Res:", createRes);
    } catch (e) {
        console.log("Error creating profile:", e.message);
    }

    console.log("4. Fetching /me...");
    try {
        const meRes = await sdk.client.fetch('/store/customers/me', {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Me Res:", meRes);
    } catch (e) {
        console.error("Error fetching me:", e.message);
    }
}

run();
