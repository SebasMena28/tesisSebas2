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

router.get('/nuevaEvaluacion', (req, res) => { 
    res.send('aqui va a lita de evaluaciones'); 
})

router.post('/nuevaEvaluacion', async (req, res)=>{


    res.render('eval/lista');

    const {cedula, fecha, tecnica, descripcion, resultados} = req.body;
    const nuevaEvaluacion = {
        cedula, fecha, tecnica, descripcion, resultados
    }; 

    await pool.query('INSERT INTO EVALUACIONPSICOLOGICA set ?', [nuevaEvaluacion]) 
    console.log(nuevaEvaluacion);
    res.redirect('/evaluaciones')
});


router.get('/', async (req, res) => { //VISTA PARA LISTAR PACIENTES
    const pacientes = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA');
    res.render('evaluaciones/lista', {pacientes}); //renderizando y mando los pacientes registrados
})



module.exports = router;