const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.database);

async function query(sql, params) {
    const result = await pool.query(sql, params);
    return result.rows;
}

async function getConnection() {
    return await pool.connect();
}

module.exports = {
    query,
    getConnection
};
