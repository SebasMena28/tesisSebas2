var fechahoy = new Date().toISOString().slice(0, 10);

function arreglarVista(objeto){
    for(var i=0; i<objeto.length; i++){
        objeto[i].PROXIMACITA = objeto[i].PROXIMACITA.toLocaleDateString();
        objeto[i].FECHA = objeto[i].FECHA.toLocaleDateString();
    }
}

function validarFecha(fecha) {
    console.log(Date.parse(fechahoy), Date.parse(fecha))
    return (Date.parse(fechahoy) <= Date.parse(fecha))
}

module.exports = {
    validarFecha,
    arreglarVista
}