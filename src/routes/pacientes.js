const express = require('express');
const router = express.Router();


const pool = require('../basedatos'); //referencia a la conexion de la base de datos

//PARA EL CRUD
router.get('/nuevoPaciente', (req, res) => {
    res.render('pacientes/nuevoPaciente'); 
})

router.post('/nuevoPaciente', async (req, res)=>{
    //res.send('funciona xd ' + req.body.cedula);
    //console.log( req.body);

    const {cedula, apellidoPaterno, apellidoMaterno, primerNombre, segundoNombre, fechaNacimiento, genero, estadoCivil, ocupacion, religion} = req.body;
    const nuevoPaciente = {
        cedula,
        apellidoPaterno,
        apellidoMaterno, 
        primerNombre, 
        segundoNombre, 
        fechaNacimiento, 
        genero,
        estadoCivil,
        ocupacion,
        religion
    }; 

    //await es porque es una funcion asincrona
    await pool.query('INSERT INTO PACIENTES set ?', [nuevoPaciente]) //QUERY para insertar datos del objeto nuevoPaciente
    console.log(nuevoPaciente);
});


router.get('/', async (req, res) => {
    const pacientes = await pool.query('SELECT * FROM PACIENTES');
    res.render('pacientes/lista', {pacientes}); //renderizando y mando los pacientes registrados
})


module.exports = router;