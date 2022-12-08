const express = require('express');
const router = express.Router();


const pool = require('../basedatos'); //referencia a la conexion de la base de datos

//PARA EL CRUD
router.get('/', (req, res) => { //VISTA PARA AGREGAR
    res.send('aqui va a lita de evaluaciones'); 
})

router.get('/nuevaEvaluacion', (req, res) => { //VISTA PARA AGREGAR 
    res.send('aqui va a lita de evaluaciones'); 
})

router.post('/nuevaEvaluacion', async (req, res)=>{ //PROCESO DE AGREGAR
    //res.send('funciona xd ' + req.body.cedula);
    //console.log( req.body);

    res.render('eval/lista');

    const {cedula, fecha, tecnica, descripcion, resultados} = req.body;
    const nuevaEvaluacion = {
        cedula, fecha, tecnica, descripcion, resultados
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO EVALUACIONPSICOLOGICA set ?', [nuevaEvaluacion]) //QUERY para insertar datos del objeto nuevoPaciente
    console.log(nuevaEvaluacion);
    req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
    res.redirect('/evaluaciones')
});


router.get('/', async (req, res) => { //VISTA PARA LISTAR PACIENTES
    const pacientes = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA');
    res.render('evaluaciones/lista', {pacientes}); //renderizando y mando los pacientes registrados
})



module.exports = router;