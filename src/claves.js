//CONFIGURACION BASE DE DATOS

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'ocu-sis';
const DB_PORT = process.env.DB_PORT || 3306;

module.exports = {
    database: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT
    }
}

