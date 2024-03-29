const express = require('express');
const router = express.Router();
const pool = require('../basedatos');
const validar = require('../validation/citas');

router.get('/', async (req, res) => {
    const citas = await pool.query('SELECT P.PRIMERNOMBRE, P.APELLIDOPATERNO, P.CEDULA, P.TELEFONO, C.IDCITANUEVA, C.FECHA, C.HORA, C.OBSERVACIONES FROM PACIENTES P, CITAS C WHERE P.CEDULA = C.CEDULA ORDER BY FECHA, HORA ASC;',);
    //console.log(citas);
    validar.arreglarVista(citas)
    res.render('citas/citas', { citas });
});

router.get('/nuevaCita', async (req, res) => {
    res.render('citas/nuevaCita');
});

router.get('/agendarCita/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    console.log(paciente);
    res.render('citas/agendarCita', { paciente: paciente[0] });
});

function arreglarFecha(string) {
    var fech = string.split('/');
    return fech[0];
}

router.post('/agendarCita/:cedula', async (req, res) => {
    const { cedula } = req.params;
    var ruta = '/citas/agendarCita/' + cedula;
    //console.log(cedula);

    const citas = await pool.query('SELECT * FROM CITAS')

    const { fecha, hora, observaciones } = req.body;

    const nuevaCita = {
        cedula: cedula,
        fecha,
        hora,
        observaciones
    };

    /*await pool.query('INSERT INTO CITAS set ?', [nuevaCita])
    //console.log(nuevaCita);
    req.flash('exito', 'Cita agregada correctamente');
    res.redirect('/citas');*/

    //console.log(nuevaCita);

    if (validar.validarFecha(nuevaCita.fecha)) {

        var dato = nuevaCita.fecha;
        const date = arreglarFecha(dato);
        console.log(date);
        const hora = nuevaCita.hora + ':00'
        const existe = await pool.query('SELECT * FROM CITAS WHERE FECHA = ? AND HORA = ?', [date, hora])
        console.log(existe)

        if (existe != '') {
            const ruta = '/citas/agendarCita/' + cedula;
            req.flash('fallo', 'El horario se encuentra ocupado');
            res.redirect(ruta);
        }
        else {
            await pool.query('INSERT INTO CITAS set ?', [nuevaCita])
            //console.log(nuevaCita);
            req.flash('exito', 'Cita agendada correctamente');
            res.redirect('/citas')
        }


    }
    else {
        req.flash('fallo', 'Las fechas no son permitidas');
        res.redirect(ruta);
    }
});

router.post('/nuevaCita', async (req, res) => {
    const { cedula } = req.body;

    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula]);
    if (paciente != '') {
        res.render('citas/guardarCita', { paciente: paciente[0] })
    }
    else {
        req.flash('fallo', 'El paciente no existe. Intente de nuevo');
        res.redirect('/citas/nuevaCita');
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

router.post('/editarCita/:idcitanueva/:cedula', async (req, res) => {
    const { idcitanueva, cedula } = req.params;
    console.log(idcitanueva);
    const { fecha, hora, observaciones } = req.body;
    const cita = {
        fecha,
        hora,
        observaciones
    };

    if (validar.validarFecha(cita.fecha)) {
        await pool.query('UPDATE CITAS set ? WHERE IDCITANUEVA = ?', [cita, idcitanueva]);
        //console.log(cita, 'la cita actualizada');
        req.flash('exito', 'Cita actualizada!');
        res.redirect('/citas');
    }
    else {
        //console.log('esa fecha no es valida');
        var ruta = '/citas/editarCita/' + '' + idcitanueva + '/' + cedula
        req.flash('fallo', 'La cita no puede tomar esa fecha, intente de nuevo');
        res.redirect(ruta);
    }


})

router.get('/borrarCita/:cita', async (req, res) => {
    const { cita } = req.params;
    console.log(cita);
    const citas = await pool.query('SELECT * FROM CITAS WHERE IDCITANUEVA = ?', [cita]);
    validar.arreglarVista(citas)
    console.log(citas);
    res.render('citas/borrarCita', { citas: citas[0] })
});

router.post('/borrarCita/:idcitanueva', async (req, res) => {
    const { idcitanueva } = req.params;
    console.log(idcitanueva);
    if (1 == 1) {
        await pool.query('DELETE FROM CITAS WHERE IDCITANUEVA = ?', [idcitanueva]);
        req.flash('exito', 'Cita eliminada');
        res.redirect('/citas');
    }
});

router.post('/borrarcita/:idcitanueva', async (req, res) => {
    const { idcitanueva } = req.params;

    await pool.query('DELETE FROM CITAS WHERE IDCITANUEVA = ?', [idcitanueva]);

    req.flash('exito', 'Cita eliminada ');
    res.redirect('/citas');

});

router.get('/lista/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const citas = await pool.query('SELECT * FROM CITAS C, PACIENTES P WHERE C.CEDULA = P.CEDULA ORDER BY FECHA DESC');
    validar.arreglarVista(citas)
    res.render('citas/lista', { citas, cedula })
});


module.exports = router;