const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/registro', (req, res) =>{
    res.render('logeo/registro');
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

router.post('/registro', passport.authenticate('registro', {
        successRedirect: '/perfil',
        failureRedirect: '/registro',
        failureFlash: true
}));

router.get('/perfil', (req, res) => {
    res.send('si se pudo burro')
})

module.exports = router;