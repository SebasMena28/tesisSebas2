const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('eval/lista');
});

router.get('/nuevaEvaluacion', (req, res) => {
    res.render('eval/nuevaEvaluacion')
})

router.post('/nuevaEvaluacion', async (req, res) => {
    const {cedula, fecha, tecnica, descripcion, resultados} = req.body;
    const nuevaCita = {
        cedula, fecha, tecnica, descripcion, resultados
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO CITAS set ?', [nuevaCita]) //QUERY para insertar datos del objeto nuevoPaciente
    console.log(nuevaCita);
    req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
    res.redirect('/citas')
})

module.exports = router