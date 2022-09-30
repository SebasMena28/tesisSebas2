const express = require('express');
const morgan = require('morgan');
const path = require('path');
const  {engine} = require('express-handlebars');

//INICIALIZACIONES
const app = express();

//SETTINGS -- CONFIGURACIONES PARA SERVIDOR
app.set('port', process.env.PORT || 4000);  //para desplegar en un servidor real, es una buena practica. 
    //Revisa si hay un puerto libre y si no toma el puerto 4000

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
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));//para aceptar desde los formularios los datos que envia los usuarios
    //creo que con esto no acepta imagenes
app.use(express.json());

//VARIABLES GLOBALES
app.use((req, res, next) => {

    next(); //toma la informacion del usuario (req), toma la respuesta del servidor (res) y toma una funcion para seguir con el resto del codigo
})

//RUTAS (url para el servidor)
app.use(require('./routes'))
app.use(require('./routes/autenticacion'))
app.use(require('./routes/index'))
app.use( '/pacientes', require('./routes/pacientes')) //si yo quiero todos los pacientes, debo usar prefijo /pacientes

//ARCHIVOS PUBLICOS
app.use(express.static(path.join(__dirname, 'public')));



//PARA EMPEZAR EL SERVIDOR
app.listen(app.get('port'), () =>{
    console.log('ESTA VIIIVOOOOOO!!!! ' + app.get('port'));
});


