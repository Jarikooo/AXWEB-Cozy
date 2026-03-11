const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://postgres:Aksel2856!@localhost/CozyMedusa' });

async function run() {
    try {
        await client.connect();
        const resRegion = await client.query('SELECT id, name FROM region;');
        console.log('Regions:', resRegion.rows);

        const resProvider = await client.query('SELECT id FROM payment_provider;');
        console.log('Payment Providers:', resProvider.rows);

        const resLink = await client.query('SELECT * FROM region_payment_provider;');
        console.log('Region/Provider Links:', resLink.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();
