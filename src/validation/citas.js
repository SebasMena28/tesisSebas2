var fechahoy = new Date().toISOString().slice(0, 10);

function arreglarVista(objeto){
    for(var i=0; i<objeto.length; i++){
        objeto[i].FECHA = objeto[i].FECHA.toLocaleDateString();
    }
}

function norepite(objeto1, objeto2){
    var pasa = true;
    objeto2.FECHA = objeto2.FECHA.toLocaleDateString();
    for(var i=0; i<objeto.length; i++){
        objeto1[i].FECHA = objeto1[i].FECHA.toLocaleDateString();
        if(objeto1[i].FECHA == objeto2.FECHA && objeto1[i].HORA == objeto2.HORA){
            pasa = false;
        }
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