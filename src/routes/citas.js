const express = require('express');
const router = express.Router();
const pool = require('../basedatos');
const validar = require('../validation/citas');

router.get('/', async (req, res) => {
    const citas = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA FROM PACIENTES P, CITAS C WHERE P.CEDULA = C.CEDULA ORDER BY FECHA, HORA DESC;');
    console.log(citas);
    validar.arreglarVista(citas)
    res.render('citas/citas', { citas });
});

router.get('/nuevaCita', async (req, res) => {
    const pacientes = await pool.query('SELECT * FROM PACIENTES ORDER BY APELLIDOPATERNO, APELLIDOMATERNO, PRIMERNOMBRE, SEGUNDONOMBRE');
    res.render('citas/nuevaCita', { pacientes });
});

router.post('/nuevaCita', async (req, res) => {
    const { cedula, fecha, hora, observaciones } = req.body;

    const nuevaCita = {
        cedula,
        fecha,
        hora,
        observaciones
    };

    if (validar.validarFecha(nuevaCita.fecha)) {
        await pool.query('INSERT INTO CITAS set ?', [nuevaCita])
        console.log(nuevaCita);
        res.redirect('/citas')
        console.log('messirve')
    }
    else{
        console.log('no es valida la fecha xd')
    }

})

router.get('/verCita/:cedula/:id', async (req, res) => {
    const { cedula, id } = req.params;
    console.log(cedula, id);
    const cita = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA, C.OBSERVACIONES FROM PACIENTES P, CITAS C WHERE C.IDCITANUEVA = ? AND P.CEDULA = ?', [id, cedula]);
    validar.arreglarVista(cita);
    res.render('citas/verCita', { cita: cita[0] });
});

router.get('/editarCita/:cedula/:id', async (req, res) => {
    const { cedula, id } = req.params;
    console.log(cedula, id);
    const cita = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA, C.OBSERVACIONES FROM PACIENTES P, CITAS C WHERE C.IDCITANUEVA = ? AND P.CEDULA = ?', [id, cedula])
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
    console.log(cita, 'la cita actualizada');
    res.redirect('/citas');
})

router.get('/borrarCita/:cita', async (req, res) => {
    const { cita } = req.params;
    console.log(cita);
    const citas = await pool.query('SELECT * FROM CITAS WHERE IDCITANUEVA = ?', [cita])
    console.log(citas);
    res.render('citas/borrarCita', { citas: citas[0] })
});

router.post('/borrarCita/:idcitanueva', async (req, res) => {
    const idcitanueva = req.params;
    console.log(idcitanueva);

    await pool.query('DELETE FROM CITAS WHERE IDCITANUEVA = ?', [idcitanueva])
    console.log('ya se debio eliminar')
    res.redirect('/citas');
})


module.exports = router;