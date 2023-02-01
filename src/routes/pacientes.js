const express = require('express');
const validar = require('../validation/pacientes');
const router = express.Router();

const pool = require('../basedatos'); //referencia a la conexion de la base de datos

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
var ced;
var paciente = {}, historia = {}, funcion = {}, diag = {};
var error;

router.get('/prueba', async (req, res) => { //VISTA PARA AGREGAR PACIENTE
    //alert('holi')
    const pacientes = await pool.query('SELECT * FROM PACIENTES');
    res.render('pacientes/prueba', { pacientes });
})

router.post('/prueba', (req, res) => { //VISTA PARA AGREGAR PACIENTE
    //alert('holi')
    //console.log(req.body)
    res.redirect('/pacientes');
})

function validaciones(atributo, valor) {
    let pasa = true;
    error = '';
    switch (atributo) {
        case 'cedula':
            pasa = validar.validarCedula(valor);
            console.log('La cedula es: ' + valor + ' ' + pasa);
            break;
        case 'apellidoPaterno':
            pasa = validar.validarApe1(valor);
            console.log('apellidoPaterno es: ' + valor + ' ' + pasa);
            break;
        case 'apellidoMaterno':
            pasa = validar.validarApe2(valor);
            console.log('apellidoMaterno es: ' + valor + ' ' + pasa);
            break;
        case 'primerNombre':
            pasa = validar.validarNombre1(valor);
            console.log('primerNombre es: ' + valor + ' ' + pasa);
            break;
        case 'segundoNombre':
            pasa = validar.validarNombre2(valor);
            console.log('segundoNombre es: ' + valor + ' ' + pasa);
            break;
        case 'fechaNacimiento':
            pasa = validar.validarFecha(valor, error);
            console.log('fechanacimiento es: ' + valor + ' ' + pasa);
            break;
        case 'correo':
            pasa = validar.validarEmail(valor, error);
            console.log('correo es: ' + valor + ' ' + pasa);
            break;
        case 'telefono':
            pasa = validar.validarTelefono(valor, error);
            console.log('telefono es: ' + valor + ' ' + pasa);
            break;
    }
    return pasa;
}


function validarDatos(objeto) {
    let atributos = Object.keys(objeto);
    let datos = Object.values(objeto)
    let aprovado = false;
    let confirmado = true;
    /*console.log('atributos');
    console.log(atributos);
    console.log('datos');
    console.log(datos);*/

    for (let i = 0; i < atributos.length; i++) {
        aprovado = validaciones(atributos[i], datos[i]);
        //console.log(atributos[i], datos[i], aprovado);
        if (!aprovado) confirmado = aprovado;
    }
    //console.log(atributos.length, datos.length);

    return confirmado;
}

router.post('/nuevoPaciente', async (req, res) => {
    const { cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil,
        ocupacion, religion, correo, telefono } = req.body;

    var tel2 = telefono - telefono[0];

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
        telefono: '593' + tel2,
        ultimacita: hoy.toLocaleDateString()
        //ultimacita: hoy.toISOString()
    }

    //telefono: '+593' + telefono[1]+telefono[2]+telefono[3]+telefono[4]+telefono[5]+telefono[6]+telefono[7]+telefono[8]+telefono[9],

    ced = req.body.cedula;
    paciente = nuevoPaciente;
    console.log(paciente);
    //console.log(Object.values(paciente)[11].length);

    const existe = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    //console.log(existe, 'hay este paciente');
    //res.render('pacientes/nuevaHistoria');

    if (existe == "") {
        res.render('pacientes/nuevaHistoria');
    }
    else {
        req.flash('fallo', 'Esta cédula ya se encuentra registrada. Por favor, intente de nuevo');
        res.redirect('/pacientes/prueba')
        console.log('ESTE PACIENTE YA EXISTE');
    }
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


    //registro de datos
    await pool.query('INSERT INTO PACIENTES set ?', [paciente]);
    console.log(paciente);

    await pool.query('INSERT INTO HISTORIAENFERMEDAD set ?', [historia]);
    console.log(historia);

    await pool.query('INSERT INTO FUNCIONESPSIQUICAS set ?', [funcion]);
    console.log(funcion);

    await pool.query('INSERT INTO DIAGNOSTICO set ?', [diag]);
    console.log(diag);

    req.flash('exito', 'Paciente registrado exitosamente')
    res.redirect('/pacientes');
});

