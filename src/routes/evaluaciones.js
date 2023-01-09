const express = require('express');
const router = express.Router();


const pool = require('../basedatos'); 
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);

router.get('/NuevaEvaluacion/:cedula', async (req, res) => { 
    const { cedula } = req.params;
    console.log(cedula);
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO S, PACIENTES P WHERE P.CEDULA = ?', [cedula])
    console.log(hoy.toLocaleDateString());
    console.log(seguimiento);
    res.render('eval/NuevaEvaluacion'); 
})


router.post('/nuevaEvaluacion/:cedula', async (req, res)=>{

    const {cedula, fecha, tecnica, descripcion, resultados} = req.body;
    const nuevaEvaluacion = {
        cedula, fecha, tecnica, descripcion, resultados
    }; 

    await pool.query('INSERT INTO EVALUACIONPSICOLOGICA set ?', [nuevaEvaluacion]) 
    console.log(nuevaEvaluacion);
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ?', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento});
});


router.get('/', async (req, res) => { //VISTA PARA LISTAR PACIENTES
    const pacientes = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA');
    res.render('evaluaciones/lista', {pacientes}); //renderizando y mando los pacientes registrados
})



module.exports = router;