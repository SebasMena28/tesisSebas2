const express = require('express');
const router = express.Router();

const pool = require('../basedatos'); //referencia a la conexion de la base de datos

router.get('/', async (req, res) => {
    const citas = await pool.query('SELECT * FROM CITAS');
    res.render('citas/citas', {citas});
});

router.get('/nuevaCita', (req, res) => {
    res.render('citas/nuevaCita');
});

router.post('/nuevaCita', async (req, res) => {
    const {fecha, hora} = req.body;
    const nuevaCita = {
        fecha, hora
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO CITAS set ?', [nuevaCita]) //QUERY para insertar datos del objeto nuevoPaciente
    console.log(nuevaCita);
    req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
    res.redirect('/citas')
})

module.exports = router;