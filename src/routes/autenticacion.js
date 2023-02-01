const express = require('express');
const router = express.Router();
const passport = require('passport')
const pool = require('../basedatos');

router.get('/registro', (req, res) => {
    res.render('logeo/inicioSesion');
});

router.post('/autenticacion/inicio', async (req, res) => {
    //const { usuario, contrasenia} = req.params;

    const iniciar = {
        usuario: req.body.usuario,
        contrasenia: req.body.contrasenia
    }

    const existe = await pool.query('SELECT * FROM USUARIOS WHERE NOMBREUSUARIO = ? AND PASS = ?;', [iniciar.usuario, iniciar.contrasenia]);

    //console.log(existe);
    if (existe != '') {
        //res.render('layouts/main', { iniciar });
        req.flash('exito', 'Bienvenida Psc. Cintia Morales')
        res.redirect('/pacientes')
    }
    else {
        req.flash('fallo', 'El usuaio no existe, cree uno o verifique que los datos ingresados sean los correctos')
        res.redirect('/');
    }
});

router.get('/autenticacion/registro', (req, res) => {
    res.render('logeo/registro');
})

router.post('/autenticacion/registro', async (req, res) => {

    const nuevoUsuario = {
        nombreusuario: req.body.usuario,
        correo: req.body.correo,
        pass: req.body.contrasenia
    }
    console.log(nuevoUsuario);
    res.render('logeo/inicioSesion');

    const existe = await pool.query('SELECT * FROM USUARIOS WHERE NOMBREUSUARIO = ? ', [nuevoUsuario.nombreusuario]);

    console.log(existe)
    if (existe != '') {
        req.flash('fallo', 'Este nombre de usuario ya existe. Intente de nuevo')
        res.redirect('/autenticacion/registro');
    }
    else {
        console.log('este usuario creado!');
        await pool.query('INSERT INTO USUARIOS set ?', [nuevoUsuario]);
        res.redirect('/pacientes');
    }


    //console.log(paciente);
})

/*router.post('/registro', (req, res) => {
    //console.log(req.body)
    passport.authenticate('registro', {
        successRedirect: '/perfil',
        failureRedirect: '/registro',
        failureFlash: true
    });
    res.send('recibido siiiiiiiuuuuuuuuuuuu');
})*/

/*router.post('/registro', passport.authenticate('registro', {
        successRedirect: '/perfil',
        failureRedirect: '/registro',
        failureFlash: true
}));*/

router.get('/perfil', (req, res) => {
    res.send('si se pudo burro')
})

module.exports = router;