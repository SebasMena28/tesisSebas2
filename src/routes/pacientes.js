const express = require('express');
const router = express.Router();


const pool = require('../basedatos'); //referencia a la conexion de la base de datos

//PARA EL CRUD
router.get('/nuevoPaciente', (req, res) => { //VISTA PARA AGREGAR PACIENTE
    res.render('pacientes/nuevoPaciente'); 
})

router.post('/nuevoPaciente', async (req, res)=>{ //PROCESO DE AGREGAR PACIENTE
    //res.send('funciona xd ' + req.body.cedula);
    //console.log( req.body);

    const {cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil, 
        ocupacion, religion, motivo, historiaEnfermedad, anamnesis, historiaLaboral, historiaSocial, grupoFamiliarOrigen, 
        grupoFamiliarPropio, funcionesPsiquicas, diagnostico, plan, referencia} = req.body;
    const nuevoPaciente = {
        cedula,
        apellidoPaterno,
        apellidoMaterno, 
        primerNombre, 
        segundoNombre, 
        fechaNacimiento, 
        genero,
        estadoCivil,
        ocupacion,
        religion,
        motivo, 
        historiaEnfermedad, 
        anamnesis, 
        historiaLaboral, 
        historiaSocial, 
        grupoFamiliarOrigen, 
        grupoFamiliarPropio, 
        funcionesPsiquicas, 
        diagnostico, 
        plan, 
        referencia
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO PACIENTES set ?', [nuevoPaciente]) //QUERY para insertar datos del objeto nuevoPaciente
    console.log(nuevoPaciente);
    req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
    res.redirect('/pacientes')
});


router.get('/', async (req, res) => { //VISTA PARA LISTAR PACIENTES
    const pacientes = await pool.query('SELECT * FROM PACIENTES');
    res.render('pacientes/lista', {pacientes}); //renderizando y mando los pacientes registrados
})


router.get('/borrar/:cedula', async (req, res) => {
    //console.log(req.params.cedula);
    //res.send('se eliminara este paciente ');

    const {cedula} = req.params;
    await pool.query('DELETE FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.redirect('/pacientes')
})

router.get('/editar/:cedula', async (req, res) => { //MUESTRA VISTA DE LOS DATOS PARA EDITAR, NO HACE EL PROCESO
    const {cedula} = req.params;
    //console.log(cedula);
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    //console.log(paciente[0])
    res.render('pacientes/editar', {paciente: paciente[0]})
})

router.post('/editar/:cedula', async (req, res) => {
    const {_cedula} = req.params;
    
    const {cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil, 
        ocupacion, religion, motivo, historiaEnfermedad, anamnesis, historiaLaboral, historiaSocial, grupoFamiliarOrigen, 
        grupoFamiliarPropio, funcionesPsiquicas, diagnostico, plan, referencia} = req.body;
    const nuevoPaciente = {
        cedula,
        apellidoPaterno,
        apellidoMaterno, 
        primerNombre, 
        segundoNombre, 
        fechaNacimiento, 
        genero,
        estadoCivil,
        ocupacion,
        religion,
        motivo, 
        historiaEnfermedad, 
        anamnesis, 
        historiaLaboral, 
        historiaSocial, 
        grupoFamiliarOrigen, 
        grupoFamiliarPropio, 
        funcionesPsiquicas, 
        diagnostico, 
        plan, 
        referencia
    }; 

    //await es porque es una funcion asincrona
    await pool.query('UPDATE PACIENTES set ? WHERE CEDULA = ?', [nuevoPaciente, cedula]) //QUERY para insertar datos del objeto nuevoPaciente
    //console.log(nuevoPaciente);
    res.redirect('/pacientes')
    //res.send('actualizado')
})



module.exports = router;