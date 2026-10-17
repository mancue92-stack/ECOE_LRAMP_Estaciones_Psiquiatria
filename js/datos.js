        const STATIONS = [{
            id: 1,
            title: "Sofía, 20 años",
            subtitle: "Estrés académico e ideación pasiva incipiente",
            difficulty: "leve",
            difficultyLabel: "Leve",
            minutes: 8,
            context: "Sofía, 20 años, estudiante de Enfermería, es derivada por su médico de cabecera tras comentar «no aguanto más» durante un control por insomnio. Es tu primera entrevista con ella. Disponés de 8 minutos para aplicar el L-RAMP: evaluar el riesgo, identificar factores protectores y, si corresponde, construir un plan de seguridad.",
            actor: [
                "Está cursando los últimos exámenes finales antes de recibirse; sobrecarga académica y pocas horas de sueño desde hace 3 semanas.",
                "Ideación pasiva ocasional desde hace 10 días («a veces pienso que si me durmiera y no despertara sería un descanso»), sin ideación activa, sin plan, sin intento previo.",
                "Nunca tuvo pensamientos similares antes de este episodio.",
                "Minimiza al inicio: «estoy exagerando, seguro es cansancio».",
                "Buen vínculo con su madre y su grupo de estudio; el semestre termina en dos semanas.",
                "Si se indaga con calma la pregunta 6, reconoce que imaginarse recibida como enfermera «le da ganas de seguir»."
            ],
            focus: "Aplicar las 6 preguntas incluso ante una clínica leve; diferenciar con precisión ideación pasiva de activa; identificar factores protectores fuertes (proyecto vital cercano, red de apoyo); construir un plan de seguridad breve centrado en manejo del estrés y del sueño, sin sobre-medicalizar ni psiquiatrizar en exceso.",
            disposition: "No amerita internación: riesgo bajo, sin plan, buen apoyo social y factores protectores sólidos. Alta con plan de seguridad breve, psicoeducación sobre sueño y manejo del estrés, y seguimiento ambulatorio en 48–72 horas con contacto al médico de cabecera."
        }, {
            id: 2,
            title: "Iván, 19 años",
            subtitle: "Cortes tras una discusión familiar: autolesión vs. tentativa",
            difficulty: "levemod",
            difficultyLabel: "Leve-Moderado",
            minutes: 9,
            context: "Iván es traído por su padre a la guardia porque esta mañana encontraron cortes superficiales en su antebrazo, tras una fuerte discusión anoche por su orientación vocacional. Es tu primera entrevista con él. Disponés de 9 minutos.",
            actor: [
                "Los cortes de anoche fueron superficiales, en el antebrazo no dominante, sin intención de morir — los hizo para «sacarse la angustia de encima» después de la pelea.",
                "Nunca tuvo tentativas previas ni ideación suicida franca.",
                "Reconoce que lo hace ocasionalmente desde hace un año cuando se siente «desbordado»; nunca se lo contó a nadie hasta hoy.",
                "Buen vínculo con un amigo cercano y con un profesor guía del colegio.",
                "Le preocupa que sus padres piensen que «está loco» y que esto quede expuesto frente a su familia.",
                "Si se pregunta con calma y de forma directa, diferencia con claridad el corte de anoche de un intento de matarse."
            ],
            focus: "Distinguir autolesión no suicida de conducta suicida sin restar importancia clínica al hallazgo; explorar la función emocional de la conducta (regulación del malestar, no comunicación manipuladora — derribar ese mito); psicoeducación breve; plan de seguridad centrado en estrategias de regulación emocional y en mejorar la comunicación familiar.",
            disposition: "No amerita internación. Derivación a tratamiento ambulatorio especializado (considerar abordaje con habilidades tipo TCC/DBT para adolescentes). Plan de seguridad con participación familiar acordada con el propio Iván, y seguimiento en 48–72 horas."
        }, {
            id: 3,
            title: "Don Casimiro, 68 años",
            subtitle: "Viudez, jubilación reciente y acceso a un arma de fuego",
            difficulty: "moderado",
            difficultyLabel: "Moderado",
            minutes: 10,
            context: "Don Casimiro es traído por su hija, quien lo notó «apagado» y con frases como «ya cumplí con todo» durante la última semana. Vive solo desde su jubilación hace 6 meses. Es tu primera entrevista con él. Disponés de 10 minutos.",
            actor: [
                "Minimiza al inicio: «estoy bien, es la edad, no hay que hacer un escándalo».",
                "Si se pregunta de forma directa y con calma, reconoce que hace unas noches sostuvo su revólver reglamentario (fue policía) y pensó «sería rápido».",
                "No tiene plan para hoy ni fecha definida, pero el arma está cargada en su mesa de luz.",
                "Aislamiento social progresivo desde la jubilación; dejó de ver a sus excompañeros y de salir a caminar.",
                "Insomnio, anhedonia e ideas de inutilidad compatibles con un cuadro depresivo no tratado.",
                "Factor protector central: quiere estar presente en el casamiento de su hija dentro de 4 meses."
            ],
            focus: "Sostener la pregunta directa pese a la minimización inicial; indagar letalidad y acceso concreto al método (pregunta 3); trabajar el manejo de medios letales (punto D del plan de seguridad) como intervención central de esta estación; discutir en grupo el punto de corte entre manejo ambulatorio intensivo e internación.",
            disposition: "Caso límite para discusión grupal: dado el acceso inmediato a un medio de alta letalidad sin garantía de restricción, se espera que el residente proponga la remoción inmediata y verificada del arma (con apoyo familiar) como condición para continuar en forma ambulatoria, valorando la internación breve si esto no puede garantizarse. Seguimiento estrecho a las 24 horas e inicio de tratamiento del cuadro depresivo."
        }, {
            id: 4,
            title: "Doña Elsa, 61 años",
            subtitle: "Diagnóstico oncológico reciente e ideación de «puerta trasera»",
            difficulty: "moderado",
            difficultyLabel: "Moderado",
            minutes: 9,
            context: "Doña Elsa es derivada por su oncólogo, que la notó angustiada tras recibir la noticia de progresión de su enfermedad. Es tu primera entrevista con ella. Disponés de 9 minutos.",
            actor: [
                "Guardó parte de su medicación para el dolor (opioides indicados por su enfermedad) «por si en algún momento ya no aguanto», sin plan ni fecha definida.",
                "No tiene ideación activa hoy, pero reconoce que la idea «está ahí, como un resguardo» desde hace unas dos semanas.",
                "Le cuesta hablar de esto por miedo a preocupar a su familia y a que le «saquen» el tratamiento del dolor.",
                "Factor protector central: dos nietos pequeños que la visitan cada semana; quiere verlos crecer.",
                "Buen vínculo con su equipo de oncología y cuidados paliativos."
            ],
            focus: "Reconocer un plan de baja probabilidad inmediata pero alta letalidad (ideación de «puerta trasera»); trabajar el compromiso de tratamiento sin generar pánico ni actitud de juicio; abordar el manejo de medios letales de forma colaborativa y no punitiva (gestión conjunta del excedente de medicación); coordinar con el equipo tratante de oncología/cuidados paliativos.",
            disposition: "No amerita internación de urgencia al no existir riesgo inminente, pero sí requiere manejo activo de medios letales (retiro del excedente de opioides con apoyo familiar y del equipo tratante), seguimiento estrecho en 24–48 horas y coordinación interdisciplinaria explícita con oncología."
        }, {
            id: 5,
            title: "Bruno, 16 años",
            subtitle: "Conflicto de pareja, con sus padres esperando afuera",
            difficulty: "levemod",
            difficultyLabel: "Leve-Moderado",
            minutes: 9,
            context: "Bruno es traído por su madre tras encontrar un mensaje de texto a su pareja diciendo «no quiero estar más». Está en la guardia hace una hora, ya contenido; sus padres esperan afuera. Es tu primera entrevista con él. Disponés de 9 minutos.",
            actor: [
                "Tuvo ideación activa transitoria anoche, tras terminar con su pareja de 8 meses, sin plan ni intento; ya remitió y se siente «tonto» por haberlo escrito.",
                "Nunca tuvo ideación suicida antes de anoche.",
                "Buen vínculo con ambos padres, aunque le cuesta hablar de temas emocionales con su padre.",
                "Buen rendimiento escolar; el equipo de fútbol es una red de apoyo importante.",
                "Se avergüenza de que sus padres se hayan enterado y teme que «lo traten como loco» en la escuela."
            ],
            focus: "Evaluar si corresponde el alta con plan de seguridad (criterios de no internación); decidir cómo involucrar a la familia en el plan de seguridad (puntos A–E) respetando la autonomía y la intimidad del adolescente; psicoeducar a los padres sobre señales de alarma y manejo de medios en el hogar (medicamentos, elementos cortopunzantes) sin generar sobreprotección punitiva.",
            disposition: "No amerita internación. Alta con plan de seguridad co-construido entre Bruno y sus padres (con su consentimiento sobre qué compartir), contacto de seguimiento en 24 horas y turno con salud mental durante la semana."
        }, {
            id: 6,
            title: "Patricia, 34 años",
            subtitle: "Reactivación de ideación en tratamiento, con tentativa previa",
            difficulty: "moderado",
            difficultyLabel: "Moderado",
            minutes: 10,
            context: "Patricia está en tratamiento ambulatorio hace 4 meses por Trastorno Depresivo Mayor, con una tentativa por intoxicación medicamentosa hace un año. Solicitó una consulta de urgencia porque «volvió a pensar en lo mismo» tras una discusión de pareja anoche. Disponés de 10 minutos.",
            actor: [
                "Ideación activa desde anoche, intensidad 6/10 en el momento del episodio, sin plan concreto hoy; reconoce haber mirado el cajón donde antes guardaba los comprimidos (ya no están, los tiró tras el alta).",
                "Puede identificar con claridad la cadena: discusión de pareja → sensación de «no valgo nada» → ideación.",
                "Usó habilidades aprendidas en terapia (llamó a su hermana, salió a caminar) y logró bajar la intensidad a 3/10 para cuando llega a la consulta.",
                "Tiene turno programado con su terapeuta en 5 días.",
                "Factores protectores: su hija de 6 años, y el vínculo terapéutico actual, que valora mucho."
            ],
            focus: "Aplicar el análisis en cadena (factores de vulnerabilidad → evento precipitante → conducta → consecuencias); reforzar explícitamente las habilidades que ya usó con éxito; renegociar el compromiso de tratamiento de forma progresiva («dame unos días») en lugar de un contrato rígido de no-suicidio; decidir un seguimiento acorde a la mejoría ya lograda.",
            disposition: "No amerita internación: la intensidad bajó con habilidades propias y hay compromiso terapéutico activo. Reforzar el plan de seguridad vigente, contacto telefónico de control en 24 horas y coordinación con la terapeuta tratante para adelantar la sesión programada."
        }, {
            id: 7,
            title: "Marcos, 42 años",
            subtitle: "Consumo de alcohol, despido reciente e ideación bajo intoxicación",
            difficulty: "moderado",
            difficultyLabel: "Moderado",
            minutes: 9,
            context: "Marcos, 42 años, es traído a la guardia por su hermano tras una noche de consumo de alcohol en la que le escribió «ya no tengo sentido acá». Perdió su trabajo hace tres semanas y su pareja se mudó hace dos meses. Hoy está sobrio, tranquilo y algo avergonzado. Es tu primera entrevista con él. Disponés de 9 minutos para aplicar el L-RAMP.",
            actor: [
                "Ideación activa anoche, bajo los efectos del alcohol, con intensidad 8/10; hoy la intensidad es 4/10 y no tiene un plan definido, aunque admite haber pensado en tomar «todas las pastillas para dormir juntas».",
                "Tiene en su casa una caja de clonazepam sin usar (indicada hace un año) y la menciona solo si se le pregunta directamente por acceso a medicación.",
                "Bebe a diario desde hace 6 meses; minimiza: «es para dormir, no soy alcohólico».",
                "Un intento previo a los 25 años tras una ruptura, sin atención médica; nunca se lo contó a nadie.",
                "Factores protectores: su hermano, que lo cuida y con quien se queda desde hoy; su perro; quiere volver a trabajar en construcción. Se muestra ambivalente sobre pedir ayuda por el alcohol."
            ],
            focus: "Preguntar de forma directa por ideación y plan aunque el paciente esté sobrio y tranquilo; indagar acceso a medios letales (medicación acumulada) y retirarlos junto con el hermano; abordar el consumo de alcohol como factor de riesgo sin confrontar ni moralizar; construir un plan de seguridad (A–E) que incluya el consumo e involucrar al hermano con el consentimiento de Marcos.",
            disposition: "No amerita internación por riesgo suicida inmediato: ideación sin plan definido, intensidad en descenso, red de apoyo presente y medios restringibles. Alta con plan de seguridad, retiro supervisado de la medicación por el hermano, seguimiento en 24–48 horas y derivación a tratamiento de adicciones; reevaluar internación si vuelve a consumir con ideación activa."
        }];

        const RUBRIC = [
            { cat: "Apertura y vínculo", items: ["Se presentó y explicó el motivo/marco de la entrevista", "Generó un ambiente sin juicio, validando la angustia antes de indagar"] },
            { cat: "Evaluación de riesgo (6 preguntas)", items: [
                    "P1 · Preguntó de forma directa por ideación suicida actual y plan",
                    "P2 · Usó la escala subjetiva 0–10 de intensidad/malestar",
                    "P3 · Indagó letalidad y acceso concreto a medios",
                    "P4 · Exploró el «para qué», evitando el «por qué», buscando razones para vivir",
                    "P5 · Indagó historia previa de ideación/tentativas y habilidades usadas",
                    "P6 · Preguntó qué lo/la detuvo, reforzando razones para vivir"
                ] },
            { cat: "Factores de riesgo y protectores", items: [
                    "Identificó al menos 2 factores de riesgo inminente relevantes al caso",
                    "Identificó al menos 2 factores protectores relevantes al caso",
                    "Evitó mitos o supuestos (p. ej., «si mejoró, ya pasó el riesgo»)"
                ] },
            { cat: "Manejo y plan de seguridad", items: [
                    "Construyó un Compromiso de Tratamiento progresivo (no un contrato rígido)",
                    "Plan de Seguridad — A: señales de alarma",
                    "Plan de Seguridad — B: estrategias de autogestión",
                    "Plan de Seguridad — C: red de apoyo / distracción social",
                    "Plan de Seguridad — D: manejo de medios letales",
                    "Plan de Seguridad — E: revisó y repactó el compromiso de tratamiento"
                ] },
            { cat: "Disposición final", items: [
                    "Tomó una decisión de internación/no internación con criterio explícito",
                    "Definió un seguimiento concreto (12h / 24h / 48–72h / próxima sesión)",
                    "Documentaría esto en un registro tipo L-RAMP"
                ] }
        ];

if (typeof module !== "undefined") {
    module.exports = { STATIONS: STATIONS, RUBRIC: RUBRIC };
}
