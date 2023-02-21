const express = require('express');
const router = express.Router();
const pool = require('../basedatos');
const validar = require('../validation/eval');
const {CreateOptions} = require('html-pdf')

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
    const evaluacion = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA E, PACIENTES P WHERE E.ID = ? AND P.CEDULA = E.CEDULA', [id]);
    console.log(evaluacion);
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
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCUMEDIC - Psicologia</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    <link rel='stylesheet' href=''>
</head>

<body>

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
                            <br>
                            <div class="text-center">
                                <h2 class="texto">
                                    CERTIFICADO DE SALUD MENTAL PSICOLOGICA
                                </h2>
                            </div>

                            <div class="text-center">
                                <h3 class="texto">
                                    El que suscribe la psicológica Cintia Morales, personal psicológico de la clínica
                                    OCUMEDIC
                                </h3>
                            </div>
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


    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
        crossorigin="anonymous"></script>

</body>

</html>
`;

    pdf.create(content).toFile('C:\\Users\\Usuario\\Desktop\\certificado-'+datos.CEDULA+'.pdf', function (err, res) {
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
    validar.arreglarVista(certificado)
    res.render('eval/verCertificados', { certificado });
});

router.get('/verCertificado2/:id/:cedula', async (req, res) => {
    //const {idcertificado, cedula} = req.params;
    const idcertificado = req.params.id;
    const cedula = req.params.cedula;
    const certificado = await pool.query('SELECT * FROM CERTIFICADO WHERE IDCERTIFICADO = ?', [idcertificado])
    validar.arreglarVista(certificado)
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/verCertificado2', { certificado: certificado[0], paciente: paciente[0]});
});

router.post('/buscar', async (req, res) => {

    const { dato } = req.body;
    const certificado = await pool.query('SELECT * FROM CERTIFICADO C, PACIENTES P WHERE C.CEDULA = ? AND P.CEDULA = C.CEDULA', [dato])
    validar.arreglarVista(certificado)
    res.render('eval/busqueda', { certificado });
});

router.get('/nCertificado', async (req, res) => {
    //const certificado = await pool.query('SELECT * FROM CERTIFICADO C, PACIENTES P WHERE C.CEDULA = P.CEDULA ')
    //validar.arreglarVista(certificado)
    res.render('eval/buscarPacCer');
});

router.post('/nCertificado', async (req, res) => {
    const { cedula } = req.body;

    const evaluacion = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])

    if (evaluacion != '') {
        res.render('eval/nuevoCertificado', { evaluacion: evaluacion[0] });
    }
    else {
        req.flash('fallo', 'El paciente no existe. Intente de nuevo');
        res.redirect('/evaluaciones/ncertificado');
    }
});


router.post('/repetirCertificado/:idcertificado', async (req, res) => {

    const { idcertificado } = req.params;
    console.log(idcertificado);
    const pdf = require('html-pdf');

    var datos = await pool.query('SELECT P.CEDULA, P.PRIMERNOMBRE, P.SEGUNDONOMBRE, P.APELLIDOPATERNO, P.APELLIDOMATERNO, C.DESCRIPCION, C.FECHA FROM CERTIFICADO C, PACIENTES P WHERE C.IDCERTIFICADO = ? AND P.CEDULA = C.CEDULA', [idcertificado])

    validar.arreglarVista(datos);
    const content = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OCUMEDIC - Psicologia</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
    <link rel='stylesheet' href=''>
</head>

<body>

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
                            <br>
                            <div class="text-center">
                                <h2 class="texto">
                                    CERTIFICADO DE SALUD MENTAL PSICOLOGICA
                                </h2>
                            </div>

                            <div class="text-center">
                                <h3 class="texto">
                                    El que suscribe la psicológica Cintia Morales, personal psicológico de la clínica
                                    OCUMEDIC
                                </h3>
                            </div>
                            <br>

                            <h3 class="text-center">
                                HACE CONSTAR QUE:
                            </h3>

                            <br>

                            <h3 class="p-5">
                                El/la paciente <strong>` + datos[0].APELLIDOPATERNO + ` ` + datos[0].APELLIDOMATERNO + ` ` +
                                    datos[0].PRIMERNOMBRE + ` ` + datos[0].SEGUNDONOMBRE + `<strong> con cédula de identidad
                                        <strong>`+ datos[0].CEDULA + `</strong>, ha sido evaluada, presentando a la fecha:
                                        <strong>`+ datos[0].DESCRIPCION + `</strong>
                            </h3>

                            <br>
                            <br>

                            <div class="text-center">
                                <h3 class="text-center">
                                    <strong>Riobamba, ` + datos[0].FECHA + `</strong>
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


    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
        crossorigin="anonymous"></script>

</body>

</html>
`;

    pdf.create(content).toFile('C:\\Users\\Usuario\\Desktop\\certificado-'+datos[0].CEDULA+'.pdf', function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    });

    req.flash('exito', 'Certificado generado exitosamente!');
    res.redirect('/pacientes');
});

router.get('/borrarCertificado/:id/:cedula', async (req, res) => {
    const idcertificado = req.params.id;
    const cedula = req.params.cedula;
    const certificado = await pool.query('SELECT * FROM CERTIFICADO WHERE IDCERTIFICADO = ?', [idcertificado])
    validar.arreglarVista(certificado)
    const paciente = await pool.query('SELECT * FROM PACIENTES WHERE CEDULA = ?', [cedula])
    res.render('eval/borrarCertificado', { certificado: certificado[0], paciente: paciente[0]});
});

router.post('/borrarCertificado/:id', async (req, res) => {
    const idcertificado = req.params.id;
    await pool.query('DELETE FROM CERTIFICADO WHERE IDCERTIFICADO = ?', [idcertificado]);
    req.flash('exito', 'Certificado eliminado correctamente');
    res.redirect('/evaluaciones/verCertificado');
});

router.get('/borrarEvaluacion/:id', async (req, res) => {
    const id = req.params.id;
    const evaluacion = await pool.query('SELECT * FROM EVALUACIONPSICOLOGICA WHERE ID = ?', [id])
    validar.arreglarVista(evaluacion);
    res.render('eval/borrarEvaluacion', { evaluacion: evaluacion[0]});
});

router.post('/borrarEvaluacion/:id/:cedula', async (req, res) => {
    const id = req.params.id;
    const cedula = req.params.cedula;
    await pool.query('DELETE FROM EVALUACIONPSICOLOGICA WHERE ID = ?', [id]);
    req.flash('exito', 'Evaluacion eliminada correctamente');
    res.redirect('/evaluaciones/evaluacionesPaciente/'+cedula);
});




module.exports = router