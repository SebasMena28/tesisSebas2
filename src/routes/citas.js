const express = require('express');
const router = express.Router();

const pool = require('../basedatos'); 

router.get('/', async (req, res) => {
    const citas = await pool.query('SELECT * FROM CITAS');
    res.render('citas/citas', {citas});
});

router.get('/nuevaCita', (req, res) => {
    res.render('citas/nuevaCita');
});

router.post('/nuevaCita', async (req, res) => {
    const {fecha, hora, observaciones} = req.body;
    const nuevaCita = {
        fecha, hora, observaciones
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO CITAS set ?', [nuevaCita]) 
    console.log(nuevaCita);
    req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
    res.redirect('/citas')
})

module.exports = router;