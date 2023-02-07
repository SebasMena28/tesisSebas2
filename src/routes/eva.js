const express = require('express');
const router = express.Router();
const pool = require('../basedatos');
const validar = require('../validation/eval');

//const tiempoTranscurrido = Date.now();
//const hoy = new Date(tiempoTranscurrido);
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
var fechahoy = new Date().toISOString().slice(0, 10);

var content = '';
var datosP, descripcionP;

router.get('/', (req, res) => {
    res.render('eval/lista');
});

router.get('/NuevaEvaluacion/:cedula', async (req, res) => {
    const { cedula } = req.params;
    console.log(cedula);
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/NuevaEvaluacion', { paciente: paciente[0] });
})

router.post('/nuevaEvaluacion/:cedula', async (req, res) => {
    const { cedula } = req.params;

    const { tecnica, descripcion, resultados } = req.body;

    const nuevaEvaluacion = {
        cedula: cedula,
        fecha: fechahoy,
        tecnica,
        descripcion,
        resultados
    };

    await pool.query('INSERT INTO EVALUACIONPSICOLOGICA set ?', [nuevaEvaluacion])
    console.log(nuevaEvaluacion);
    req.flash('exito', 'Evaluacion agregada')
    res.redirect('/pacientes')
})

router.get('/evaluacionesPaciente/:cedula', async (req, res) => {
    const { cedula } = req.params;
    console.log(cedula);
    const evaluacion = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA WHERE CEDULA = ?', [cedula])
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    validar.arreglarVista(evaluacion)
    res.render('eval/evaluacionesPaciente', { evaluacion, paciente: paciente[0] });
});

router.get('/verEvaluacion/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const evaluacion = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA WHERE ID = ?', [id])
    validar.arreglarVista(evaluacion)
    res.render('eval/verEvaluacion', { evaluacion: evaluacion[0] });
});

router.get('/nuevoCertificado/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const evaluacion = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/nuevoCertificado', { evaluacion: evaluacion[0] });
});

router.get('/certificado/:cedula', async (req, res) => {
    const { cedula } = req.params;
    //const {descripcion} = req.body.descripcion;
    //console.log(descripcion);
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/certificado', { paciente: paciente[0] });
});

router.post('/nuevoCertificado/:cedula', async (req, res) => {
    const { cedula } = req.params;
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    const pdf = require('html-pdf');
    datosP = paciente[0];
    descripcionP = req.body.descripcion
    var today = new Date();

    // obtener la fecha y la hora
    var now = today.toLocaleString();
    console.log(now);

    content = `
    <h1>Certificado de salud mental psicológica</h1>
    <p>Que el/la paciente .... con cedula de identidad .... es gay</p>
    `;

    /*pdf.create(content).toFile('./html-pdf.pdf', function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });*/

    res.render('eval/certificado', { paciente: paciente[0], datos: req.body, fecha: now });
});

router.post('/generarCertificado', async (req, res) => {
    const pdf = require('html-pdf');

    var datos = datosP, descripcion = descripcionP;
    cedula = datos.CEDULA;
    var today = new Date();

    // obtener la fecha y la hora
    var fecha = today.toLocaleString();

    const certificado = {
        cedula: datos.CEDULA,
        descripcion: descripcion,
        fecha: fechahoy
    }

    await pool.query('INSERT INTO CERTIFICADO set ?', [certificado])

    const content = `
    <!DOCTYPE html>
    <html lang="en">

    <head>

    </head>

    <body>
        <style>
            .container {
                display: grid;
                place-items: center;
            }
        </style>
        <div class="container p-1 mb-5">
            <div class="row">
                <div class="col-md-12 mx-auto">

                    <div class="card w-100 mt-5">
                        <div class="card-body">
                            <div class="container p-4" id="todo">
                                <div class="col-2 p-2">
                                    <div class="text-center">
                                        <img src="https://pbs.twimg.com/profile_images/1158408311932432384/bjvit15u_400x400.jpg"
                                            height="100" width="100">
                                    </div>
                                </div>
                                <div>
                                    <h2 class="title text-center">
                                        CERTIFICADO DE SALUD MENTAL PSICOLOGICA
                                    </h2>
                                </div>


                                <h3 class="text-center">
                                    El que suscribe la psicológica Cintia Morales, personal psicológico de la clínica
                                    OCUMEDIC
                                </h3>

                                <br>

                                <h3 class="text-center">
                                    HACE CONSTAR QUE:
                                </h3>

                                <br>

                                <h3 class="p-5">
                                    El/la paciente <strong>` + datos.APELLIDOPATERNO + ` ` + datos.APELLIDOMATERNO + ` ` +
                                        datos.PRIMERNOMBRE + ` ` + datos.SEGUNDONOMBRE + `<strong> con cédula de identidad
                                            <strong>`+ datos.CEDULA + `</strong>, ha sido evaluada, presentando a la fecha:
                                            <strong>`+ descripcion + `</strong>
                                </h3>

                                <br>
                                <br>

                                <div class="text-center">
                                    <h3 class="text-center">
                                        <strong>Riobamba, ` + fecha + `</strong>
                                    </h3>
                                </div>

                                <br>
                                <br>
                                <br>

                                <footer>
                                    <div class="container p-3">
                                        <div class="row text-center text-black">
                                            <div class="col ml-auto">
                                                <h6>OCUMEDIC - Olmedo y Pichinca - Riobamba - Tlf: 098 383 4551</h6>
                                            </div>
                                        </div>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </body>
`;

    pdf.create(content).toFile('./certificado.pdf', function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    req.flash('exito', 'Certificado generado exitosamente!');
    res.redirect('/pacientes');
});

router.get('/verCertificado', async (req, res) => {
    const certificado = await pool.query('SELECT * FROM CERTIFICADO C, PACIENTES P WHERE C.CEDULA = P.CEDULA ')
    //validar.arreglarVista(certificado)
    res.render('eval/verCertificados', { certificado });
});

router.get('/verCertificado2/:id/:cedula', async (req, res) => {
    //const {idcertificado, cedula} = req.params;
    const idcertificado = req.params.id;
    const cedula = req.params.cedula;
    const certificado = await pool.query('SELECT * FROM CERTIFICADO WHERE IDCERTIFICADO = ?', [idcertificado])
    console.log(idcertificado, cedula)
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/verCertificado2', { certificado: certificado[0], paciente: paciente[0]});
});

router.post('/buscar', async (req, res) => {

    const { dato } = req.body;
    //console.log(dato);
    const certificado = await pool.query('SELECT * FROM CERTIFICADO WHERE CEDULA = ?', [dato])


    res.render('eval/busqueda', { certificado });
});

module.exports = router