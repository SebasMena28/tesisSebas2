const express = require('express');
const router = express.Router();
const passport = require('passport')
const pool = require('../basedatos');

router.get('/registro', (req, res) =>{
    res.render('logeo/inicioSesion');
});

router.post('/autenticacion/inicio', async  (req, res) =>{
    //const { usuario, contrasenia} = req.params;

    const iniciar = {
        usuario : req.body.usuario, 
        contrasenia : req.body.contrasenia
    }

    const existe = await pool.query('SELECT * FROM USUARIOS WHERE NOMBREUSUARIO = ? AND PASS = ?;', [iniciar.usuario, iniciar.contrasenia]);

    //console.log(existe);
    if (existe != '') {
        res.render('layouts/main',{ iniciar });
    }
    else{
        res.render('logeo/inicioSesion');
        console.log('no hay, no existe');
    }
});

router.get('/autenticacion/registro', (req, res) =>{
    res.render('logeo/registro');
})

router.post('/autenticacion/registro', (req, res) =>{
    res.render('layouts/main');
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