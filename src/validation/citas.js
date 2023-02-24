const pool = require('../basedatos');
var fechahoy = new Date().toISOString().slice(0, 10);

function arreglarVista(objeto) {
    for (var i = 0; i < objeto.length; i++) {
        objeto[i].FECHA = objeto[i].FECHA.toLocaleDateString();
    }
}

function arreglarFecha(string) {
    var info = string.split('-').reverse().join('/');
    return info;
}

async function norepite(objeto1, objeto2) {
    var pasa = true;
    if (objeto1 == '') {
        console.log('todo bien')
    }
    else {
        /*console.log(objeto1[0].FECHA.toLocaleDateString());
        var dato = new Date(objeto2.fecha)
        console.log(dato.toLocaleDateString());
        console.log(objeto1[0].HORA);
        console.log(objeto2.hora);*/

        //console.log(arreglarFecha(objeto2.fecha));
        //objeto2.fecha = objeto2.fecha.toLocaleDateString();

        var dato = new Date(objeto2.fecha);

        const existe = pool.query('SELECT * FROM CITAS WHERE ? NOT IN (SELECT FECHA FROM CITAS) AND ? NOT IN (SELECT HORA FROM CITAS);', [dato.toLocaleDateString(), objeto2.hora])

        if (existe != ''){
            pasa = true;
        }
        else{
            pasa = false;
        }

        console.log(existe);
        /*for(var i=0; i<objeto1.length; i++){
            objeto1[i].FECHA = objeto1[i].FECHA.toLocaleDateString();
            if(objeto1[i].FECHA == dato.toLocaleDateString() && objeto1[i].HORA == objeto2.hora){
                pasa = false;
            }
            console.log(objeto1[i].FECHA == dato.toLocaleDateString());
            console.log(objeto1[i].HORA == objeto2.hora);
        }*/
    }
    return pasa;
}


function validarFecha(fecha) {
    return (Date.parse(fechahoy) < Date.parse(fecha))
}

module.exports = {
    validarFecha,
    arreglarVista,
    norepite
}