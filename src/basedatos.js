//IMPORTANDO MODULO DE MYSQL
const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./claves')
const pool = mysql.createPool(database);

//OBTENIENDO CONECCION Y MOSTRANDO SI HAY ERRORES Y SU TIPO
pool.getConnection((err, connection) => {
    if (err) {
        if(err.code == 'PROTOCOL_CONNECTION_LOST'){
            console.error('Base de datos cerrada');
        }
        if(err.code == 'ER_CON_COUNT_ERROR'){
            console.error("muchas coneciones");
        }
        if(err.code == 'ECONNREFUSED'){
            console.error("coneccion rechazada");
        }
    }
    if(connection) connection.release();
    console.log("Coneccion establecida");
    return;
    
});

//convirtiendo call backs a promesas
pool.query = promisify(pool.query); //para una colsulta voy a usar promesas

module.exports = pool;