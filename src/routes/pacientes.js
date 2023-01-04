const express = require('express');
const validar = require('../validation/pacientes');
const router = express.Router();

const pool = require('../basedatos'); //referencia a la conexion de la base de datos

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
var ced;
var paciente = {}, historia = {}, funcion = {}, diag = {};

//PARA EL CRUD
router.get('/nuevoPaciente', (req, res) => { //VISTA PARA AGREGAR PACIENTE
    res.render('pacientes/nuevoPaciente');
})

router.post('/nuevoPaciente', async (req, res) => {
    const { cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil,
        ocupacion, religion, correo, telefono } = req.body;

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
        correo,
        telefono: '+593' + telefono[1]+telefono[2]+telefono[3]+telefono[4]+telefono[5]+telefono[6]+telefono[7]+telefono[8]+telefono[9],
        ultimacita: hoy.toLocaleDateString()
    }

    ced = req.body.cedula;
    paciente = nuevoPaciente;
    console.log(paciente);
    res.render('pacientes/nuevaHistoria');
    
    /*if (validar.validarCedula(cedula)) {
        //await es porque es una funcion asincrona
        //await pool.query('INSERT INTO PACIENTES set ?', [nuevoPaciente]) //QUERY para insertar datos del objeto nuevoPaciente
        console.log(nuevoPaciente);
        //req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
        res.redirect('/pacientes');
    }
    else {
        console.log('jeje');
    }*/
});


router.post('/nuevaHistoria', async (req, res) => {

    const { motivo, historiaEnfermedad, prenatal, natal, postnatal, primeraInfancia, segundaInfancia, terceraInfancia,
        pubertad, adolescencia, juventud, adultez, madurez, vejez, historiaSocial, historiaLaboral, grupoFamiliarPropio, grupoFamiliarOrigen } = req.body;

    const nuevaHistoria = {
        cedula: ced,
        motivo,
        historiaEnfermedad,
        prenatal,
        natal,
        postnatal,
        primeraInfancia,
        segundaInfancia,
        terceraInfancia,
        pubertad,
        adolescencia,
        juventud,
        adultez,
        madurez,
        vejez,
        historiaSocial,
        historiaLaboral,
        grupoFamiliarPropio,
        grupoFamiliarOrigen
    }

    historia = nuevaHistoria;
    res.render('pacientes/nuevaFuncion');
});


router.post('/nuevaFuncion', async (req, res) => {

    const { orientacion, atencion, conciencia, sensopercepcion, memoria, pensamiento,
        lenguaje, inteligencia } = req.body;

    const nuevaFuncion = {
        cedula: ced,
        orientacion,
        atencion,
        conciencia,
        sensopercepcion,
        memoria,
        pensamiento,
        lenguaje,
        inteligencia
    }

    funcion = nuevaFuncion;
    res.render('pacientes/diagnostico');
});


router.post('/diagnostico', async (req, res) => {

    const { diagnostico, planes, referencia } = req.body;

    const nuevoDiagnostico = {
        cedula: ced,
        diagnostico, 
        planes, 
        referencia
    }

    diag = nuevoDiagnostico;
    res.redirect('/pacientes');
    
    //registro de datos
    await pool.query('INSERT INTO PACIENTES set ?', [paciente]);
    console.log(paciente);

    await pool.query('INSERT INTO HISTORIAENFERMEDAD set ?', [historia]);
    console.log(historia);

    await pool.query('INSERT INTO FUNCIONESPSIQUICAS set ?', [funcion]);
    console.log(funcion);

    await pool.query('INSERT INTO DIAGNOSTICO set ?', [diag]);
    console.log(diag);
});

router.post('/BuscarPaciente/', async (req, res) => {

    const { dato } = req.body;
    console.log(dato);
    
    const resultados = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [dato]);
    console.log(resultados);

    res.render('pacientes/busqueda', {resultados});
});

router.get('/datos/:cedula', async (req, res) => { 
    const { cedula } = req.params;
    //console.log(cedula);
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ?', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    //console.log(paciente[0])
    console.log(seguimiento);
    res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento});
})

router.get('/', async (req, res) => { //VISTA PARA LISTAR PACIENTES
    const pacientes = await pool.query('SELECT * FROM PACIENTES');
    res.render('pacientes/lista', { pacientes }); //renderizando y mando los pacientes registrados
});

router.get('/borrar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    await pool.query('DELETE FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.redirect('/pacientes')
})

router.get('/editar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('pacientes/editar', { paciente: paciente[0] })
})

router.post('/editar/:cedula', async (req, res) => {
    const { _cedula } = req.params;

    const { cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil,
        ocupacion, religion, motivo, historiaEnfermedad, anamnesis, historiaLaboral, historiaSocial, grupoFamiliarOrigen,
        grupoFamiliarPropio, funcionesPsiquicas, diagnostico, plan, referencia } = req.body;
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

    await pool.query('UPDATE PACIENTES set ? WHERE CEDULA = ?', [nuevoPaciente, cedula]);
    res.redirect('/pacientes');
})



module.exports = router;