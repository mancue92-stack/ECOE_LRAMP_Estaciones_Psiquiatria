'use strict';

// Generadores de HTML (funciones puras: reciben datos y devuelven texto). Requiere Estado.
var Vistas = (function () {
    var FASES = { inicial: 'Sin ronda', espera: 'Esperando inicio', corriendo: 'En curso', pausa: 'En pausa', cerrada: 'Ronda cerrada' };

    function esc(t) {
        return String(t).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function aviso(icono, titulo, detalle) {
        return '<div class="waiting-msg"><span class="icon">' + icono + '</span><p>' + esc(titulo) + '</p>' +
            (detalle ? '<p class="small">' + esc(detalle) + '</p>' : '') + '</div>';
    }

    function caso(stations, id) {
        return stations.filter(function (s) { return s.id === id; })[0];
    }

    function etiquetaPuntaje(pct) {
        if (pct >= 80) return { texto: 'sólido', color: 'var(--ok)' };
        if (pct >= 60) return { texto: 'adecuado', color: 'var(--levemod)' };
        return { texto: 'a reforzar', color: 'var(--warn)' };
    }

    function cabeceraRonda(estado) {
        return 'Ronda ' + estado.ronda + ' de ' + estado.totalRondas + ' · ' + FASES[estado.fase];
    }

    function htmlAlumno(estado, miId, ms, stations) {
        if (estado.ronda === 0) {
            return aviso('⏳', 'Todavía no hay una ronda en curso.', 'El docente debe marcar la asistencia y generar la ronda.');
        }
        var mi = Estado.miPareja(estado, miId);
        if (!mi) {
            return aviso('⏳', 'No estás en la ronda ' + estado.ronda + '.', 'Avisa al docente: entrarás en la próxima ronda.');
        }
        var st = caso(stations, mi.pareja.caso);
        if (!st) return aviso('⚠️', 'El caso asignado no está disponible.', 'Avisa al docente.');

        var esPaciente = mi.rol === 'paciente';
        var contenido = esPaciente
            ? '<div class="actorcard"><span class="tag">🔒 Confidencial — solo para el actor</span><ul>' +
              st.actor.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ul></div>'
            : '<div class="box" style="margin-top:6px;"><h4>Contexto clínico</h4><p>' + st.context + '</p></div>' +
              '<p class="small">🧑‍⚕️ Como terapeuta, usa el contexto y las 6 preguntas del L-RAMP. No tienes acceso a la ficha confidencial.</p>';
        var clave = estado.fase === 'cerrada'
            ? '<button class="togglebtn gold" data-accion="clave" style="margin-top:10px;">Ver clave de corrección (foco y disposición)</button>' +
              '<div class="revealbox key-reveal" style="margin-top:4px;"><div class="keycard"><span class="tag">Clave de corrección</span>' +
              '<p><b>Foco:</b> ' + st.focus + '</p><p><b>Disposición esperada:</b> ' + st.disposition + '</p></div></div>'
            : '';

        return '<div class="estacion-activa"><div class="badge ' + st.difficulty + '">' + st.difficultyLabel + '</div>' +
            '<h2>Caso ' + st.id + ' · ' + st.title + '</h2>' +
            '<div class="grupo-alumno">' + esc(cabeceraRonda(estado)) + ' · Pareja ' + esc(mi.pareja.id) + ' con ' +
            esc(Estado.nombreDe(estado, mi.companero)) + ' · Tu rol: <span class="rol-alumno ' + mi.rol + '">' +
            (esPaciente ? 'Paciente (actor)' : 'Terapeuta (residente)') + '</span></div>' +
            '<div style="margin:6px 0;font-family:\'Segoe UI\',sans-serif;font-size:.85rem;background:var(--maroon-dark);color:#fff;padding:4px 12px;border-radius:6px;display:inline-block;">' +
            '⏱ Tiempo restante: <span id="alumno-timer">' + Estado.formatoMMSS(ms) + '</span></div>' +
            '<div style="margin-top:10px;">' + contenido + '</div>' + clave + '</div>';
    }

    // Lista de parejas con su caso (pestaña "Estación actual" del docente y el ayudante).
    function htmlParejas(estado, stations) {
        if (estado.ronda === 0) return aviso('⏳', 'Todavía no hay una ronda en curso.', 'El docente debe generar la ronda.');
        var tarjetas = estado.parejas.map(function (p) {
            var st = caso(stations, p.caso);
            return '<div class="group-card"><strong>Pareja ' + esc(p.id) + '</strong> · ' + (st ? esc(st.title) : '') +
                '<div>' + esc(Estado.nombreDe(estado, p.terapeuta)) + ' <span class="role-tag terapeuta">Terapeuta</span></div>' +
                '<div>' + esc(Estado.nombreDe(estado, p.paciente)) + ' <span class="role-tag paciente">Paciente</span></div>' +
                '<div class="small">Evalúa: ' + esc(p.evaluador) + '</div></div>';
        }).join('');
        return '<div class="estacion-activa"><h2>' + esc(cabeceraRonda(estado)) + '</h2>' +
            '<div class="small">⏱ <span id="admin-timer-estacion"></span></div><div class="group-list">' + tarjetas + '</div></div>';
    }

    function htmlAdmin(estado, ms) {
        var presentes = estado.alumnos.filter(function (a) { return a.presente; }).length;
        var lista = estado.alumnos.map(function (a) {
            return '<label class="checkitem"><input type="checkbox" data-asistencia="' + esc(a.id) + '"' +
                (a.presente ? ' checked' : '') + '><span>' + esc(a.nombre) + '</span></label>';
        }).join('');
        var avisos = estado.avisos.length
            ? '<div class="notebanner"><b>Atención:</b> ' + estado.avisos.map(esc).join(' ') + '</div>' : '';
        var enCurso = estado.fase === 'corriendo' || estado.fase === 'pausa';
        var puedeGenerar = !enCurso && !(estado.fase !== 'espera' && estado.ronda >= estado.totalRondas);
        return '<div class="admin-panel"><h3><span>📋 Panel de control docente</span> <span class="badge-admin">Administrador</span></h3>' +
            '<p class="small">' + esc(cabeceraRonda(estado)) + '. Marca la asistencia, genera la ronda y controla el tiempo.</p>' +
            '<div class="admin-row"><div class="col"><label>👥 Asistencia: ' + presentes + ' de ' + estado.alumnos.length + ' presentes</label>' +
            '<div id="lista-asistencia" style="max-height:260px;overflow-y:auto;">' + lista + '</div></div>' +
            '<div class="col"><label>⚙️ Configuración</label>' +
            '<div class="small">Rondas (1–7): <input type="number" data-config="rondas" min="1" max="7" value="' + estado.totalRondas + '" style="width:48px"' + (estado.fase === 'corriendo' ? ' disabled' : '') + '></div>' +
            '<div class="small">Minutos por ronda: <input type="number" data-config="minutos" min="1" max="30" value="' + estado.duracionMin + '" style="width:48px"' + (estado.fase === 'corriendo' ? ' disabled' : '') + '></div></div></div>' +
            '<hr style="border-color:var(--border);margin:8px 0;">' +
            '<div class="admin-row"><div class="col"><label>⏱ Control de tiempo</label>' +
            '<div class="timer-control" id="admin-timer-ctl"><span class="display" id="admin-timer">' + Estado.formatoMMSS(ms) + '</span>' +
            '<button data-accion="timer-start">▶ Iniciar</button><button data-accion="timer-pause">⏸️ Pausar</button>' +
            '<button data-accion="timer-reset">⏹️ Reiniciar</button></div></div>' +
            '<div class="col"><label>📌 Ronda</label><div style="display:flex;gap:4px;flex-wrap:wrap;">' +
            '<button class="admin-btn gold" data-accion="generar"' + (puedeGenerar ? '' : ' disabled') + '>🎲 ' +
            (estado.fase === 'espera' ? 'Volver a sortear' : 'Generar ronda') + '</button>' +
            '<button class="admin-btn success" data-accion="cerrar"' + (estado.ronda === 0 || estado.fase === 'cerrada' ? ' disabled' : '') + '>✅ Cerrar ronda</button></div></div></div>' +
            avisos +
            '<div style="margin-top:10px;"><button class="admin-btn" data-accion="csv">📊 CSV</button> ' +
            '<button class="admin-btn" data-accion="excel">📊 Excel</button> ' +
            '<button class="admin-btn" data-accion="pdf">📄 PDF</button> ' +
            '<button class="admin-btn outline small" data-accion="reiniciar">🗑️ Reiniciar sesión</button></div>' +
            '<div class="sync-status">Estado: listo</div></div>';
    }

    // evals: {pareja: {marcas:[bool], comentario}} de la ronda actual.
    function htmlEvaluacion(estado, rol, evals, ms, stations, rubric) {
        if (estado.ronda === 0) return aviso('⏳', 'Todavía no hay una ronda en curso.', 'Espera a que el docente la genere.');
        var parejas = Estado.parejasDe(estado, rol);
        if (!parejas.length) return aviso('✔️', 'No tienes parejas para evaluar en esta ronda.', 'El docente evalúa todas las parejas cuando los presentes son impares.');
        var total = rubric.reduce(function (n, c) { return n + c.items.length; }, 0);
        var tarjetas = parejas.map(function (p) {
            var st = caso(stations, p.caso);
            var cabecera = '<h4>Pareja ' + esc(p.id) + ' · ' + (st ? esc(st.title) : '') + '</h4>' +
                '<div class="small">Terapeuta (evaluado): <b>' + esc(Estado.nombreDe(estado, p.terapeuta)) + '</b> · Paciente: ' +
                esc(Estado.nombreDe(estado, p.paciente)) + ' · Evalúa: ' + esc(p.evaluador) + '</div>';
            if (p.terapeuta === Estado.AYU_ID) {
                return '<div class="group-card">' + cabecera + '<p class="small">El ayudante actúa como terapeuta: esta pareja no se evalúa.</p></div>';
            }
            var ev = evals[p.id] || { marcas: [], comentario: '' };
            var idx = 0;
            var items = rubric.map(function (cat) {
                return '<div class="catname">' + cat.cat + '</div>' + cat.items.map(function (item) {
                    var i = idx++;
                    return '<label class="checkitem"><input type="checkbox" data-eval-pareja="' + esc(p.id) + '" data-eval-idx="' + i + '"' +
                        (ev.marcas[i] ? ' checked' : '') + '><span>' + item + '</span></label>';
                }).join('');
            }).join('');
            var marcados = ev.marcas.filter(Boolean).length;
            var pct = Math.round(100 * marcados / total);
            var et = etiquetaPuntaje(pct);
            return '<div class="group-card eval-card" data-pareja="' + esc(p.id) + '">' + cabecera +
                '<div class="checklist">' + items + '<div class="scorewrap"><span class="scoretext">' + pct + '%</span>' +
                '<div class="scorebar"><div style="width:' + pct + '%;background:' + et.color + '"></div></div>' +
                '<span class="scorelabel">' + marcados + '/' + total + ' ítems — ' + et.texto + '</span></div></div>' +
                '<textarea data-eval-comentario="' + esc(p.id) + '" maxlength="500" rows="2" placeholder="Comentario (opcional)" style="width:100%;margin-top:6px;">' +
                esc(ev.comentario) + '</textarea></div>';
        }).join('');
        return '<div class="estacion-activa"><h2>📝 Evaluación · ' + esc(cabeceraRonda(estado)) + '</h2>' +
            '<div class="small">⏱ <span id="eval-timer">' + Estado.formatoMMSS(ms) + '</span></div>' +
            '<div class="sync-status">Estado: listo</div>' + tarjetas + '</div>';
    }

    return {
        esc: esc, etiquetaPuntaje: etiquetaPuntaje, htmlAlumno: htmlAlumno,
        htmlParejas: htmlParejas, htmlAdmin: htmlAdmin, htmlEvaluacion: htmlEvaluacion
    };
})();

if (typeof module !== 'undefined') module.exports = Vistas;
