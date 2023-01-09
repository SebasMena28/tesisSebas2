function arreglarVista(objeto){
    for(var i=0; i<objeto.length; i++){
        objeto[i].FECHA = objeto[i].FECHA.toLocaleDateString();
    }
}

module.exports = {
    arreglarVista
}