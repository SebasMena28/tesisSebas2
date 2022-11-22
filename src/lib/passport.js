//para el manejo de usuario, es una buena practica (forma mas profesional)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use('registro', new LocalStrategy({
    usuario: 'usuario',
    contrasenia: 'password',
    passReqToCallback: true,
}, async (req, user, contrasenia, done) => {
    console.log(req.body);
    res.send('se pudo');
    const usuario = {
        user,
        contrasenia
    }
}));

/*passport.serializeUser((usuario, done) => {

})*/