require('dotenv').config();

module.exports = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USUARIO,
        password: process.env.DB_CONTRASENA,
        database: process.env.DB_NOMBRE,
        port: process.env.DB_PUERTO,
    },
    port: process.env.PORT || 3000
};
