'use strict';

// Cliente del backend (Apps Script o servidor simulado). Todas las respuestas son {ok, data|error}.
var Api = (function () {
    var TIEMPO_LIMITE_MS = 10000;
    var token = null;

    function baseUrl() {
        var url = window.ECOE_CONFIG && window.ECOE_CONFIG.GAS_URL;
        if (url) return url;
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return '/gas';
        throw new Error('Falta configurar GAS_URL en js/config.js');
    }

    function procesar(resp) {
        return resp.json().then(function (j) {
            if (!j.ok) {
                var err = new Error(j.error === 'SESION' ? 'Tu sesión expiró. Vuelve a ingresar.' : j.error);
                err.codigo = j.error;
                throw err;
            }
            return j.data;
        });
    }

    // Corta las peticiones colgadas para que el sondeo no se congele.
    function conTiempoLimite(url, opciones) {
        var control = new AbortController();
        var reloj = setTimeout(function () { control.abort(); }, TIEMPO_LIMITE_MS);
        return fetch(url, Object.assign({ signal: control.signal }, opciones || {}))
            .catch(function (e) {
                throw e.name === 'AbortError' ? new Error('El servidor tardó demasiado en responder.') : e;
            })
            .finally(function () { clearTimeout(reloj); });
    }

    function leer(accion) {
        return conTiempoLimite(baseUrl() + (baseUrl().indexOf('?') < 0 ? '?' : '&') + 'action=' + accion).then(procesar);
    }

    // text/plain evita el preflight CORS que Apps Script no responde.
    function enviar(cuerpo) {
        return conTiempoLimite(baseUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(cuerpo)
        }).then(procesar);
    }

    return {
        setToken: function (t) { token = t; },
        getToken: function () { return token; },
        estado: function () { return leer('estado'); },
        version: function () { return leer('version'); },
        login: function (rol, clave) {
            return enviar({ action: 'login', rol: rol, clave: clave }).then(function (d) {
                token = d.token;
                return d;
            });
        },
        accion: function (accion, datos) {
            return enviar(Object.assign({ action: accion, token: token }, datos || {}));
        }
    };
})();
