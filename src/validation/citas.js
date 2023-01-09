var fechahoy = new Date().toISOString().slice(0, 10);

function arreglarVista(objeto){
    for(var i=0; i<objeto.length; i++){
        objeto[i].FECHA = objeto[i].FECHA.toLocaleDateString();
    }
}


function validarFecha(fecha) {
    return (Date.parse(fechahoy) <= Date.parse(fecha))
}

module.exports = {
    validarFecha,
    arreglarVista
}