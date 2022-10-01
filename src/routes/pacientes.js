const express = require('express');
const router = express.Router();

const pool = require('../basedatos'); //referencia a la conexion de la base de datos

//PARA EL CRUD
router.get('/nuevoPaciente', (req, res) => {
    res.render('pacientes/nuevoPaciente'); 
})

router.post('/nuevoPaciente', (req, res)=>{
    res.send('funciona xd');
})

module.exports = router;