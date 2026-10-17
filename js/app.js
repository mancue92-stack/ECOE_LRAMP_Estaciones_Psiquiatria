'use strict';

// Cableado de la página: login, sondeo del estado, cronómetro y eventos. Requiere Api, Estado, Vistas, Reporte, STATIONS, RUBRIC.
(function () {
    var POLL_MS = 3000;
    var TOTAL_ITEMS = RUBRIC.reduce(function (n, c) { return n + c.items.length; }, 0);
    var $ = function (id) { return document.getElementById(id); };
    var DEMORA_ASISTENCIA_MS = 1200;
    var S = {
        estado: null, offset: 0, user: null, evals: {}, evalsRonda: -1, modoStaff: false,
        // Asistencia: los cambios se juntan y se envían en un solo lote; mientras tanto no se repinta el panel.
        asistenciaPendiente: {}, envioAsistencia: null, ultimoEnvio: Promise.resolve(), enCurso: 0, repintar: false
    };

    // ---------- Utilidades ----------

    function ms() { return Estado.restanteMs(S.estado, S.offset, Date.now()); }
    function esStaff() { return S.user && S.user.rol !== 'alumno'; }

    function mostrarEstado(texto, tipo) {
        document.querySelectorAll('.sync-status').forEach(function (el) {
            el.textContent = '📌 ' + texto;
            el.className = 'sync-status ' + (tipo || '');
        });
    }

    function avisoRed(ok) { $('red-aviso').style.display = ok ? 'none' : 'block'; }

    function guardarSesion() {
        try {
            if (S.user) sessionStorage.setItem('ecoe_sesion', JSON.stringify({ user: S.user, token: Api.getToken() }));
            else sessionStorage.removeItem('ecoe_sesion');
        } catch (e) { /* sin almacenamiento: se pide ingresar de nuevo al recargar */ }
    }

    function activateTab(id) {
        document.querySelectorAll('.tabbtn').forEach(function (b) { b.classList.toggle('active', b.dataset.target === id); });
        document.querySelectorAll('section.view').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    }

    // ---------- Render ----------

    function renderTodo() {
        if (!S.user || !S.estado) return;
        var e = S.estado;
        if (S.user.rol === 'alumno') {
            $('estacion-contenido').innerHTML = Vistas.htmlAlumno(e, S.user.id, ms(), STATIONS);
            return;
        }
        $('estacion-contenido').innerHTML = Vistas.htmlParejas(e, STATIONS);
        if (S.user.rol === 'docente') renderAdmin();
        if (S.evalsRonda !== e.ronda) {
            S.evalsRonda = e.ronda;
            S.evals = {};
            cargarEvals();
        } else {
            renderEvaluacion();
        }
    }

    // Repinta el panel conservando el desplazamiento de la lista y el campo enfocado.
    function renderAdmin() {
        if (S.enCurso > 0) { S.repintar = true; return; }
        var contenedor = $('admin-contenido');
        var lista = $('lista-asistencia');
        var scroll = lista ? lista.scrollTop : 0;
        var activo = document.activeElement;
        var foco = activo && activo.dataset ? (activo.dataset.asistencia ? 'asistencia' : (activo.dataset.config ? 'config' : '')) : '';
        var valorFoco = foco ? activo.dataset[foco] : '';
        contenedor.innerHTML = Vistas.htmlAdmin(S.estado, ms());
        if ($('lista-asistencia')) $('lista-asistencia').scrollTop = scroll;
        if (foco) {
            var el = contenedor.querySelector('[data-' + foco + '="' + valorFoco + '"]');
            if (el) el.focus();
        }
    }

    function renderEvaluacion() {
        if (!esStaff() || !S.estado) return;
        $('evaluacion-contenido').innerHTML = Vistas.htmlEvaluacion(S.estado, S.user.rol, S.evals, ms(), STATIONS, RUBRIC);
    }

    function cargarEvals() {
        if (!esStaff()) return Promise.resolve();
        var ronda = S.estado.ronda;
        if (ronda === 0) { renderEvaluacion(); return Promise.resolve(); }
        return Api.accion('evaluaciones').then(function (lista) {
            if (S.estado.ronda !== ronda) return;
            S.evals = {};
            lista.forEach(function (x) { S.evals[x.pareja] = { marcas: x.marcas, comentario: x.comentario }; });
            renderEvaluacion();
        }).catch(errorAccion);
    }

    function tick() {
        if (!S.estado) return;
        var texto = Estado.formatoMMSS(ms());
        ['alumno-timer', 'admin-timer', 'eval-timer', 'admin-timer-estacion'].forEach(function (id) {
            var el = $(id);
            if (el) el.textContent = texto;
        });
        var ctl = $('admin-timer-ctl');
        if (ctl) ctl.classList.toggle('alert', S.estado.fase === 'corriendo' && ms() <= 0);
    }

    // ---------- Sincronización ----------

    function cargarEstado() {
        return Api.estado().then(function (est) {
            S.estado = est;
            S.offset = est.serverNow - Date.now();
            renderTodo();
        });
    }

    function sondear() {
        Api.version().then(function (v) {
            if (!S.estado || v.version !== S.estado.version) return cargarEstado();
        }).then(function () { avisoRed(true); }, function () { avisoRed(false); })
            .then(function () { setTimeout(sondear, POLL_MS + Math.random() * 1000); });
    }

    function errorAccion(e) {
        if (e && e.codigo === 'SESION') { cerrarSesion(e.message); return; }
        mostrarEstado(e && e.message ? e.message : 'Error de conexión', 'error');
    }

    function accionAdmin(accion, datos, ok) {
        return Api.accion(accion, datos).then(function (r) {
            return cargarEstado().then(function () { if (ok) mostrarEstado(ok, 'ok'); return r; });
        }).catch(errorAccion);
    }

    // ---------- Login ----------

    function llenarAlumnos() {
        $('login-name').innerHTML = '<option value="">— Elige tu nombre —</option>' + S.estado.alumnos.map(function (a) {
            return '<option value="' + Vistas.esc(a.id) + '">' + Vistas.esc(a.nombre) + '</option>';
        }).join('');
    }

    function entrar(user) {
        S.user = user;
        S.evalsRonda = -1;
        document.body.className = (user.rol === 'alumno' ? 'role-alumno' : 'role-docente') + ' rol-' + user.rol;
        $('banner-name').textContent = user.nombre;
        $('banner-role').textContent = { docente: 'Docente / Administrador', ayudante: 'Ayudante', alumno: 'Alumno' }[user.rol];
        $('login-overlay').classList.add('hidden');
        $('app').style.display = 'block';
        activateTab(user.rol === 'docente' ? 'admin' : (user.rol === 'ayudante' ? 'evaluacion' : 'estacion'));
        guardarSesion();
        renderTodo();
    }

    function cerrarSesion(mensaje) {
        S.user = null;
        Api.setToken(null);
        guardarSesion();
        document.body.className = '';
        $('app').style.display = 'none';
        $('login-overlay').classList.remove('hidden');
        $('login-pass').value = '';
        $('login-error').textContent = mensaje || '';
    }

    $('toggle-role-btn').addEventListener('click', function () {
        S.modoStaff = !S.modoStaff;
        $('docente-pass-group').style.display = S.modoStaff ? 'block' : 'none';
        $('alumno-group').style.display = S.modoStaff ? 'none' : 'block';
        $('toggle-role-btn').textContent = S.modoStaff ? '👤 ¿Eres alumno? Elige tu nombre' : '🔑 ¿Eres docente o ayudante? Ingresa con clave';
        $('login-error').textContent = '';
    });

    $('login-form').addEventListener('submit', function (ev) {
        ev.preventDefault();
        var error = $('login-error');
        error.textContent = '';
        if (S.modoStaff) {
            var rol = $('login-rol').value;
            Api.login(rol, $('login-pass').value.trim()).then(function () {
                entrar({ id: rol, nombre: rol === 'docente' ? 'Docente' : 'Ayudante', rol: rol });
            }).catch(function (e) { error.textContent = e.message; });
            return;
        }
        var alumno = S.estado && S.estado.alumnos.filter(function (a) { return a.id === $('login-name').value; })[0];
        if (!alumno) { error.textContent = 'Elige tu nombre de la lista.'; return; }
        entrar({ id: alumno.id, nombre: alumno.nombre, rol: 'alumno' });
    });

    $('logout-btn').addEventListener('click', function () {
        if (confirm('¿Cerrar sesión?')) cerrarSesion('');
    });

    document.querySelectorAll('.tabbtn').forEach(function (btn) {
        btn.addEventListener('click', function () { activateTab(btn.dataset.target); });
    });

    // ---------- Panel docente ----------

    function descargar(nombre, contenido, tipo) {
        var url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
        var a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        a.click();
        URL.revokeObjectURL(url);
    }

    function exportar(formato) {
        if (formato === 'pdf') { window.print(); return; }
        Api.accion('evaluaciones', { todas: true }).then(function (evals) {
            var filas = Reporte.filas(evals, S.estado, STATIONS, TOTAL_ITEMS);
            if (formato === 'csv') descargar('reporte_ecoe_lramp.csv', '﻿' + Reporte.aCSV(filas), 'text/csv;charset=utf-8');
            else descargar('reporte_ecoe_lramp.xls', Reporte.aTablaHTML(filas), 'application/vnd.ms-excel');
            mostrarEstado(filas.length + ' evaluaciones exportadas', 'ok');
        }).catch(errorAccion);
    }

    // ---------- Asistencia en lote ----------

    function contarPresentes() {
        var n = document.querySelectorAll('[data-asistencia]:checked').length;
        var el = $('contador-asistencia');
        if (el) el.textContent = n;
    }

    function enviarAsistencia() {
        var cambios = S.asistenciaPendiente;
        S.asistenciaPendiente = {};
        S.envioAsistencia = null;
        S.ultimoEnvio = S.ultimoEnvio.then(function () {
            return accionAdmin('asistencia', { cambios: cambios }, 'Asistencia guardada');
        }).then(function () {
            S.enCurso--;
            // Siempre se repinta al terminar: si el envío falló, las casillas vuelven al estado real del servidor.
            if (S.enCurso === 0) { S.repintar = false; renderTodo(); }
        });
        return S.ultimoEnvio;
    }

    // Junta los cambios de asistencia y los envía de una vez, tras una pausa corta o de inmediato.
    function programarAsistencia(cambios, inmediato) {
        Object.keys(cambios).forEach(function (id) { S.asistenciaPendiente[id] = cambios[id]; });
        if (!S.envioAsistencia) S.enCurso++;
        clearTimeout(S.envioAsistencia);
        mostrarEstado('Guardando asistencia…', '');
        if (inmediato) { enviarAsistencia(); return; }
        S.envioAsistencia = setTimeout(enviarAsistencia, DEMORA_ASISTENCIA_MS);
    }

    // Antes de generar la ronda hay que asegurar que la asistencia ya está guardada.
    function asistenciaGuardada() {
        if (S.envioAsistencia) { clearTimeout(S.envioAsistencia); enviarAsistencia(); }
        return S.ultimoEnvio;
    }

    function marcarTodos(presente) {
        var cambios = {};
        document.querySelectorAll('[data-asistencia]').forEach(function (c) {
            c.checked = presente;
            cambios[c.dataset.asistencia] = presente;
        });
        contarPresentes();
        programarAsistencia(cambios, true);
    }

    var ACCIONES_ADMIN = {
        'todos-presentes': function () { marcarTodos(true); },
        'ninguno-presente': function () { marcarTodos(false); },
        'timer-start': function () { return accionAdmin('timer', { op: 'start' }, 'Cronómetro en marcha'); },
        'timer-pause': function () { return accionAdmin('timer', { op: 'pause' }, 'Cronómetro en pausa'); },
        'timer-reset': function () { return accionAdmin('timer', { op: 'reset' }, 'Cronómetro reiniciado'); },
        cerrar: function () { return accionAdmin('cerrar', {}, 'Ronda cerrada'); },
        generar: function () {
            return asistenciaGuardada().then(function () { return accionAdmin('generar', {}, 'Ronda generada'); });
        },
        reiniciar: function () {
            if (confirm('¿Borrar las parejas y evaluaciones de toda la sesión? No se puede deshacer.')) {
                return accionAdmin('reiniciar', {}, 'Sesión reiniciada');
            }
        },
        csv: function () { exportar('csv'); },
        excel: function () { exportar('excel'); },
        pdf: function () { exportar('pdf'); }
    };

    $('admin-contenido').addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-accion]');
        if (btn && ACCIONES_ADMIN[btn.dataset.accion]) ACCIONES_ADMIN[btn.dataset.accion]();
    });

    $('admin-contenido').addEventListener('change', function (ev) {
        var t = ev.target;
        if (t.dataset.asistencia) {
            var cambio = {};
            cambio[t.dataset.asistencia] = t.checked;
            contarPresentes();
            programarAsistencia(cambio, false);
        } else if (t.dataset.config) {
            var rondas = document.querySelector('[data-config="rondas"]').value;
            var minutos = document.querySelector('[data-config="minutos"]').value;
            accionAdmin('config', { totalRondas: Number(rondas), duracionMin: Number(minutos) }, 'Configuración guardada');
        }
    });

    // ---------- Evaluación ----------

    function actualizarPuntaje(tarjeta, marcas) {
        var marcados = marcas.filter(Boolean).length;
        var pct = Math.round(100 * marcados / TOTAL_ITEMS);
        var et = Vistas.etiquetaPuntaje(pct);
        tarjeta.querySelector('.scoretext').textContent = pct + '%';
        var barra = tarjeta.querySelector('.scorebar > div');
        barra.style.width = pct + '%';
        barra.style.background = et.color;
        tarjeta.querySelector('.scorelabel').textContent = marcados + '/' + TOTAL_ITEMS + ' ítems — ' + et.texto;
    }

    function evalLocal(pareja) {
        if (!S.evals[pareja]) S.evals[pareja] = { marcas: [], comentario: '' };
        return S.evals[pareja];
    }

    $('evaluacion-contenido').addEventListener('change', function (ev) {
        var cb = ev.target;
        if (!cb.dataset.evalPareja) return;
        var pareja = cb.dataset.evalPareja;
        var idx = Number(cb.dataset.evalIdx);
        var local = evalLocal(pareja);
        local.marcas[idx] = cb.checked;
        actualizarPuntaje(cb.closest('.eval-card'), local.marcas);
        Api.accion('marcar', { pareja: pareja, idx: idx, valor: cb.checked }).then(function () {
            mostrarEstado('Marca guardada', 'ok');
        }).catch(function (e) {
            local.marcas[idx] = !cb.checked;
            cb.checked = !cb.checked;
            actualizarPuntaje(cb.closest('.eval-card'), local.marcas);
            errorAccion(e);
        });
    });

    var temporizadorComentario = {};
    $('evaluacion-contenido').addEventListener('input', function (ev) {
        var ta = ev.target;
        if (!ta.dataset.evalComentario) return;
        var pareja = ta.dataset.evalComentario;
        evalLocal(pareja).comentario = ta.value;
        clearTimeout(temporizadorComentario[pareja]);
        temporizadorComentario[pareja] = setTimeout(function () {
            Api.accion('comentario', { pareja: pareja, texto: ta.value }).then(function () {
                mostrarEstado('Comentario guardado', 'ok');
            }).catch(errorAccion);
        }, 800);
    });

    $('estacion-contenido').addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-accion="clave"]');
        if (btn) btn.nextElementSibling.classList.toggle('show');
    });

    // ---------- Inicio ----------

    setInterval(tick, 250);
    cargarEstado().then(function () {
        llenarAlumnos();
        try {
            var guardada = JSON.parse(sessionStorage.getItem('ecoe_sesion') || 'null');
            if (guardada && guardada.user) {
                Api.setToken(guardada.token);
                entrar(guardada.user);
            }
        } catch (e) { /* sesión guardada inválida: se pide ingresar */ }
        sondear();
    }).catch(function (e) {
        $('login-error').textContent = 'No se pudo conectar con el servidor: ' + e.message;
        setTimeout(function () { location.reload(); }, 10000);
    });
})();
