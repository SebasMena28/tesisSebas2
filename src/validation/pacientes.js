//SELECT * FROM pacientes WHERE (PRIMERNOMBRE+' '+APELLIDOPATERNO) LIKE 'Andres Mena'

var error = '';

function arreglarVista(objeto){
    for(var i=0; i<objeto.length; i++){
        objeto[i].PROXIMACITA = objeto[i].PROXIMACITA.toLocaleDateString();
        objeto[i].FECHA = objeto[i].FECHA.toLocaleDateString();
    }
}

///FUNCIONES PARA VALIDAR CAMPOS
function validarCedula(cedula) {
    if (cedula.length == 10) {

        //Obtenemos el digito de la region que sonlos dos primeros digitos
        var digito_region = cedula.substring(0, 2);

        //Pregunto si la region existe ecuador se divide en 24 regiones
        if (digito_region >= 1 && digito_region <= 24) {

            // Extraigo el ultimo digito
            var ultimo_digito = cedula.substring(9, 10);

            //Agrupo todos los pares y los sumo
            var pares = parseInt(cedula.substring(1, 2)) + parseInt(cedula.substring(3, 4)) + parseInt(cedula.substring(5, 6)) + parseInt(cedula.substring(7, 8));

            //Agrupo los impares, los multiplico por un factor de 2, si la resultante es > que 9 le restamos el 9 a la resultante
            var numero1 = cedula.substring(0, 1);
            var numero1 = (numero1 * 2);
            if (numero1 > 9) { var numero1 = (numero1 - 9); }

            var numero3 = cedula.substring(2, 3);
            var numero3 = (numero3 * 2);
            if (numero3 > 9) { var numero3 = (numero3 - 9); }

            var numero5 = cedula.substring(4, 5);
            var numero5 = (numero5 * 2);
            if (numero5 > 9) { var numero5 = (numero5 - 9); }

            var numero7 = cedula.substring(6, 7);
            var numero7 = (numero7 * 2);
            if (numero7 > 9) { var numero7 = (numero7 - 9); }

            var numero9 = cedula.substring(8, 9);
            var numero9 = (numero9 * 2);
            if (numero9 > 9) { var numero9 = (numero9 - 9); }

            var impares = numero1 + numero3 + numero5 + numero7 + numero9;

            //Suma total
            var suma_total = (pares + impares);

            //extraemos el primero digito
            var primer_digito_suma = String(suma_total).substring(0, 1);

            //Obtenemos la decena inmediata
            var decena = (parseInt(primer_digito_suma) + 1) * 10;

            //Obtenemos la resta de la decena inmediata - la suma_total esto nos da el digito validador
            var digito_validador = decena - suma_total;

            //Si el digito validador es = a 10 toma el valor de 0
            if (digito_validador == 10)
                var digito_validador = 0;

            //Validamos que el digito validador sea igual al de la cedula
            if (digito_validador == ultimo_digito) {
                return true;
            } else {
                error += 'la cedula:' + cedula + ' es incorrecta ';
                return false;
            }

        } else {
            //si la region no pertenece
            error += 'Esta cedula no pertenece a ninguna region ';
            return false;
        }
    } else {
        //i la cedula tiene mas o menos de 10 digitos
        error += 'Esta cedula tiene menos de 10 Digitos ';
        return false;
    }
}



function validarNombre1(nombre) {
    if (/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre) && nombre != "" && nombre.length > 1) {
        return true;
    }
    else {
        if (nombre == "") {
            error += 'El primer nombre no puede quedar vacio. \n';
        }
        else if (nombre.length < 2) {
            error += 'El primer nombre no puede ser ' + nombre + '. Se necesita una longitud mayor a un caracter. \n'
        }
        else {
            error += 'El primer nombre no puede ser ' + nombre + '. \n'
        }
        return false;
    }
}

function validarNombre2(nombre) {
    if (/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre) && nombre != "" && nombre.length > 1) {
        return true;
    }
    else {
        if (nombre == "") {
            error += 'El segundo nombre no puede quedar vacio. \n';
        }
        else if (nombre.length < 2) {
            error += 'El segundo nombre no puede ser ' + nombre + '. Se necesita una longitud mayor a un caracter. \n'
        }
        else {
            error += 'El segundo nombre no puede ser ' + nombre + '. \n'
        }
        return false;
    }
}

function validarApe1(nombre) {
    if (/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre) && nombre != "" && nombre.length > 1) {
        return true;
    }
    else {
        if (nombre == "") {
            error += 'El apellido paterno no puede quedar vacio. \n';
        }
        else if (nombre.length < 2) {
            error += 'El apellido paterno no puede ser ' + nombre + '. Se necesita una longitud mayor a un caracter. \n'
        }
        else {
            error += 'El apellido paterno no puede ser ' + nombre + '. \n'
        }
        return false;
    }
}

function validarApe2(nombre) {
    if (/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre) && nombre != "" && nombre.length > 1) {
        return true;
    }
    else {
        if (nombre == "") {
            error += 'El apellido materno no puede quedar vacio. \n';
        }
        else if (nombre.length < 2) {
            error += 'El apellido materno no puede ser ' + nombre + '. Se necesita una longitud mayor a un caracter. \n'
        }
        else {
            error += 'El apellido materno no puede ser ' + nombre + '. \n'
        }
        return false;
    }
}

function validarEmail(email) {
    if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) && email != "") {
        return true;
    }
    else {
        if (email == "") {
            error += 'El correo no puede quedar vacio. \n';
        }
        else {
            error += 'El correo no puede ser ' + email + '. \n'
        }
        return false;
    }
}

function validarFecha(fecha) {
    return true;
}

function validarTelefono(telefono) {
    if(!(/^\d{9}$/.test(telefono)) && telefono.length == 12){
        return true;
    }
    else {
        error += 'El telefono no es válido'
        return false;
    }
}

function enviarMensaje(){
    return error;
}

module.exports = {
    validarCedula,
    validarNombre1,
    validarNombre2,
    validarApe1,
    validarApe2,
    validarEmail,
    validarFecha,
    validarTelefono,
    arreglarVista,
    enviarMensaje
}