router.post('/BuscarPaciente/', async (req, res) => {

    const { dato } = req.body;
    //console.log(dato);
    const [dato1, dato2] = dato.split(' ');
    //console.log(dato1, dato2);

    const resultados = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ? OR (PRIMERNOMBRE LIKE ? AND APELLIDOPATERNO LIKE ?) OR (SEGUNDONOMBRE LIKE ? AND APELLIDOPATERNO LIKE ?) OR (PRIMERNOMBRE LIKE ? AND SEGUNDONOMBRE LIKE ?) OR (SEGUNDONOMBRE LIKE ? AND APELLIDOMATERNO LIKE ?) OR (APELLIDOPATERNO LIKE ? AND APELLIDOMATERNO LIKE ?) OR (APELLIDOMATERNO LIKE ? AND APELLIDOPATERNO LIKE ?) OR (APELLIDOPATERNO LIKE ?) OR (PRIMERNOMBRE LIKE ?) OR (SEGUNDONOMBRE LIKE ?) OR (APELLIDOMATERNO LIKE ?) OR (APELLIDOPATERNO LIKE ? AND SEGUNDONOMBRE LIKE ?) OR (APELLIDOPATERNO LIKE ? AND PRIMERNOMBRE LIKE ?) ', [dato, dato1, dato2, dato1, dato2, dato1, dato2, dato1, dato2, dato1, dato2, dato1, dato2, dato, dato, dato, dato, dato1, dato2, dato1, dato2]);
    //console.log(resultados);

    res.render('pacientes/busqueda', { resultados, dato1, dato2 });
});

router.get('/datos/:cedula', async (req, res) => {
    const { cedula } = req.params;
    //console.log(cedula);
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ? ORDER BY ID DESC', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    const datos = await pool.query('SELECT * FROM HISTORIAENFERMEDAD H, DIAGNOSTICO D WHERE D.CEDULA = ? AND H.CEDULA = ?', [cedula, cedula]);

    validar.arreglarVista(seguimiento)
    res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento, datos: datos[0] });
})

router.get('/', async (req, res) => { //VISTA PARA LISTAR PACIENTES
    const pacientes = await pool.query('SELECT * FROM PACIENTES ORDER BY ULTIMACITA DESC');
    res.render('pacientes/lista', { pacientes }); //renderizando y mando los pacientes registrados
});

router.get('/borrar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    await pool.query('DELETE FROM PACIENTES WHERE CEDULA = ?', [cedula])
    req.flash('exito', 'Paciente eliminado exitosamente')
    res.redirect('/pacientes')
})

router.get('/editar/:cedula', async (req, res) => {
    const { cedula } = req.params;

    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    const historia = await pool.query('SELECT * FROM HISTORIAENFERMEDAD WHERE CEDULA = ?', [cedula])
    const funciones = await pool.query('SELECT * FROM FUNCIONESPSIQUICAS WHERE CEDULA = ?', [cedula])
    const diagnostico = await pool.query('SELECT * FROM DIAGNOSTICO WHERE CEDULA = ?', [cedula])

    var tel = paciente[0].TELEFONO;
    tel = tel.split("593").join('0');
    //console.log(tel);
    paciente[0].TELEFONO = tel;

    //console.log(paciente[0].TELEFONO, 'dato final');

    res.render('pacientes/modificar', { paciente: paciente[0], historia: historia[0], funciones: funciones[0], diagnostico: diagnostico[0] })
})

router.post('/editar/:cedula', async (req, res) => {
    const { cedula } = req.params;

    //para editar datos del paciente
    const { apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, estadoCivil,
        ocupacion, religion, correo, telefono } = req.body;

    var tel2 = telefono - telefono[0];

    const nuevoPaciente = {
        apellidoPaterno,
        apellidoMaterno,
        primerNombre,
        segundoNombre,
        estadoCivil,
        ocupacion,
        religion,
        correo,
        telefono: '593' + tel2,
        ultimacita: hoy.toLocaleDateString()
    }

    console.log(nuevoPaciente);

    //para editar datos de la historia

    const { motivo, historiaEnfermedad, prenatal, natal, postnatal, primeraInfancia, segundaInfancia, terceraInfancia,
        pubertad, adolescencia, juventud, adultez, madurez, vejez, historiaSocial, historiaLaboral, grupoFamiliarPropio, grupoFamiliarOrigen } = req.body;

    const nuevaHistoria = {
        //cedula: cedula,
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

    //para editar datos de la funcion
    const { orientacion, atencion, conciencia, sensopercepcion, memoria, pensamiento,
        lenguaje, inteligencia } = req.body;

    const nuevaFuncion = {
        //cedula: cedula,
        orientacion,
        atencion,
        conciencia,
        sensopercepcion,
        memoria,
        pensamiento,
        lenguaje,
        inteligencia
    }

    //para editar datos del diagnostico

    const { diagnostico, planes, referencia } = req.body;

    const nuevoDiagnostico = {
        //cedula: cedula,
        diagnostico,
        planes,
        referencia
    }

    await pool.query('UPDATE PACIENTES set ? WHERE CEDULA = ?', [nuevoPaciente, cedula]);
    await pool.query('UPDATE HISTORIAENFERMEDAD set ? WHERE CEDULA = ?', [nuevaHistoria, cedula]);
    await pool.query('UPDATE FUNCIONESPSIQUICAS set ? WHERE CEDULA = ?', [nuevaFuncion, cedula]);
    await pool.query('UPDATE DIAGNOSTICO set ? WHERE CEDULA = ?', [nuevoDiagnostico, cedula]);
    req.flash('exito', 'Datos actualizados correctamente')
    res.redirect('/pacientes');

})



module.exports = router;