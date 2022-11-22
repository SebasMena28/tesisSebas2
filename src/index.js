const express = require('express');
const morgan = require('morgan');
const path = require('path');
const  {engine} = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash'); //modulo para enviar mensajes por vistas
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const {database} = require('./claves');
const passport = require('passport');


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
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash()); //para usar el modulo
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
    app.locals.guardado = req.flash('guardado'); //para hacer disponible el mensaje en las vistas
    next(); //toma la informacion del usuario (req), toma la respuesta del servidor (res) y toma una funcion para seguir con el resto del codigo
})

//RUTAS (url para el servidor)
app.use(require('./routes'));
app.use(require('./routes/autenticacion'));
app.use(require('./routes/citas'));
app.use(require('./routes/eva'));
app.use(require('./routes/index'));
app.use( '/pacientes', require('./routes/pacientes')); //si yo quiero todos los pacientes, debo usar prefijo /pacientes
app.use( '/evaluaciones', require('./routes/evaluaciones'));

//ARCHIVOS PUBLICOS
app.use(express.static(path.join(__dirname, 'public')));



//PARA EMPEZAR EL SERVIDOR
app.listen(app.get('port'), () =>{
    console.log('ESTA VIIIVOOOOOO!!!! ' + app.get('port'));
});


