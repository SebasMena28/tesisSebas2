const express = require('express');
const router = express.Router();
const passport = require('passport')
const pool = require('../basedatos');

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
var fechahoy = new Date().toISOString().slice(0, 10);

var ced;

router.get('/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    console.log(paciente);
    res.render('seguimientos/nuevoSeguimiento', {paciente: paciente[0]});
});

router.post('/nuevoSeguimiento/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const { diagnosticoinicial, actividades, tareapaciente, proximacita, proximahora, observaciones} = req.body;

    const nuevaCita = {
        cedula: cedula, 
        fecha: proximacita, 
        hora: proximahora, 
        observaciones
    }; 

    await pool.query('INSERT INTO CITAS set ?', [nuevaCita]) 
    console.log(nuevaCita);

    //const cita = await pool.query('SELECT * FROM CITAS WHERE FECHA = ? AND HORA = ?', [proximacita, proximahora]);
    const cita = await pool.query('SELECT * FROM CITAS');
    console.log(cita, 'esta es la cita');

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

    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE CEDULA = ?', [cedula])
    const pacientes = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    //console.log(paciente[0])
    console.log(seguimiento);
    res.render('pacientes/datos', { pacientes: pacientes[0], seguimiento});
});

router.get('/verSeguimiento/:id', async (req, res) => {
    const { id } = req.params;
    const seguimiento = await pool.query('SELECT * FROM SEGUIMIENTO WHERE ID = ?', [id]);
    console.log(seguimiento);
    res.render('seguimientos/verSeguimiento', {seguimiento: seguimiento[0] });
});


module.exports = router;