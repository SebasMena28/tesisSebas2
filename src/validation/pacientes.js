
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
                console.log('la cedula:' + cedula + ' es correcta');
                return true;
            } else {
                console.log('la cedula:' + cedula + ' es incorrecta');
                return false;
            }

        } else {
            //si la region no pertenece
            console.log('Esta cedula no pertenece a ninguna region');
            return false;
        }
    } else {
        //i la cedula tiene mas o menos de 10 digitos
        console.log('Esta cedula tiene menos de 10 Digitos');
        return false;
    }
}

/*

function validarNombre(nombre) {
    if (/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre) && nombre != "" && nombre.length > 1) {
        return true;
    }
    else {
        if (nombre == "") {
            error += 'El nombre no puede quedar vacio. \n';
        }
        else if (nombre.length < 2) {
            error += 'El nombre no puede ser ' + nombre + '. Se necesita una longitud mayor a un caracter. \n'
        }
        else {
            error += 'El nombre no puede ser ' + nombre + '. \n'
        }
        return false;
    }
}

function validarUsuario(usuario) {
    if (/^[a-zA-Z0-9\_\-]{4,16}$/.test(usuario) && usuario != "") {
        return true;
    }
    else {
        if (usuario == "") {
            error += 'El usuario no puede quedar vacio. \n';
        }
        else {
            error += 'El usuario no puede ser ' + usuario + '. \n'
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

function validarPass(pass) {
    if (/^.{4,12}$/.test(pass) && pass.length > 6) {
        return true;
    }
    else {
        if (pass == "") {
            error += 'La contraseña no puede quedar vacía. \n'
        }
        else if (pass.length < 7) {
            error += 'La contraseña no puede tomar ese valor! Esta de ser mayor a 6 dígitos. \n'
        }
        else {
            error += 'La contraseña no puede tomar ese valor. Intente de nuevo \n'
        }
        return false;
    }
}

function validarBarra(cod) {
    if (!isNaN(cod) && cod.length > 2) {
        return true;
    }
    else {
        if (cod == "") {
            error += 'El código de barra no puede quedar vacío. \n'
        }
        else if (cod.length < 3) {
            error += 'La código de barra debe ser mayor a 2 dígitos. \n'
        }
        else {
            error += 'El código de barra consta de solo números. \n'
        }
        return false;
    }
}

function validarVenta(cod) {
    if (Number.isInteger(cod)) {
        return true;
    }
    else {
        error += 'La venta solo se registra con números. \n'
        return false;
    }
}

function validarCompra(cod) {
    if (Number.isInteger(cod)) {
        return true;
    }
    else {
        error += 'La compra solo se registra con números. \n'
        return false;
    }
}

function validarStock(cod) {
    if (Number.isInteger(cod)) {
        return true;
    }
    else {
        error += 'El stock solo se registra con números. \n'
        return false;
    }
}

function validaciones(atributo, valor) {
    let pasa = true;
    switch (atributo) {
        case 'username':
            pasa = validarUsuario(valor);
            console.log('El valor de username es: ' + valor + ' ' + pasa);
            break;
        case 'nombre':
            pasa = validarNombre(valor);
            console.log('El valor de nombre es: ' + valor + ' ' + pasa);
            break;
        case 'email':
            pasa = validarEmail(valor);
            console.log('El valor de email es: ' + valor + ' ' + pasa);
            break;
        case 'password':
            pasa = validarPass(valor);
            console.log('El valor de password es: ' + valor + ' ' + pasa);

            break;
        case 'barra':
            pasa = validarBarra(valor);
            break;
        case 'venta':
            pasa = validarVenta(valor);
            break;
        case 'compra':
            pasa = validarCompra(valor);
            break;
        case 'stock_minimo':
            pasa = validarStock(valor);
            break;
    }
    return pasa;
}

function validar(objeto) {
    let atributos = Object.keys(objeto);
    let datos = Object.values(objeto)
    let aprovado = false;
    let confirmado = true;
    //console.log(atributos, datos);
    for (let i = 0; i < atributos.length; i++) {
        aprovado = validaciones(atributos[i], datos[i]);
        //console.log(atributos[i], datos[i], aprovado);
        if (!aprovado) confirmado = aprovado;
    }
    //console.log(atributos.length, datos.length);
    return confirmado;
}*/

module.exports = {
    validarCedula
}