'use strict';

// Funciones puras sobre el estado público que devuelve el backend.
var Estado = (function () {
    var AYU_ID = 'AYU';

    function formatoMMSS(ms) {
        var seg = Math.max(0, Math.ceil(ms / 1000));
        var m = Math.floor(seg / 60);
        var s = seg % 60;
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    // offset = serverNow - Date.now() medido al recibir el estado.
    function restanteMs(estado, offset, ahoraLocal) {
        if (estado.fase === 'corriendo') return Math.max(0, estado.finMs - (ahoraLocal + offset));
        return estado.restanteMs;
    }

    function nombreDe(estado, id) {
        if (id === AYU_ID) return 'Ayudante';
        var a = estado.alumnos.filter(function (x) { return x.id === id; })[0];
        return a ? a.nombre : id;
    }

    // {pareja, rol, companero} del alumno en la ronda actual, o null.
    function miPareja(estado, id) {
        for (var i = 0; i < estado.parejas.length; i++) {
            var p = estado.parejas[i];
            if (p.terapeuta === id) return { pareja: p, rol: 'terapeuta', companero: p.paciente };
            if (p.paciente === id) return { pareja: p, rol: 'paciente', companero: p.terapeuta };
        }
        return null;
    }

    // Parejas que ve un evaluador: el docente todas, el ayudante solo las suyas.
    function parejasDe(estado, rol) {
        return estado.parejas.filter(function (p) { return rol === 'docente' || p.evaluador === rol; });
    }

    return {
        AYU_ID: AYU_ID, formatoMMSS: formatoMMSS, restanteMs: restanteMs,
        nombreDe: nombreDe, miPareja: miPareja, parejasDe: parejasDe
    };
})();

if (typeof module !== 'undefined') module.exports = Estado;
