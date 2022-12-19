const express = require('express');
const router = express.Router();

const pool = require('../basedatos'); 

router.get('/', async (req, res) => {
    const citas = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA FROM PACIENTES P, CITAS C WHERE P.CEDULA = C.PACIENTE;');
    res.render('citas/citas', {citas});
});

router.get('/nuevaCita', async (req, res) => {
    const pacientes = await pool.query('SELECT * FROM PACIENTES ORDER BY APELLIDOPATERNO, APELLIDOMATERNO, PRIMERNOMBRE, SEGUNDONOMBRE');
    res.render('citas/nuevaCita', {pacientes});
});

router.post('/nuevaCita', async (req, res) => {
    const {paciente, fecha, hora, observaciones} = req.body;
    const nuevaCita = {
        paciente, fecha, hora, observaciones
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO CITAS set ?', [nuevaCita]) 
    console.log(nuevaCita);
    req.flash('guardado', 'Datos del paciente almacenados con éxito!'); //para usar el modulo flash
    res.redirect('/citas')
})

router.get('/verCita/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const cita = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA, C.OBSERVACIONES FROM PACIENTES P, CITAS C WHERE C.IDCITANUEVA = ?'  , [id]);
    console.log({ cita: cita[0] });
    res.render('citas/verCita', { cita: cita[0] });
});

router.get('/editarCita/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const cita = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA, C.OBSERVACIONES FROM PACIENTES P, CITAS C WHERE C.IDCITANUEVA = ?'  , [id])
    console.log(cita);
    res.render('citas/editarCita', { cita: cita[0] })
});

router.post('/editarCita/:idcitanueva', async (req, res) => {
    const idcitanueva = req.params;
    console.log(idcitanueva);
    const { fecha, hora, observaciones } = req.body;
    const cita = {
        fecha, 
        hora, 
        observaciones
    };

    await pool.query('UPDATE CITAS set ? WHERE IDCITANUEVA = ?', [cita, idcitanueva]);
    console.log(cita);
    res.redirect('/citas');
})

router.get('/borrarCita/:cita', async (req, res) => {
    const { citaBorrar } = req.params;
    console.log(cedula);
    const cita = await pool.query('SELECT * FROM CITAS WHERE IDCITANUEVA = ?'  , [citaBorrar])
    console.log(cita);
    res.render('citas/borrarCita', { cita: cita[0] })
});

router.post('/borrarCita/:cedula', async (req, res) => {
    const cedula = req.params;
    console.log(cedula);

    await pool.query('UPDATE CITAS set ? WHERE PACIENTE = ?', [cita, cedula]);
    console.log(cita);
    res.redirect('/citas');
})


module.exports = router;