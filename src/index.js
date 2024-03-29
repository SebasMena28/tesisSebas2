const express = require('express');
const morgan = require('morgan');
const path = require('path');
const  {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const mysqlstore = require('express-mysql-session');
const {database} = require('./claves');
const passport = require('passport');
const flash = require('connect-flash'); 
const session = require('express-session');



/*module.exports = {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT,
}*/


//INICIALIZACIONES
const app = express();
require('./lib/passport');

//SETTINGS -- CONFIGURACIONES PARA SERVIDOR
app.set('port', process.env.PORT || 4000);  //para desplegar en un servidor real, es una buena practica. 

app.set('views', path.join(__dirname, '/views'));//indico donde esta la carpeta views con dirname

app.engine('.hbs', engine({ //'.hbs' es el nombre del engine y en el engine le doy un objeto
    defaultLayout: 'main', //nombre de la plantilla principal (en views tengo el archivo main.hbs)
    layoutsDir: path.join(app.get('views'), 'layouts'), //unir directorios, une la carpeta views con layout, le digo donde esta layout y lo une con views
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs', //indico la extension del archivo
    helpers: require('./lib/handlebars')
}));//con esto el motor esta configurador

app.set('view engine', '.hbs');



//MIDDLEWARS -- FUNCIONES A EJECUTARSE CADA QUE UN USUARIO PIDA UNA PETICION
app.use(session({
    secret: 'session',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));//para aceptar desde los formularios los datos que envia los usuarios
app.use(passport.initialize());
app.use(passport.session());



// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/////

//VARIABLES GLOBALES
app.use((req, res, next) => {
    res.locals.exito = req.flash('exito'); //para hacer disponible el mensaje en las vistas
    res.locals.fallo = req.flash('fallo');
    next(); //toma la informacion del usuario (req), toma la respuesta del servidor (res) y toma una funcion para seguir con el resto del codigo
})

//RUTAS (url para el servidor)
app.use(require('./routes'));
app.use(require('./routes/autenticacion'));
app.use(require('./routes/index'));
app.use( '/pacientes', require('./routes/pacientes')); //si yo quiero todos los pacientes, debo usar prefijo /pacientes
app.use( '/evaluaciones', require('./routes/eva'));
app.use( '/citas', require('./routes/citas'));
app.use( '/seguimientos', require('./routes/seguimientos'));

//ARCHIVOS PUBLICOS
app.use(express.static(path.join(__dirname, 'public')));



//PARA EMPEZAR EL SERVIDOR
app.listen(app.get('port'), () =>{
    console.log('Software levantado en el puerto: ' + app.get('port'));
});


