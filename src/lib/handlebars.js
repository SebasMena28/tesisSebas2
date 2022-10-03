const { format, register } = require('timeago.js')

const helper = {};

register('es_ES', (number, index, total_sec) => [
    ['justo ahora', 'ahora mismo'],
    ['hace %s segundos', 'en %s segundos'],
    ['hace 1 minuto', 'en 1 minuto'],
    ['hace %s minutos', 'en %s minutos'],
    ['hace 1 hora', 'en 1 hora'],
    ['hace %s horas', 'in %s horas'],
    ['hace 1 dia', 'en 1 dia'],
    ['hace %s dias', 'en %s dias'],
    ['hace 1 semana', 'en 1 semana'],
    ['hace %s semanas', 'en %s semanas'],
    ['1 mes', '1 mes'],
    ['%s meses', '%s meses'],
    ['1 año', '1 año'],
    ['%s años', '%s años']
][index]);

helper.tiempo = (timestamp) => {
    return format(timestamp, 'es_ES')
}

module.exports = helper;

//const timeago = timestamp => format(timestamp, 'es_ES');
//console.log(timeago('2019-11-15'));
