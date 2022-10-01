const express = require('express');
const router = express.Router();

const pool = require('../basedatos'); //referencia a la conexion de la base de datos

//PARA EL CRUD
router.get('/nuevoPaciente', (req, res) => {
    res.render('pacientes/nuevoPaciente'); 
})

router.post('/nuevoPaciente', (req, res)=>{
    res.send('funciona xd');
    console.log(req.body);
    const {cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil, ocupacion, religion} = req.body;
    const nuevoPaciente = {
        cedula: "hola",
        apellidoPaterno,
        apellidoMaterno, 
        primerNombre, 
        segundoNombre, 
        fechaNacimiento, 
        genero,
        estadoCivil,
        ocupacion,
        religion
    }; //no se porque chuchas no funciona
    console.log(nuevoPaciente);
})

module.exports = router;