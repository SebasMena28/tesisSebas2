//ARCHIVO PARA ALMACENAR RUTAS
const express = require('express')
const router = express.Router(); //router es un metodo de express

router.get('/', (req, res) => { //ruta inicial para el router
    //res.render('layouts/main'); 
    res.render('inicio/index');
}); 

module.exports = router;