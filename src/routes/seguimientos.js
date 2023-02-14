const express = require('express');
const router = express.Router();
const passport = require('passport')
const pool = require('../basedatos');
const validar = require('../validation/seguimiento');

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
var fechahoy = new Date().toISOString().slice(0, 10);

var ced;

router.get('/nuevo/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    console.log(paciente);
    res.render('seguimientos/seguimiento-agregarxd', { paciente: paciente[0] });
});

router.get('/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    console.log(paciente);
    res.render('seguimientos/nuevoSeguimiento', { paciente: paciente[0] });
});


router.get('/nuevoSeguimiento/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ? ORDER BY ID DESC', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    console.log(pacientes[0])
    console.log(seguimiento);
    res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento });
});

router.get('/arreglarFecha/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ? ORDER BY ID DESC', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    console.log(pacientes[0])
    console.log(seguimiento);
    res.render('evaluaciones/datos', { pacientes: pacientes[0], seguimiento });
});

router.post('/nuevoSeguimiento/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { diagnosticoinicial, actividades, tareapaciente, proximacita, proximahora, observaciones } = req.body;

    const nuevaCita = {
        cedula: cedula,
        fecha: proximacita,
        hora: proximahora,
        observaciones
    };
    //console.log(nuevaCita.fecha);

    
    //console.log(nuevaCita);
    //console.log('messirve');

    /*const nuevoSeguimiento = {
        cedula: cedula,
        diagnosticoinicial,
        actividades,
        tareapaciente,
        proximacita,
        proximahora,
        fecha: fechahoy
    }

    await pool.query('INSERT INTO CITAS set ?', [nuevaCita])

    await pool.query('INSERT INTO SEGUIMIENTO set ?', [nuevoSeguimiento]);

    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ? ORDER BY ID DESC', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    validar.arreglarVista(seguimiento)
    //req.flash('exito', 'Seguimiento registrado exitosamente')
    res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento });*/

    if (validar.validarFecha(nuevaCita.fecha)) {
        await pool.query('INSERT INTO CITAS set ?', [nuevaCita])

        const nuevoSeguimiento = {
            cedula: cedula,
            diagnosticoinicial,
            actividades,
            tareapaciente,
            proximacita,
            proximahora,
            fecha: fechahoy
        }
    
        await pool.query('INSERT INTO SEGUIMIENTO set ?', [nuevoSeguimiento]);
        console.log(nuevoSeguimiento, 'este es el seguimiento');
    
        const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ? ORDER BY ID DESC', [cedula])
        const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
        validar.arreglarVista(seguimiento)
        res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento });
    }
    else{
        var ruta = '/seguimientos/' + cedula;
        req.flash('fallo', 'La fecha no es permitida. Intente de nuevo por favor');
        res.redirect(ruta);
    }
});

router.get('/verSeguimiento/:id', async (req, res) => {
    const { id } = req.params;
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE ID = ?', [id]);
    validar.arreglarVista(seguimiento)
    console.log(seguimiento);
    res.render('seguimientos/verSeguimiento', { seguimiento: seguimiento[0] });
});

router.get('/borrar/:id', async (req, res) => {
    const { id } = req.params;
 
    const seg = await pool.query('SELECT * FROM SEGUIMIENTO WHERE ID = ?', [id])
    if (seg == undefined) {
        const cedula = ced;
        const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ?', [cedula])
        const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
        validar.arreglarVista(seguimiento);
        res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento });
    }
    else {
        const cedula = seg[0].CEDULA;
        ced = cedula;
        await pool.query('DELETE FROM SEGUIMIENTO WHERE ID = ?', [id])
        const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ?', [cedula])
        const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
        validar.arreglarVista(seguimiento);
        res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento });
    }

})

module.exports = router;