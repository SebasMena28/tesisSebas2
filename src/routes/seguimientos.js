const express = require('express');
const router = express.Router();
const passport = require('passport')
const pool = require('../basedatos');

router.get('/', (req, res) => {
    res.render('seguimientos/nuevoSeguimiento');
});


module.exports = router;