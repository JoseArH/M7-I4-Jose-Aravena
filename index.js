const { Pool } = require('pg');
const config = require('./config');

async function mostrarSaldos(client, mensaje) {
    const saldos = await client.query(
        "SELECT first_name, saldo FROM usuarios ORDER BY first_name"
    );
    console.log(`\n${mensaje}:`);
    saldos.rows.forEach(usuario => {
        console.log(`${usuario.first_name}: $${usuario.saldo}`);
    });
}

async function main() {
    const pool = new Pool(config.database);
    let client;

    try {
        client = await pool.connect();
        console.log("Conexión establecida con éxito");

        await mostrarSaldos(client, "Saldos iniciales");

        const saldoRodol = await client.query(
            "SELECT saldo FROM usuarios WHERE first_name = 'Rodol'"
        );
        
        if (saldoRodol.rows[0].saldo >= 10000) {
            console.log("\nRealizando transferencia de $10000...");
            await client.query("BEGIN");
            
            await client.query(
                "UPDATE usuarios SET saldo = saldo - 10000 WHERE first_name = 'Rodol'"
            );
            await client.query(
                "UPDATE usuarios SET saldo = saldo + 10000 WHERE first_name = 'Ale'"
            );
            
            await client.query("COMMIT");
            console.log("Transferencia completada con éxito");
        } else {
            console.log("\nRodol no tiene saldo suficiente para realizar la transferencia");
        }

        await mostrarSaldos(client, "Saldos después de la transferencia");

    } catch (error) {
        console.error("Error en la transacción:", error);
        if (client) {
            await client.query("ROLLBACK");
        }
    } finally {
        if (client) {
            client.release();
        }
        await pool.end();
    }
}

main().catch(console.error);
