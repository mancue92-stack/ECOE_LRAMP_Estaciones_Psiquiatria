'use strict';

// Filas y formatos de exportación a partir de las evaluaciones del backend. Requiere Estado (js/estado.js).
var Reporte = (function () {
    var CABECERA = ['Ronda', 'Pareja', 'Caso', 'Alumno evaluado', 'Evaluador', 'Ítems marcados', 'Porcentaje', 'Comentario'];

    function esc(t) {
        return String(t).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function filas(evals, estado, stations, totalItems) {
        return evals.slice().sort(function (a, b) {
            return a.ronda - b.ronda || a.pareja.localeCompare(b.pareja, 'es', { numeric: true });
        }).map(function (e) {
            var st = stations.filter(function (s) { return s.id === e.caso; })[0];
            return [
                e.ronda, e.pareja, st ? st.title : e.caso, Estado.nombreDe(estado, e.evaluado), e.evaluador,
                e.marcas.filter(Boolean).length + '/' + totalItems, e.puntaje + '%', e.comentario
            ];
        });
    }

    function celdaCSV(v) {
        var t = String(v);
        return /[",\n\r]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
    }

    function aCSV(rows) {
        return [CABECERA].concat(rows).map(function (f) { return f.map(celdaCSV).join(','); }).join('\n') + '\n';
    }

    function aTablaHTML(rows) {
        var encabezado = '<tr>' + CABECERA.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
        var cuerpo = rows.map(function (f) {
            return '<tr>' + f.map(function (v) { return '<td>' + esc(v) + '</td>'; }).join('') + '</tr>';
        }).join('');
        return '<html><head><meta charset="UTF-8"></head><body><table border="1" cellpadding="4">' +
            encabezado + cuerpo + '</table></body></html>';
    }

    return { CABECERA: CABECERA, filas: filas, aCSV: aCSV, aTablaHTML: aTablaHTML };
})();

if (typeof module !== 'undefined') module.exports = Reporte;
