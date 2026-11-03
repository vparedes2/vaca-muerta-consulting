/**
 * Vaca Muerta Consulting - Seed Data
 * DocTypes inspirados en Frappe LMS: Course, Chapter, Lesson, Student, Cohort, Referral, Coordinator
 */

export const INITIAL_DATA = {
  settings: {
    institution: "Vaca Muerta Consulting",
    director: "Lic. Víctor Javier Paredes",
    license: "Mat. Profesional PA 446",
    tagline: "Capacitación previa al ingreso a la industria del petróleo y gas en Vaca Muerta",
    referralDiscountPerPerson: 0.20, // 20%
    referralFullDiscountCount: 5,    // 5 referidos = 100% bonificado con reintegro
    graduateCommissionRate: 0.15,   // 15% de comisión permanente para egresados por cada referido abonado
    coordinatorCommissionRate: 0.30 // 30% de comisión comercial
  },

  // 1. Catálogo Oficial de Cursos
  courses: [
    {
      id: "pasaporte-vaca-muerta",
      title: "Pasaporte a Vaca Muerta: Inducción a la Industria del Petróleo y Gas",
      category: "Formación previa al ingreso",
      code: "VM-PAS-100",
      duration: "80 Horas · 8 semanas",
      modality: "100% online · campus + 1 encuentro en vivo semanal por Meet",
      basePrice: 0,
      badge: "Recomendado antes de viajar",
      featured: true,
      image: "./assets/pasaporte-vaca-muerta.jpg",
      description: "Para quienes planean venir a Neuquén a trabajar en la industria. En 8 semanas conocés cómo funciona un yacimiento, las operaciones de petróleo y gas, los montajes industriales, la construcción de ductos y las obras civiles; hacés 10 capacitaciones esenciales de seguridad y llegás con un plan concreto: qué puesto buscar, cómo es la vida en campo y cómo organizarte lejos de casa.",
      targetAudience: "Jóvenes de 18 a 30 años con secundario completo que planean mudarse a Neuquén; estudiantes y egresados de carreras técnicas; oficios (soldadores, electricistas, mecánicos, choferes) que quieren entrar al sector.",
      prerequisites: "Secundario completo. No requiere experiencia en petróleo.",
      modules: [
        {
          id: "pas-m1",
          title: "Semana 1: La cuenca, la industria y los yacimientos principales",
          lessons: [
            {
              id: "pas-l1",
              title: "Qué es Vaca Muerta y cómo se organiza la industria",
              duration: "60 min",
              type: "theory",
              summary: "Geología básica, cadena de valor, operadoras, empresas de servicio, principales áreas y localidades base.",
              content: `
### Vaca Muerta en el mapa

- Por qué es un yacimiento **no convencional** y por qué necesita fractura hidráulica.
- Cadena de valor: upstream, midstream y downstream.
- Quién es quién: operadoras, empresas de servicio y contratistas.
- Principales áreas y su operadora, y las localidades base: Neuquén, Añelo, Rincón de los Sauces, Cutral Có y Plaza Huincul.

**Actividad:** armá tu propio mapa de la cuenca con 10 áreas, su operadora y la localidad base más cercana.
              `,
              checklist: [
                "Identifico upstream, midstream y downstream",
                "Ubico 10 áreas y su operadora en el mapa",
                "Sé qué localidad base corresponde a cada zona"
              ]
            }
          ]
        },
        {
          id: "pas-m2",
          title: "Semana 2: Operaciones de petróleo y gas",
          lessons: [
            {
              id: "pas-l2",
              title: "El ciclo de un pozo y los servicios asociados",
              duration: "60 min",
              type: "theory",
              summary: "Locación, perforación, terminación y fractura, flowback, producción, workover, plantas y qué hace cada puesto.",
              content: `
### Del pozo a la planta

1. Locación y perforación.
2. Terminación y fractura hidráulica.
3. Flowback y puesta en producción.
4. Workover y pulling.
5. Baterías, plantas de tratamiento y compresión.

Servicios asociados: cementación, wireline, coiled tubing, water transfer, logística de arena y fluidos.

**Actividad:** ficha de un servicio a elección (qué hace, equipos, puestos y riesgos principales).
              `,
              checklist: [
                "Ordeno las etapas del ciclo de un pozo",
                "Describo un servicio: equipos, puestos y riesgos"
              ]
            }
          ]
        },
        {
          id: "pas-m3",
          title: "Semana 3: Ingeniería de procesos y fundamentos técnicos",
          lessons: [
            {
              id: "pas-l3",
              title: "Diagramas de proceso, balance de masa e hidráulica básica",
              duration: "75 min",
              type: "engineering",
              summary: "Lectura de PFD e isométricos, balance de agua de un pad, caudal, presión, bombas, compresores y separadores.",
              content: `
### Leer el proceso

- Diagramas de proceso (PFD) e isométricos: símbolos y lectura.
- Balance de masa simple: agua, arena y fluido de retorno en un pad.
- Fluidos, caudal, presión y pérdidas de carga.
- Bombas, compresores y separadores: para qué sirve cada uno.
- Unidades de campo y conversiones.

**Actividad:** balance de agua de un pad simplificado + ejercicios de unidades.
              `,
              checklist: [
                "Leo un PFD sencillo",
                "Resuelvo un balance de agua simplificado",
                "Convierto unidades de caudal y presión"
              ]
            }
          ]
        },
        {
          id: "pas-m4",
          title: "Semana 4: Montajes industriales",
          lessons: [
            {
              id: "pas-l4",
              title: "Montaje electromecánico en yacimiento",
              duration: "60 min",
              type: "construction",
              summary: "Piping, soldadura y ensayos no destructivos, izaje, andamios, tanques, instrumentación y documentación de obra.",
              content: `
### Cómo se monta una instalación

- Cañerías (piping): materiales, uniones, bridas y válvulas.
- Soldadura y ensayos no destructivos.
- Izaje y rigging; andamios y trabajo en altura.
- Montaje de tanques, equipos rotantes e instrumentación.
- Documentación de obra: planos, plan de inspección y protocolos.

**Actividad:** leer un isométrico y armar la secuencia de montaje de un skid.
              `,
              checklist: [
                "Interpreto un isométrico",
                "Ordeno la secuencia de montaje de un skid"
              ]
            }
          ]
        },
        {
          id: "pas-m5",
          title: "Semana 5: Ductos y obras civiles",
          lessons: [
            {
              id: "pas-l5",
              title: "Construcción de ductos y obras de yacimiento",
              duration: "60 min",
              type: "construction",
              summary: "Traza, apertura de pista, zanjeo, soldadura, bajada, tapada y prueba hidráulica; locaciones, caminos y campamentos.",
              content: `
### Ductos paso a paso

Traza → apertura de pista → zanjeo → desfile → soldadura → revestimiento → bajada → tapada → prueba hidráulica.

### Obras civiles de yacimiento

Locaciones, caminos, plateas y campamentos; movimiento de suelos y maquinaria vial. Roles: capataz, inspector, topógrafo, operador de equipo.

**Actividad:** cronograma simple de un tramo de ducto con sus frentes de trabajo.
              `,
              checklist: [
                "Ordeno las etapas de construcción de un ducto",
                "Identifico los roles de una obra"
              ]
            }
          ]
        },
        {
          id: "pas-m6",
          title: "Semana 6: Seguridad, salud y ambiente en yacimiento",
          lessons: [
            {
              id: "pas-l6",
              title: "Marco legal, permisos de trabajo y emergencias",
              duration: "60 min",
              type: "safety",
              summary: "Ley 19.587 y Ley 24.557, permisos y análisis de riesgo, manejo defensivo, emergencias, residuos y ambiente.",
              content: `
### Trabajar seguro desde el primer día

- Marco legal: Ley 19.587 y Ley 24.557.
- Permisos de trabajo y análisis de riesgo.
- Manejo defensivo en caminos de yacimiento.
- Gases peligrosos (conceptos) y respuesta a emergencias.
- Derrames, residuos y legislación ambiental provincial.
- El rol del área HSE en operaciones y en obras.

**Actividad:** resolución de 3 casos reales anonimizados (operación, montaje y obra).
              `,
              checklist: [
                "Sé qué es un permiso de trabajo y cuándo se pide",
                "Sé qué hacer ante una emergencia en locación"
              ]
            }
          ]
        },
        {
          id: "pas-m7",
          title: "Semana 7: Vida en desarraigo, vida en campo y llegada a Neuquén",
          lessons: [
            {
              id: "pas-l7",
              title: "Irse lejos de casa y trabajar en campo",
              duration: "75 min",
              type: "theory",
              summary: "Vínculos a distancia, organización de la plata, salud mental, turnos, campamentos, clima y búsqueda laboral.",
              content: `
### Desarraigo

Qué cambia al irse lejos de la familia; sostener los vínculos a distancia; organizar la plata (ahorro, envíos y gastos de dos casas); salud mental y a quién pedir ayuda; política de alcohol y drogas cero.

### Vida en campo

Diagramas de turno y francos, traslados en combi, campamentos y trailers (convivencia, orden, higiene y descanso), comedor, clima de la meseta (viento, polvo, calor y frío), conectividad.

### Llegar a Neuquén

Mercado laboral por perfil, consultoras y empresas, CV y LinkedIn, exámenes preocupacionales, costo de vida y alojamiento en Neuquén y Añelo, cómo detectar ofertas de trabajo falsas.

**Actividad:** CV adaptado + plan de llegada (presupuesto, alojamiento, red de contactos y rutina de comunicación con la familia).
              `,
              checklist: [
                "Tengo mi CV adaptado al sector",
                "Armé mi plan de llegada con presupuesto",
                "Sé cómo detectar una oferta de trabajo falsa"
              ]
            }
          ]
        },
        {
          id: "pas-m8",
          title: "Capacitaciones esenciales (semanas 1 a 7)",
          lessons: [
            { id: "pas-e1", title: "Normas vitales de seguridad", duration: "90 min", type: "safety", summary: "Reglas de cumplimiento obligatorio que previenen fatalidades.", content: "Permiso de trabajo, aislamiento de energías, izaje, altura, espacios confinados, conducción y bypass de controles.", checklist: ["Conozco las normas vitales y por qué existen"] },
            { id: "pas-e2", title: "Clima extremo: calor y frío", duration: "60 min", type: "safety", summary: "Golpe de calor, hidratación, hipotermia, viento y ropa adecuada.", content: "Cómo trabajar seguro en verano e invierno en la meseta neuquina.", checklist: ["Reconozco los síntomas de golpe de calor e hipotermia"] },
            { id: "pas-e3", title: "Disciplina en la ejecución", duration: "60 min", type: "procedure", summary: "Seguir los procedimientos paso a paso y detenerse ante un cambio.", content: "Por qué se siguen los procedimientos, cómo detener una tarea ante un cambio y cómo reportar desvíos.", checklist: ["Sé cuándo y cómo detener una tarea"] },
            { id: "pas-e4", title: "Fundamentos de seguridad de procesos", duration: "60 min", type: "safety", summary: "Contención, barreras, gestión del cambio y lecciones de accidentes mayores.", content: "Cómo se evita que un fluido o una energía salga de control.", checklist: ["Explico qué es una barrera de seguridad"] },
            { id: "pas-e5", title: "Posicionamiento seguro y línea de fuego", duration: "60 min", type: "safety", summary: "Zonas de energía liberada y cómo ubicarse fuera de ellas.", content: "Presión, cargas suspendidas, vehículos y objetos que caen.", checklist: ["Identifico la línea de fuego en una tarea"] },
            { id: "pas-e6", title: "Resguardos y partes móviles", duration: "45 min", type: "safety", summary: "Distancias de seguridad, atrapamientos y bloqueo de máquinas.", content: "Por qué nunca se retira un resguardo con la máquina en marcha.", checklist: ["Sé qué es un resguardo y para qué sirve"] },
            { id: "pas-e7", title: "Cuidado de las manos", duration: "45 min", type: "safety", summary: "Lesiones típicas, selección de guantes y herramientas de manos libres.", content: "Las manos son la parte del cuerpo que más se lesiona en yacimiento.", checklist: ["Elijo el guante correcto para cada tarea"] },
            { id: "pas-e8", title: "Riesgo eléctrico", duration: "60 min", type: "safety", summary: "Contactos directos e indirectos, líneas aéreas, bloqueo y etiquetado.", content: "Distancias a líneas aéreas en movimiento de grúas y equipos.", checklist: ["Respeto las distancias a líneas aéreas"] },
            { id: "pas-e9", title: "Productos químicos y etiquetado SGA", duration: "45 min", type: "safety", summary: "Pictogramas, hojas de seguridad, almacenamiento y EPP.", content: "Cómo leer una etiqueta y una hoja de seguridad.", checklist: ["Interpreto los pictogramas SGA"] },
            { id: "pas-e10", title: "Estiba y movimiento de cargas", duration: "45 min", type: "safety", summary: "Estiba segura de tuberías y materiales, sujeción en transporte.", content: "Cómo se estiba y se sujeta una carga para que no se mueva.", checklist: ["Conozco los controles de una estiba segura"] }
          ]
        }
      ]
    },

    {
      id: "water-transfer-n1",
      title: "Water Transfer Nivel 1 — Fundamentos",
      category: "Operaciones de Campo",
      code: "VM-WT-101",
      duration: "24 Horas · 4 semanas",
      modality: "Campus asincrónico + 4 encuentros en vivo por Meet",
      basePrice: 0,
      badge: "Base del servicio",
      image: "https://victorparedes.ar/th_tendido.jpg",
      description: "Entendé para qué sirve el water transfer en una fractura, reconocé cada equipo de la traza, interpretá los parámetros básicos de bombeo y aprendé a trabajar de forma segura dentro de la cuadrilla. Con el libro Water Transfer en Vaca Muerta y los simuladores 3D como material de apoyo.",
      targetAudience: "Ingresantes al servicio, ayudantes, técnicos, estudiantes de carreras técnicas, personal HSE y supervisores que vienen de otros servicios.",
      prerequisites: "Secundario completo. No requiere experiencia en petróleo.",
      modules: [
        {
          id: "wt-m1",
          title: "Módulo 1 y 2: El servicio en contexto y fuentes de agua",
          lessons: [
            {
              id: "wt-l0",
              title: "Por qué una fractura necesita tanta agua y de dónde sale",
              duration: "45 min",
              type: "theory",
              summary: "Etapas de un pad, rol del water transfer, captación, piletas, tanques y permisos de uso de agua.",
              content: `
### El servicio en contexto

- Qué es una fractura hidráulica y por qué consume tanta agua.
- Rol del water transfer frente a frac, flowback y logística.
- Fuentes: captación superficial y subterránea, piletas, cisternas y tanques australianos.
- Permisos de uso de agua en Neuquén y reúso del agua de retorno (introducción).
              `,
              checklist: [
                "Explico el rol del water transfer en la fractura",
                "Identifico las fuentes de agua posibles"
              ]
            }
          ]
        },
        {
          id: "wt-m3",
          title: "Módulo 3 y 4: Equipos de la traza e hidráulica básica",
          lessons: [
            {
              id: "wt-l1",
              title: "Caudales de fractura, bombas e hidráulica de la línea",
              duration: "45 min",
              type: "engineering",
              summary: "Caudal en BPM y m³/h, presión, pérdida de carga por longitud y diámetro, efecto de la cota y ubicación de rebombeos.",
              content: `
### Hidráulica básica para operadores

- **Caudal:** se expresa en barriles por minuto (BPM) o m³/h. 1 BPM ≈ 9,5 m³/h; por ejemplo, 50 a 75 BPM equivalen a unos 480 a 720 m³/h.
- **Presión:** cómo se lee y qué indica en cada punto de la traza.
- **Pérdida de carga:** crece con la longitud de la línea y con el caudal, y baja con el diámetro.
- **Cota:** las subidas suman presión necesaria; las bajadas la devuelven.
- **Rebombeos:** se ubican según el perfil del terreno y la presión disponible, no a una distancia fija.
              `,
              checklist: [
                "Convierto BPM a m³/h",
                "Explico por qué se ubica un rebombeo en un punto de la traza",
                "Leo un perfil de traza en el diseñador"
              ]
            }
          ]
        },
        {
          id: "wt-m5",
          title: "Módulo 5: Montaje, operación y desmontaje",
          lessons: [
            {
              id: "wt-l2",
              title: "Tendido seguro de línea layflat",
              duration: "40 min",
              type: "field-work",
              summary: "Maniobras con carreteles y manipuladores telescópicos, cruces de camino y reparación de pinchazos.",
              content: `
### Tendido de línea

- Secuencia de tendido con manipulador telescópico y carretel.
- Cruces de caminos con protección de la línea.
- Venteos de aire en los puntos altos de la traza.
- Presurización escalonada antes de llegar al régimen de trabajo.
- Reparación de pinchazos con parches y abrazaderas.

Material de apoyo: animaciones 3D de tendido y reparación de línea.
              `,
              checklist: [
                "Picada revisada y libre de piedras filosas",
                "Venteos colocados en los puntos altos",
                "Presurización escalonada"
              ]
            },
            {
              id: "wt-l3",
              title: "Montaje de tanque australiano y sistema de bombeo",
              duration: "45 min",
              type: "construction",
              summary: "Nivelación, armado de anillo, colocación de lona, succión y montaje del sistema de bombeo y backup.",
              content: `
### Montaje de tanque y bombeo

- Nivelación del terreno y armado del anillo.
- Colocación de lona y control de embolsamientos por viento antes del llenado.
- Succión, manifold de descarga y válvulas.
- Montaje del sistema de bombeo y backup.
- Arranque, régimen y parada de bombas; comunicación por radio con frac.

Material de apoyo: animaciones 3D de montaje de tanque y de bombeo.
              `,
              checklist: [
                "Terreno nivelado antes del armado",
                "Lona sin arrugas ni embolsamientos antes del llenado",
                "Comunicación por radio con frac confirmada"
              ]
            }
          ]
        },
        {
          id: "wt-m6",
          title: "Módulo 6: Seguridad, salud y ambiente",
          lessons: [
            {
              id: "wt-l4",
              title: "Riesgos del servicio y respuesta a contingencias",
              duration: "45 min",
              type: "safety",
              summary: "Presión, rotura de línea, atrapamiento, izaje, ruido, fatiga, manejo en caminos, derrames y parada de emergencia.",
              content: `
### Trabajar seguro en water transfer

- Riesgos: presión, rotura de línea, atrapamiento, izaje, ruido, fatiga y turnos nocturnos, manejo en caminos de yacimiento.
- Permisos de trabajo y análisis de riesgo; EPP.
- Parada de emergencia.
- Derrames y cuidado del suelo.

**Actividad:** análisis de riesgo de una tarea + caso de rotura de línea.
              `,
              checklist: [
                "Sé ejecutar la parada de emergencia",
                "Completé el análisis de riesgo de una tarea"
              ]
            }
          ]
        }
      ]
    },

    {
      id: "tech-field",
      title: "Tech & Field: Desarrollo, Apps y Automatización",
      category: "Tecnología & Digitalización",
      code: "VM-DEV-101",
      duration: "2 meses · 8 encuentros",
      modality: "8 encuentros en vivo por Google Meet + práctica semanal",
      basePrice: 0,
      badge: "No requiere saber programar",
      image: "https://victorparedes.ar/th_simtraza.jpg",
      description: "Pasá de una idea de tu trabajo a una aplicación web publicada. Vibe coding con Claude, ChatGPT y Gemini, programación agéntica (AI Studio, Antigravity, MiniMax, Claude Code), organización de proyectos en GitHub, hosting gratuito en Vercel, Netlify y GitHub Pages, conectores y dominio propio, con casos reales de sistemas en producción.",
      targetAudience: "Profesionales HSE, supervisores, técnicos, docentes y emprendedores sin formación en programación.",
      prerequisites: "Computadora, cuenta de Google y conexión estable.",
      modules: [
        {
          id: "tf-m1",
          title: "Encuentros 1 y 2: Pensar como desarrollador y construir con IA",
          lessons: [
            { id: "tf-l1", title: "Análisis de software y vibe coding", duration: "120 min", type: "tech", summary: "Problema, usuarios, requerimientos, MVP y límites del vibe coding.", content: "Ficha del proyecto propio: problema, usuarios, 5 requerimientos y boceto de pantallas.", checklist: ["Ficha del proyecto completa"] },
            { id: "tf-l2", title: "Claude, ChatGPT y Gemini para crear una app", duration: "120 min", type: "tech", summary: "Cómo pedir, iterar y corregir; una app de un solo archivo HTML.", content: "Primera versión del proyecto funcionando en el navegador.", checklist: ["Primera versión funcionando"] }
          ]
        },
        {
          id: "tf-m2",
          title: "Encuentros 3 y 4: GitHub y publicación gratuita",
          lessons: [
            { id: "tf-l3", title: "Organizar el proyecto en GitHub", duration: "120 min", type: "devops", summary: "Repositorios, commits, README, issues y volver a una versión anterior.", content: "Proyecto en GitHub con README y 3 issues abiertos.", checklist: ["Repositorio con README"] },
            { id: "tf-l4", title: "Publicar en Vercel, Netlify o GitHub Pages", duration: "120 min", type: "devops", summary: "Deploy automático desde el repositorio y errores frecuentes.", content: "Proyecto publicado en una URL pública.", checklist: ["Proyecto publicado"] }
          ]
        },
        {
          id: "tf-m3",
          title: "Encuentros 5 y 6: Programación agéntica y conectores",
          lessons: [
            { id: "tf-l5", title: "Agentes: AI Studio, Antigravity, MiniMax y Claude Code", duration: "120 min", type: "tech", summary: "Delegar a un agente sin perder el control del proyecto.", content: "Proyecto ampliado a varias pantallas con un agente, con registro de cambios.", checklist: ["Cambios del agente revisados"] },
            { id: "tf-l6", title: "Datos y conectores: Google Sheets, APIs y MCP", duration: "120 min", type: "tech", summary: "Guardar y leer datos, claves y variables de entorno.", content: "El proyecto guarda y lee datos de una planilla.", checklist: ["Integración de datos funcionando", "Ninguna clave subida a GitHub"] }
          ]
        },
        {
          id: "tf-m4",
          title: "Encuentros 7 y 8: Dominio propio y casos reales",
          lessons: [
            { id: "tf-l7", title: "Dominio propio y puesta en producción", duration: "120 min", type: "devops", summary: "Registro .ar en NIC Argentina, DNS, HTTPS y protección de datos personales.", content: "Dominio o subdominio configurado, o plan de dominio documentado.", checklist: ["DNS configurado"] },
            { id: "tf-l8", title: "Casos reales y presentación final", duration: "120 min", type: "tech", summary: "Certificados con QR, checklist de campamentos, simuladores 3D; demo final.", content: "Demo de 5 minutos del proyecto final.", checklist: ["Demo presentada"] }
          ]
        }
      ]
    },

    {
      id: "hse-vaca-muerta",
      title: "Inducción HSE Vaca Muerta",
      category: "Seguridad Operacional",
      code: "VM-HSE-101",
      duration: "40 Horas",
      modality: "Virtual Asincrónico + Clases Magistrales en Vivo",
      basePrice: 320000,
      badge: "Mandatorio para Yacimiento",
      rating: 4.9,
      studentsCount: 94,
      image: "https://victorparedes.ar/bg1.jpg",
      description: "Formación regulatoria y de seguridad crítica para supervisores y operarios en yacimientos no convencionales de la Cuenca Neuquina. Incluye marco legal neuquino, permisos de trabajo en frío/caliente, aislamiento de energías peligrosas y protocolos de evacuación médica remota.",
      targetAudience: "Supervisores de servicios petroleros, jefes de campo, técnicos HSE, operadores y contratistas en Vaca Muerta.",
      prerequisites: "Secundario completo y nociones básicas de operaciones de campo.",
      modules: [
        {
          id: "mod-1",
          title: "Módulo 1: Marco Regulatorio Neuquino y Autoridades de Aplicación",
          lessons: [
            {
              id: "hse-l1",
              title: "Leyes Nacionales 26.197, 17.319 y Ley Provincial 1875 de Neuquén",
              duration: "25 min",
              type: "theory",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Video ilustrativo
              summary: "Análisis del marco regulatorio de hidrocarburos en Argentina, federalización de recursos y normativa ambiental de la Secretaría de Ambiente de Neuquén.",
              content: `
### Marco Legal y Autoridades de Aplicación en la Cuenca Neuquina

En yacimientos no convencionales, el supervisor debe operar bajo un estricto cumplimiento del marco legal vigente:
- **Ley Nacional 17.319 y Ley Corta 26.197:** Define la titularidad y administración provincial de los yacimientos hidrocarburíferos.
- **Ley Provincial 1875 (Neuquén):** Preservación, conservación, defensa y mejoramiento del ambiente en actividades extractivas.
- **Resolución SRT 905/15:** Funciones de los servicios de higiene y seguridad en el trabajo y medicina laboral.
- **API RP 15WT & Normas IRAM:** Estándares de calidad de agua y seguridad en tendidos de superficie.

#### Responsabilidad del Supervisor:
1. Asegurar que toda cuadrilla cuente con inducción específica de yacimiento antes del ingreso al pad.
2. Portar copias de autorizaciones provinciales y manifiestos de operadora.
3. Notificar inmediatamente incidentes ambientales al representante de operadora (Company Man) y Subsecretaría de Medio Ambiente.
              `,
              checklist: [
                "Verificar inducción HSE de operadora de todo el personal",
                "Constatar vigencia de exámenes periódicos de salud (ART)",
                "Comprobar disponibilidad de credencial de acceso biométrico a yacimiento"
              ]
            },
            {
              id: "hse-l2",
              title: "Sistema de Permisos de Trabajo Seguro (PTS) y Análisis de Riesgo Operativo (ARO)",
              duration: "35 min",
              type: "procedure",
              summary: "Protocolo para la apertura, firma conjunta, suspensión y cierre de permisos de trabajo en frío, caliente y espacios confinados.",
              content: `
### Protocolo de Permisos de Trabajo Seguro (PTS)

El PTS es el documento legal y operativo no delegable que autoriza la realización de tareas bajo condiciones de riesgo controlado:
1. **PTS en Frío:** Tareas que no involucran fuentes de ignición (inspección visual, tendido manual de mangueras, medición de tanques).
2. **PTS en Caliente:** Tareas que generan chispas o llamas abiertas en zonas clasificadas (corte, soldadura, amolado). Requiere medición continua de explosividad (LEL < 0%).
3. **Ingreso a Espacios Confinados:** Vaciado, purga, bloqueo físico, ventilación forzada y vigía permanente en exterior.

> **Regla de Oro:** Si las condiciones del entorno cambian (viento > 50 km/h, tormenta eléctrica, olor a H2S), el supervisor debe ejercer la **Autoridad de Detención de Trabajo (SWA - Stop Work Authority)**.
              `,
              checklist: [
                "Verificar firma de Company Man y Supervisor de Servicio",
                "Medición de atmósfera (O2 entre 19.5% y 23.5%, LEL = 0%, H2S = 0 ppm)",
                "Disponibilidad de matafuegos triclase de 10 kg y línea de agua cargada en caliente"
              ]
            }
          ]
        },
        {
          id: "mod-2",
          title: "Módulo 2: Riesgos Críticos, Bloqueo LOTO y Emergencias MEDEVAC",
          lessons: [
            {
              id: "hse-l3",
              title: "Aislamiento de Energías Peligrosas (LOTO) en Alta Presión y Electricidad",
              duration: "30 min",
              type: "safety",
              summary: "Despresurización de líneas, enclavamiento de motobombas y colocación de candados y tarjetas personales.",
              content: `
### Procedimiento LOTO (Lockout / Tagout) en Vaca Muerta

En locaciones de fractura y bombeo continuo, las energías hidráulicas residuales representan el mayor riesgo de accidente fatal.

#### Pasos Obligatorios para Energía Cero:
1. **Identificación:** Localizar todas las fuentes de energía (eléctrica, hidráulica de 15.000 PSI, neumática, química).
2. **Notificación:** Avisar al operador de consola y supervisores de servicios adyacentes (SIMOPS).
3. **Apagado y Aislamiento:** Cerrar válvulas maestras, abrir bypass de despresurización, desconectar bornes o breakers.
4. **Purga:** Aliviar presiones residuales mediante manómetros calibrados hasta constatar 0 PSI.
5. **Bloqueo y Etiquetado:** Candado personal rojo + tarjeta con nombre, teléfono y fecha del supervisor.
6. **Verificación de Cero Energía:** Intentar accionamiento manual para verificar ausencia total de movimiento o presión.
              `,
              checklist: [
                "Verificar alivio a cero PSI en manómetro testigo",
                "Colocar aldaba múltiple si intervienen más de un operario",
                "No entregar llaves de candado a terceros bajo ninguna circunstancia"
              ]
            },
            {
              id: "hse-l4",
              title: "Plan de Emergencia Médica y Evacuación (MEDEVAC Añelo - Neuquén)",
              duration: "40 min",
              type: "emergency",
              summary: "Cadena de llamadas de emergencia, helipuertos de campo, botiquín de trauma remoto y rutas de traslado.",
              content: `
### Plan de Respuesta a Emergencias y MEDEVAC

La distancia geográfica de los bloques petroleros (ej. Loma Campana, Bajada del Palo, La Amarga Chica) exige una respuesta médica inmediata y coordinada:
- **Puesto de Salud Añelo:** Primera respuesta y estabilización básica (Distancia promedio: 25-45 km de ripio).
- **Hospital Provincial Castro Rendón (Neuquén Capital):** Centro de alta complejidad y trauma mayor (105 km pavimentados).
- **Aeroevacuación Sanitaria:** Activación de helicóptero en helipuerto de pad o helipunto de cabecera en caso de código rojo (politraumatismo severo, quemaduras > 20%, intoxicación por sulfhídrico).
              `,
              checklist: [
                "Coordenadas GPS del helipunto del pad verificadas con radiooperador",
                "Frecuencia VHF del canal de emergencias de operadora sintonizada",
                "Botiquín con torniquete táctico CAT, férulas y tabla espinal accesible"
              ]
            }
          ]
        }
      ]
    },

    {
      id: "higiene-seguridad-hidrocarburos",
      title: "Higiene y Seguridad en Hidrocarburos",
      category: "Especialización Técnica",
      code: "VM-HYS-201",
      duration: "50 Horas",
      modality: "Virtual con Simuladores de Campo",
      basePrice: 320000,
      badge: "Formación de Supervisores",
      rating: 4.85,
      studentsCount: 78,
      image: "https://victorparedes.ar/bg4.jpg",
      description: "Profundización en gestión de higiene industrial, monitoreo de sulfhídrico (H2S), control de atmósferas explosivas (ATEX), gestión integral de residuos especiales (Decreto 2263/15) y mitigación de factores de riesgo psicosocial en régimen 14x14.",
      targetAudience: "Supervisores de producción, coordinadores de maniobra, inspectores técnicos y profesionales de seguridad e higiene.",
      prerequisites: "Inducción básica HSE o experiencia previa en yacimiento comprobable.",
      modules: [
        {
          id: "hys-m1",
          title: "Módulo 1: Toxicología en Pozos, Sulfhídrico (H2S) y Espacios Confinados",
          lessons: [
            {
              id: "hys-l1",
              title: "Propiedades del Gas Sulfhídrico y Sistemas de Detección Fija/Personal",
              duration: "30 min",
              type: "safety",
              summary: "Comportamiento del gas más pesado que el aire, umbrales de toxicidad (TLV-TWA 1 ppm, IDLH 100 ppm) y uso de detectores cuádruples multigas.",
              content: `
### Manejo Crítico de Sulfhídrico (H2S)

El H2S es un gas incoloro, inflamable, extremadamente tóxico y más denso que el aire, acumulándose en depresiones, piletas y zanjas.
- A bajas concentraciones tiene olor a huevos podridos; a más de 100 ppm **anula el sentido del olfato** en segundos, provocando desvanecimiento y asfixia inmediata.
- En Vaca Muerta, las formaciones profundas presentan trazas variables durante flowback y ensayos de pozo.
              `,
              checklist: [
                "Calibración de detectores de gas con prueba funcional bump-test diaria",
                "Ubicación de mangas de viento visibles en locación para plan de escape",
                "Equipos de respiración autónoma (ERA) presurizados a 2200 PSI"
              ]
            },
            {
              id: "hys-l2",
              title: "Gestión Ambiental y Manifiestos de Residuos Especiales MERE (Decreto 2263/15)",
              duration: "35 min",
              type: "procedure",
              summary: "Clasificación de corrientes Y08, Y18, Y48, almacenamiento transitorio en bateas y transporte habilitado.",
              content: `
### Régimen MERE de Residuos Especiales en Neuquén

Bajo el Decreto provincial 2263/15, todo residuo contaminado con hidrocarburos o fluidos de perforación debe ser gestionado documentalmente:
- **Y48:** Materiales absorbentes, trapos, fajas y EPP impregnados con crudo o gasoil.
- **Y08:** Aceites lubricantes usados de motobombas y compresores.
- **Y18:** Residuos resultantes de las operaciones de eliminación de desechos industriales.
              `,
              checklist: [
                "Bandejas de contención secundaria bajo todas las motobombas y tanques cisterna",
                "Hojas de ruta y manifiestos de transporte firmados por generador habilitado",
                "Kit antiderrame compuesto por paños oleofílicos, turba absorbente y bolsas amarillas"
              ]
            }
          ]
        }
      ]
    },
  ],
  // 2. Cohortes 2027 (fechas a confirmar por Dirección Técnica)
  cohorts: [
    {
      id: "cohorte-pas-1",
      name: "Pasaporte · Cohorte 1 · 2027",
      courseId: "pasaporte-vaca-muerta",
      courseTitle: "Pasaporte a Vaca Muerta",
      startDate: null,
      endDate: null,
      capacity: 35,
      enrolled: 0,
      tutor: "Lic. Víctor Javier Paredes",
      schedule: "A confirmar",
      status: "Preinscripción abierta",
      roomLink: "",
      notes: "Fecha de inicio a confirmar."
    },
    {
      id: "cohorte-wt-1",
      name: "Water Transfer N1 · Cohorte 1 · 2027",
      courseId: "water-transfer-n1",
      courseTitle: "Water Transfer Nivel 1 — Fundamentos",
      startDate: null,
      endDate: null,
      capacity: 35,
      enrolled: 0,
      tutor: "Lic. Víctor Javier Paredes",
      schedule: "A confirmar",
      status: "Preinscripción abierta",
      roomLink: "",
      notes: "Fecha de inicio a confirmar."
    },
    {
      id: "cohorte-tf-1",
      name: "Tech & Field · Cohorte 1 · 2027",
      courseId: "tech-field",
      courseTitle: "Tech & Field: Desarrollo, Apps y Automatización",
      startDate: null,
      endDate: null,
      capacity: 30,
      enrolled: 0,
      tutor: "Lic. Víctor Javier Paredes",
      schedule: "A confirmar",
      status: "Preinscripción abierta",
      roomLink: "",
      notes: "Fecha de inicio a confirmar."
    },
    {
      id: "cohorte-hse-1",
      name: "Inducción HSE · Cohorte 1 · 2027",
      courseId: "hse-vaca-muerta",
      courseTitle: "Inducción HSE Vaca Muerta",
      startDate: null,
      endDate: null,
      capacity: 35,
      enrolled: 0,
      tutor: "Lic. Víctor Javier Paredes",
      schedule: "A confirmar",
      status: "Preinscripción abierta",
      roomLink: "",
      notes: "Fecha de inicio a confirmar."
    }
  ],

  // 3. Coordinadores Comerciales Provinciales (Comisión del 30%)
  coordinators: [
    {
      id: "coord-cuyo",
      username: "coord.cuyo",
      password: "cuyo2026",
      name: "Lic. Gastón Albarracín",
      province: "Cuyo (Mendoza y San Juan)",
      email: "cuyo@vacamuertaconsulting.com.ar",
      phone: "+54 9 261 488-9120",
      promoCode: "CUYO30",
      commissionRate: 0.30,
      targetGoal: 50, // Meta de 50 inscripciones a febrero
      activeReferralsCount: 38,
      totalSalesRevenue: 13760000,
      commissionEarned: 4128000,
      commissionPaid: 3200000,
      commissionPending: 928000,
      notes: "Gran captación de postulantes de Malargüe y Luján de Cuyo."
    },
    {
      id: "coord-cba",
      username: "coord.cba",
      password: "cordoba2026",
      name: "Ing. Mariana Benítez",
      province: "Córdoba",
      email: "cordoba@vacamuertaconsulting.com.ar",
      phone: "+54 9 351 612-4455",
      promoCode: "CBA30",
      commissionRate: 0.30,
      targetGoal: 45,
      activeReferralsCount: 29,
      totalSalesRevenue: 10480000,
      commissionEarned: 3144000,
      commissionPaid: 2500000,
      commissionPending: 644000,
      notes: "Convenio con asociaciones técnicas y egresados de ingeniería industrial."
    },
    {
      id: "coord-bba",
      username: "coord.bba",
      password: "bba2026",
      name: "Téc. Lucas Ferreyra",
      province: "Buenos Aires y La Pampa",
      email: "bsas@vacamuertaconsulting.com.ar",
      phone: "+54 9 11 5092-7711",
      promoCode: "BBA30",
      commissionRate: 0.30,
      targetGoal: 60,
      activeReferralsCount: 44,
      totalSalesRevenue: 15920000,
      commissionEarned: 4776000,
      commissionPaid: 3900000,
      commissionPending: 876000,
      notes: "Enlace clave para técnicos de Bahía Blanca y Zona Sur del Conurbano."
    }
  ],

  // 4. Base de Usuarios y Alumnos (RBAC y Red de Referidos)
  users: [
    // Rol A: Administrador / Dirección Técnica
    {
      id: "user-admin",
      username: "vparedes",
      password: "admin2026",
      role: "admin",
      name: "Lic. Víctor Javier Paredes",
      license: "Mat. Profesional PA 446",
      title: "Director Técnico",
      email: "vparedes2@gmail.com",
      phone: "+54 9 299 460-3071",
      avatar: "https://victorparedes.ar/foto.jpg"
    },

    // Rol B: Coordinadores (mapeados también en tabla de usuarios para login directo)
    {
      id: "user-coord-cuyo",
      username: "coord.cuyo",
      password: "cuyo2026",
      role: "coordinator",
      coordinatorId: "coord-cuyo",
      name: "Lic. Gastón Albarracín",
      email: "cuyo@vacamuertaconsulting.com.ar",
      zone: "Cuyo"
    },
    {
      id: "user-coord-cba",
      username: "coord.cba",
      password: "cordoba2026",
      role: "coordinator",
      coordinatorId: "coord-cba",
      name: "Ing. Mariana Benítez",
      email: "cordoba@vacamuertaconsulting.com.ar",
      zone: "Córdoba"
    },
    {
      id: "user-coord-bba",
      username: "coord.bba",
      password: "bba2026",
      role: "coordinator",
      coordinatorId: "coord-bba",
      name: "Téc. Lucas Ferreyra",
      email: "bsas@vacamuertaconsulting.com.ar",
      zone: "Buenos Aires"
    },

    // Rol C: Alumno de Prueba Oficial
    {
      id: "user-alumno01",
      username: "alumno01",
      password: "seguridad123",
      role: "student",
      academicStatus: "cursando",
      name: "Esteban Morales",
      dni: "34.892.115",
      email: "esteban.morales@petrolera.com.ar",
      phone: "+54 9 299 555-0142",
      province: "Neuquén",
      city: "Añelo",
      cohorteId: "cohorte-wt-1",
      enrolledCourses: ["water-transfer-n1", "hse-vaca-muerta"],
      progress: {
        "water-transfer-n1": {
          completedLessons: ["wt-l1"],
          percent: 33,
          lastAccess: "2026-02-01T14:30:00"
        },
        "hse-vaca-muerta": {
          completedLessons: ["hse-l1", "hse-l2"],
          percent: 50,
          lastAccess: "2026-01-30T18:15:00"
        }
      },
      // Programa de Referidos del Estudiante:
      // Base: 2 referidos inscriptos y pagados (40% de reintegro post-cursado acumulado)
      referralCode: "alumno01",
      referrals: [
        {
          id: "ref-101",
          name: "Joaquín Ceballos",
          dni: "36.112.443",
          email: "jceballos@campo-frac.com",
          courseId: "water-transfer-n1",
          courseTitle: "Water Transfer Nivel 1 — Fundamentos",
          status: "Inscripto y Pagado",
          paymentStatus: "paid",
          isPaid: true,
          paidAmount: 400000,
          registeredAt: "2026-01-20",
          discountGenerated: 0.20
        },
        {
          id: "ref-102",
          name: "Nicolás Giménez",
          dni: "35.980.221",
          email: "ngimenez.ops@gmail.com",
          courseId: "hse-vaca-muerta",
          courseTitle: "Inducción HSE Vaca Muerta",
          status: "Inscripto y Pagado",
          paymentStatus: "paid",
          isPaid: true,
          paidAmount: 320000,
          registeredAt: "2026-01-28",
          discountGenerated: 0.20
        }
      ]
    },

    // Alumnos adicionales para auditoría y simulación de cohorte
    {
      id: "user-alumno02",
      username: "mrodriguez",
      password: "seguridad123",
      role: "student",
      academicStatus: "cursando",
      name: "Martín Rodríguez",
      dni: "33.401.992",
      email: "m.rodriguez@servicios-vm.com",
      phone: "+54 9 299 441-8930",
      province: "Río Negro",
      city: "Cipolletti",
      cohorteId: "cohorte-wt-1",
      enrolledCourses: ["water-transfer-n1"],
      progress: { "water-transfer-n1": { completedLessons: ["wt-l1", "wt-l2"], percent: 66, lastAccess: "2026-02-02T10:00:00" } },
      referralCode: "mrodriguez",
      referrals: [
        { id: "ref-201", name: "Gonzalo Paz", dni: "37.512.001", courseTitle: "Water Transfer Nivel 1", status: "Inscripto y Pagado", paymentStatus: "paid", isPaid: true, paidAmount: 400000, registeredAt: "2026-01-25", discountGenerated: 0.20 },
        { id: "ref-202", name: "Federico Luján", dni: "38.109.432", courseTitle: "HSE Vaca Muerta", status: "Inscripto y Pagado", paymentStatus: "paid", isPaid: true, paidAmount: 320000, registeredAt: "2026-01-26", discountGenerated: 0.20 },
        { id: "ref-203", name: "Claudio Vera", dni: "32.908.771", courseTitle: "Higiene y Seguridad", status: "Inscripto y Pagado", paymentStatus: "paid", isPaid: true, paidAmount: 320000, registeredAt: "2026-01-27", discountGenerated: 0.20 },
        { id: "ref-204", name: "Sergio Mansilla", dni: "35.402.112", courseTitle: "Water Transfer Nivel 1", status: "Inscripto y Pagado", paymentStatus: "paid", isPaid: true, paidAmount: 400000, registeredAt: "2026-01-29", discountGenerated: 0.20 },
        { id: "ref-205", name: "Darío Figueroa", dni: "34.110.887", courseTitle: "HSE Vaca Muerta", status: "Inscripto y Pagado", paymentStatus: "paid", isPaid: true, paidAmount: 320000, registeredAt: "2026-01-31", discountGenerated: 0.20 },
        { id: "ref-206", name: "Esteban Quiroga", dni: "36.220.910", courseTitle: "Water Transfer Nivel 1", status: "Inscripto y Pagado", paymentStatus: "paid", isPaid: true, paidAmount: 400000, registeredAt: "2026-02-01", discountGenerated: 0.20 }
      ] // ¡6 referidos pagados = 100% bonificado ($400k) + $80k ganancia neta en dinero por el 6to!
    },
    {
      id: "user-alumno03",
      username: "cvalenzuela",
      password: "seguridad123",
      role: "student",
      academicStatus: "cursando",
      name: "Cristian Valenzuela",
      dni: "37.890.114",
      email: "cvalenzuela@transporte-gas.com",
      phone: "+54 9 261 511-0988",
      province: "Mendoza",
      city: "Malargüe",
      cohorteId: "cohorte-hse-1",
      enrolledCourses: ["hse-vaca-muerta"],
      progress: { "hse-vaca-muerta": { completedLessons: [], percent: 0, lastAccess: "2026-02-01T09:00:00" } },
      referralCode: "cvalenzuela",
      referrals: []
    },

    // Perfil de Egresado (Fase 2: Comisión Permanente del 15% por cada referido abonado)
    {
      id: "user-egresado01",
      username: "egresado01",
      password: "seguridad123",
      role: "student",
      academicStatus: "egresado",
      graduatedAt: "2026-01-15",
      certificateNumber: "VMC-CERT-2026-089",
      name: "Ing. Lucas Benítez (Egresado)",
      dni: "31.902.115",
      email: "lbenitez@ingenieria-petrolera.com",
      phone: "+54 9 299 412-3344",
      province: "Neuquén",
      city: "Añelo",
      cohorteId: "cohorte-wt-1",
      enrolledCourses: ["water-transfer-n1"],
      progress: { "water-transfer-n1": { completedLessons: ["wt-l1", "wt-l2", "wt-l3"], percent: 100, lastAccess: "2026-02-01T18:00:00" } },
      referralCode: "egresado01",
      // Referidos del egresado: 2 pagados (comisión 15% c/u = $120.000) y 1 pendiente (sin pago, $0 comisión)
      referrals: [
        {
          id: "ref-e1",
          name: "Marcos Del Río",
          dni: "36.441.902",
          email: "mdelrio@frac-services.com",
          courseTitle: "Water Transfer Nivel 1 — Fundamentos",
          paidAmount: 400000,
          paymentStatus: "paid",
          isPaid: true,
          registeredAt: "2026-01-22",
          status: "Arancel Abonado (Válido)"
        },
        {
          id: "ref-e2",
          name: "Sebastián Morán",
          dni: "34.881.002",
          email: "smoran@cuenca-ops.com",
          courseTitle: "Water Transfer Nivel 1 — Fundamentos",
          paidAmount: 400000,
          paymentStatus: "paid",
          isPaid: true,
          registeredAt: "2026-01-29",
          status: "Arancel Abonado (Válido)"
        },
        {
          id: "ref-e3",
          name: "Alejandro Sosa",
          dni: "37.102.883",
          email: "asosa@perforacion.com",
          courseTitle: "Inducción HSE Vaca Muerta",
          paidAmount: 320000,
          paymentStatus: "pending",
          isPaid: false,
          registeredAt: "2026-02-02",
          status: "Inscripto (Pago Pendiente)"
        }
      ]
    }
  ]
};
