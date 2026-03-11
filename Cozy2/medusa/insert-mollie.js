const { Client } = require('pg');
const crypto = require('crypto');
const client = new Client({ connectionString: 'postgres://postgres:Aksel2856!@localhost/CozyMedusa' });

async function run() {
    try {
        await client.connect();
        const resRegion = await client.query('SELECT id FROM region LIMIT 1;');
        const regionId = resRegion.rows[0].id;

        const resProvider = await client.query("SELECT id FROM payment_provider WHERE id LIKE '%mollie%';");
        const providers = resProvider.rows.map(r => r.id);

        for (const providerId of providers) {
            const id = 'regpp_' + crypto.randomBytes(12).toString('hex');
            const now = new Date().toISOString();
            await client.query(
                'INSERT INTO region_payment_provider (id, region_id, payment_provider_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
                [id, regionId, providerId, now, now]
            );
            console.log(`Linked ${providerId} to ${regionId}`);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();
