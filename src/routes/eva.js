const express = require('express');
const router = express.Router();
const pool = require('../basedatos'); 
const validar = require('../validation/eval');

//const tiempoTranscurrido = Date.now();
//const hoy = new Date(tiempoTranscurrido);

var fechahoy = new Date().toISOString().slice(0, 10);

router.get('/', (req, res) => {
    res.render('eval/lista');
});

router.get('/NuevaEvaluacion/:cedula', async (req, res) => { 
    const { cedula } = req.params;
    console.log(cedula);
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/NuevaEvaluacion',{ paciente: paciente[0]}); 
})

router.post('/nuevaEvaluacion/:cedula', async (req, res) => {
    const { cedula } = req.params;

    const {tecnica, descripcion, resultados} = req.body;
    
    const nuevaEvaluacion = {
        cedula: cedula, 
        fecha: fechahoy, 
        tecnica, 
        descripcion, 
        resultados
    }; 

    await pool.query('INSERT INTO EVALUACIONPSICOLOGICA set ?', [nuevaEvaluacion])
    console.log(nuevaEvaluacion);
    req.flash('exito', 'Evaluacion agregada')
    res.redirect('/pacientes')
})

router.get('/evaluacionesPaciente/:cedula', async (req, res) => { 
    const { cedula } = req.params;
    console.log(cedula);
    const evaluacion = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA WHERE CEDULA = ?', [cedula])
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    validar.arreglarVista(evaluacion)
    res.render('eval/evaluacionesPaciente',{ evaluacion, paciente: paciente[0]}); 
})

router.get('/verEvaluacion/:id', async (req, res) => { 
    const { id } = req.params;
    console.log(id);
    const evaluacion = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA WHERE ID = ?', [id])
    validar.arreglarVista(evaluacion)
    res.render('eval/verEvaluacion',{ evaluacion: evaluacion[0]}); 
})

module.exports = router