/**
 * Vaca Muerta Consulting - Seed Data
 * DocTypes inspirados en Frappe LMS: Course, Chapter, Lesson, Student, Cohort, Referral, Coordinator
 */

export const INITIAL_DATA = {
  settings: {
    institution: "Vaca Muerta Consulting",
    director: "Lic. Víctor Javier Paredes",
    license: "Mat. Profesional PA 446",
    tagline: "Formación Profesional Upstream & Supervisión Operativa en Vaca Muerta",
    mpPublicKey: "APP_USR-782194829-0129-VMCONSULTING-PROD",
    mpAccessToken: "APP_USR-TEST-TOKEN-VM-2026",
    referralDiscountPerPerson: 0.20, // 20%
    referralFullDiscountCount: 5,    // 5 referidos = 100% bonificado con reintegro
    coordinatorCommissionRate: 0.30 // 30% de comisión comercial
  },

  // 1. Catálogo Oficial de Cursos
  courses: [
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
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
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
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      description: "Profundización en gestión de higiene industrial, monitoreo de sulfhídrico (H2S), control de atmósferas explosivas (ATEX), gestión integral de residuos especiales (Res. 2263/15) y mitigación de factores de riesgo psicosocial en régimen 14x14.",
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
              title: "Gestión Ambiental y Manifiestos de Residuos Especiales MERE (Res. 2263/15)",
              duration: "35 min",
              type: "procedure",
              summary: "Clasificación de corrientes Y08, Y18, Y48, almacenamiento transitorio en bateas y transporte habilitado.",
              content: `
### Régimen MERE de Residuos Especiales en Neuquén

Bajo la Resolución 2263/15, todo residuo contaminado con hidrocarburos o fluidos de perforación debe ser gestionado documentalmente:
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

    {
      id: "water-transfer-1-2",
      title: "Operador de Water Transfer Nivel 1 y 2",
      category: "Operaciones de Campo",
      code: "VM-WT-301",
      duration: "60 Horas",
      modality: "Virtual Intensivo + Prácticas de Simulación Hidráulica",
      basePrice: 400000,
      badge: "Alta Demanda Laboral",
      rating: 4.95,
      studentsCount: 112,
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      description: "Programa maestro para supervisores y operadores de abastecimiento de agua en fractura hidráulica. Cubre captación en río/lago, cálculo de pérdidas de carga, tendido de mangueras layflat de 12\", estaciones de rebombeo booster, montaje de tanques australianos de 2.500 m³ y telemetría SCADA.",
      targetAudience: "Operadores de bomba, maquinistas de manipulador telescópico, supervisores de traza y personal de logística de agua.",
      prerequisites: "Conocimientos mecánicos básicos e interés en operaciones de alta exigencia.",
      modules: [
        {
          id: "wt-m1",
          title: "Módulo 1: Captación, Hidráulica de Mangueras Layflat y Estaciones Booster",
          lessons: [
            {
              id: "wt-l1",
              title: "Caudales de Fractura, Curvas de Bomba e Hidráulica de 12 Pulgadas",
              duration: "45 min",
              type: "engineering",
              summary: "Demandas de 800 a 1.200 m³/h por etapa de fractura, cálculo de fricción, velocidad de flujo y selección de bombas centrífugas.",
              content: `
### Abastecimiento Hidráulico de Frac en Vaca Muerta

Un pad moderno de 4 a 6 pozos en Vaca Muerta demanda hasta 40.000 m³ de agua por etapa intensiva de fractura hidráulica:
- **Caudal continuo requerido:** 800 a 1.200 m³/h (50 a 75 barriles por minuto - BPM).
- **Mangueras flexibles Layflat de Poliuretano/Nitrilo:** Diámetros de 10" y 12" de alta presión (Working Pressure 200 a 250 PSI, Burst Pressure > 600 PSI).
- **Estaciones de Rebombeo (Booster):** Instaladas cada 4 a 6 km según la topografía y desniveles geográficos de la estepa neuquina.
              `,
              checklist: [
                "Cálculo de NPSH disponible en punto de succión de bombas de río",
                "Verificación de torque en abrazaderas de punteras de 12\"",
                "Control de nivel de combustible diésel y refrigerante en motobombas principales"
              ]
            },
            {
              id: "wt-l2",
              title: "Tendido Seguro con Manipuladores Telescópicos y Cruces Soterrados",
              duration: "40 min",
              type: "field-work",
              summary: "Maniobras con carreteles hidráulicos, radios de curvatura, cruces de caminos petroleros con camisas metálicas y parches de emergencia.",
              content: `
### Despliegue de Líneas Layflat en Terrenos Agrestes

El tendido de 18 a 30 km de manguera exige una coordinación milimétrica entre el operador del manipulador telescópico y el cuadrillero:
- Velocidad máxima de desenrollado: 5 km/h para evitar torsiones axiales.
- Cruces de cañadones y picadas: Instalación obligatoria de caños camisa (casing) de 16" soterrados a 1.20 metros de profundidad.
- Kits de reparación rápida de pinchazos: Colocación de abrazaderas partidas articuladas bajo presión sin detener el bombeo crítico.
              `,
              checklist: [
                "Inspección previa de picada libre de piedras filosas y matas punzantes",
                "Colocación de venteos automáticos de aire (air release valves) en crestas topográficas",
                "Presurización escalonada: 50 PSI, 100 PSI hasta régimen de trabajo"
              ]
            }
          ]
        },
        {
          id: "wt-m2",
          title: "Módulo 2: Montaje y Operación de Tanques Australianos de 2.500 m³ en Pad",
          lessons: [
            {
              id: "wt-l3",
              title: "Nivelación de Terreno, Armado de Chapas Curvas y Colocación de Geomembrana",
              duration: "50 min",
              type: "construction",
              summary: "Geometría del tanque australiano, torqueo de bulonería de alta resistencia, colocación de lona PVC y pruebas de estanqueidad.",
              content: `
### Montaje Seguro de Tanques Australianos en Pad de Fractura

Para amortiguar las demandas pico de los camiones fracturadores, se instalan baterías de 2 a 4 tanques australianos modulares:
- Diámetro típico: 36 a 42 metros; altura de 2.40 metros (capacidad 2.500 m³ / 15.700 barriles por tanque).
- Bulonería Grado 8 con tuerca autofrenante y par de apriete verificado con torquímetro calibrado.
- Geomembrana de polietileno de alta densidad (HDPE) de 1.000 a 1.500 micrones protegida con geotextil antipunzonamiento.
              `,
              checklist: [
                "Nivelación óptica del lecho con tolerancia menor a 3 cm entre extremos",
                "Revisión de no formación de arrugas ni embolsamientos por viento antes del llenado",
                "Instalación de succión flotante y manifolds de descarga de 12\" con válvulas mariposa"
              ]
            }
          ]
        }
      ]
    },

    {
      id: "dev-deploy-cloud",
      title: "Dev & Deploy: Apps en la Nube",
      category: "Tecnología & Digitalización",
      code: "VM-DEV-401",
      duration: "30 Horas",
      modality: "100% Online con Laboratorios GitHub y Vercel",
      basePrice: 150000,
      badge: "Innovación & Industria 4.0",
      rating: 4.9,
      studentsCount: 42,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      description: "Curso de modernización tecnológica enfocado en supervisores, analistas de datos y desarrolladores que necesitan construir y desplegar herramientas digitales para operaciones de yacimiento: tableros SCADA en web, SPAs con arquitectura limpia, control de versiones en GitHub y CI/CD en Vercel.",
      targetAudience: "Técnicos, supervisores con interés digital, analistas de datos y programadores que desarrollan soluciones para Oil & Gas.",
      prerequisites: "Manejo básico de computación e interés en desarrollo web moderno.",
      modules: [
        {
          id: "dev-m1",
          title: "Módulo 1: Arquitectura Web Moderna, Git y Despliegue en la Nube",
          lessons: [
            {
              id: "dev-l1",
              title: "Fundamentos de Single Page Applications (SPA) y Clean Architecture",
              duration: "30 min",
              type: "tech",
              summary: "Estructuración de vistas desacopladas, capa de servicios, persistencia y patrones modulares inspirados en Frappe.",
              content: `
### Clean Architecture en Soluciones Industriales Web

La digitalización del yacimiento demanda interfaces ultrarrápidas, tolerantes a baja conectividad y fácilmente mantenibles:
- **Separación de Capas:** Componentes de interfaz (UI), Capa de Negocio / Servicios, y Capa de Persistencia / Almacenamiento.
- **Sin compiladores pesados para el operador:** Uso de JavaScript ES6+ nativo con módulos estandarizados que corren directamente en cualquier navegador o tableta de campo.
- **Diseño Responsivo con Tailwind CSS:** Consistencia de diseño técnico industrial tanto en computadoras de cabina de control como en celulares en terreno.
              `,
              checklist: [
                "Modularización de vistas en componentes independientes",
                "Mapeo de estado centralizado sin dependencias externas innecesarias",
                "Garantizar compatibilidad offline mediante localStorage y service workers"
              ]
            },
            {
              id: "dev-l2",
              title: "Control de Versiones en GitHub y Automatización de Despliegue en Vercel",
              duration: "35 min",
              type: "devops",
              summary: "Repositorio limpio en GitHub, ramas de producción y despliegue continuo (CI/CD) con enlace público instantáneo.",
              content: `
### Despliegue Continuo (CI/CD) en Vercel para Plataformas Web

Conectar un repositorio de GitHub con Vercel permite que cada actualización confirmada (commit) se compile y publique en la nube en cuestión de segundos:
1. **Versionado Semántico:** Uso de etiquetas de versión (v1.0.0, v2.0.0) para control de cambios auditables.
2. **Configuración de Vercel (vercel.json):** Reglas de reescritura de rutas para Single Page Applications asegurando que todas las URLs naveguen sin error 404.
3. **Certificados SSL Automáticos y CDN Global:** Disponibilidad 99.99% para acceso desde bases operativas en Añelo o Neuquén.
              `,
              checklist: [
                "Crear repositorio en GitHub con README técnico exhaustivo",
                "Configurar vercel.json con rewrite a index.html",
                "Verificar despliegue exitoso en dominio vercel.app"
              ]
            }
          ]
        }
      ]
    }
  ],

  // 2. Gestión de Cohortes y Fechas de Inicio (190+ alumnos en grupos escalonados)
  cohorts: [
    {
      id: "cohorte-feb-a",
      name: "Cohorte Febrero A (Intensivo)",
      courseId: "water-transfer-1-2",
      courseTitle: "Operador de Water Transfer Nivel 1 y 2",
      startDate: "2026-02-09",
      endDate: "2026-03-20",
      capacity: 30,
      enrolled: 28,
      tutor: "Ing. Marcelo Ríos",
      schedule: "Lunes, Miércoles y Viernes · 19:00 a 21:00 hs",
      status: "Cierre Próximo (Últimos 2 Cupos)",
      roomLink: "https://meet.google.com/vmc-feb-a",
      notes: "Grupo principal de supervisores en rotación 14x14 para inicio temprano."
    },
    {
      id: "cohorte-feb-b",
      name: "Cohorte Febrero B (Vespertino)",
      courseId: "hse-vaca-muerta",
      courseTitle: "Inducción HSE Vaca Muerta",
      startDate: "2026-02-16",
      endDate: "2026-03-27",
      capacity: 30,
      enrolled: 26,
      tutor: "Lic. Víctor Javier Paredes (PA 446)",
      schedule: "Martes, Jueves y Sábados · 19:00 a 21:00 hs",
      status: "Activa (4 Cupos Disponibles)",
      roomLink: "https://meet.google.com/vmc-feb-b",
      notes: "Cohorte con tutoría directa del Director Técnico."
    },
    {
      id: "cohorte-mar-a",
      name: "Cohorte Marzo A (Especializada)",
      courseId: "higiene-seguridad-hidrocarburos",
      courseTitle: "Higiene y Seguridad en Hidrocarburos",
      startDate: "2026-03-02",
      endDate: "2026-04-10",
      capacity: 35,
      enrolled: 18,
      tutor: "Ing. Sofía Gómez",
      schedule: "Lunes a Jueves · 20:00 a 21:30 hs",
      status: "Inscripciones Abiertas",
      roomLink: "https://meet.google.com/vmc-mar-a",
      notes: "Enfoque en protocolos H2S y residuos especiales MERE."
    },
    {
      id: "cohorte-mar-b",
      name: "Cohorte Marzo B (Tech & Cloud)",
      courseId: "dev-deploy-cloud",
      courseTitle: "Dev & Deploy: Apps en la Nube",
      startDate: "2026-03-16",
      endDate: "2026-04-24",
      capacity: 35,
      enrolled: 14,
      tutor: "Lic. Víctor Javier Paredes",
      schedule: "Martes y Jueves · 18:30 a 20:30 hs",
      status: "Inscripciones Abiertas",
      roomLink: "https://meet.google.com/vmc-mar-b",
      notes: "Laboratorios prácticos de código y despliegue Vercel."
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
      title: "Director Técnico & Consultor Senior Upstream",
      email: "direccion@vacamuertaconsulting.com.ar",
      phone: "+54 9 299 412-3456",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80"
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
      name: "Esteban Morales",
      dni: "34.892.115",
      email: "esteban.morales@petrolera.com.ar",
      phone: "+54 9 299 555-0142",
      province: "Neuquén",
      city: "Añelo",
      cohorteId: "cohorte-feb-a",
      enrolledCourses: ["water-transfer-1-2", "hse-vaca-muerta"],
      progress: {
        "water-transfer-1-2": {
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
      // Base: 2 referidos inscriptos y pagados (40% de descuento acumulado)
      referralCode: "alumno01",
      referrals: [
        {
          id: "ref-101",
          name: "Joaquín Ceballos",
          dni: "36.112.443",
          email: "jceballos@campo-frac.com",
          courseId: "water-transfer-1-2",
          courseTitle: "Operador de Water Transfer Nivel 1 y 2",
          status: "Inscripto y Pagado",
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
      name: "Martín Rodríguez",
      dni: "33.401.992",
      email: "m.rodriguez@servicios-vm.com",
      phone: "+54 9 299 441-8930",
      province: "Río Negro",
      city: "Cipolletti",
      cohorteId: "cohorte-feb-a",
      enrolledCourses: ["water-transfer-1-2"],
      progress: { "water-transfer-1-2": { completedLessons: ["wt-l1", "wt-l2"], percent: 66, lastAccess: "2026-02-02T10:00:00" } },
      referralCode: "mrodriguez",
      referrals: [
        { id: "ref-201", name: "Gonzalo Paz", dni: "37.512.001", courseTitle: "Water Transfer 1 y 2", status: "Inscripto y Pagado", registeredAt: "2026-01-25", discountGenerated: 0.20 },
        { id: "ref-202", name: "Federico Luján", dni: "38.109.432", courseTitle: "HSE Vaca Muerta", status: "Inscripto y Pagado", registeredAt: "2026-01-26", discountGenerated: 0.20 },
        { id: "ref-203", name: "Claudio Vera", dni: "32.908.771", courseTitle: "Higiene y Seguridad", status: "Inscripto y Pagado", registeredAt: "2026-01-27", discountGenerated: 0.20 },
        { id: "ref-204", name: "Sergio Mansilla", dni: "35.402.112", courseTitle: "Water Transfer 1 y 2", status: "Inscripto y Confirmado", registeredAt: "2026-01-29", discountGenerated: 0.20 },
        { id: "ref-205", name: "Darío Figueroa", dni: "34.110.887", courseTitle: "HSE Vaca Muerta", status: "Inscripto y Confirmado", registeredAt: "2026-01-31", discountGenerated: 0.20 },
        { id: "ref-206", name: "Esteban Quiroga", dni: "36.220.910", courseTitle: "Water Transfer 1 y 2", status: "Inscripto y Confirmado", registeredAt: "2026-02-01", discountGenerated: 0.20 }
      ] // ¡6 referidos = 100% bonificado ($400k) + $80k ganancia neta en dinero por el 6to!
    },
    {
      id: "user-alumno03",
      username: "cvalenzuela",
      password: "seguridad123",
      role: "student",
      name: "Cristian Valenzuela",
      dni: "37.890.114",
      email: "cvalenzuela@transporte-gas.com",
      phone: "+54 9 261 511-0988",
      province: "Mendoza",
      city: "Malargüe",
      cohorteId: "cohorte-feb-b",
      enrolledCourses: ["hse-vaca-muerta"],
      progress: { "hse-vaca-muerta": { completedLessons: [], percent: 0, lastAccess: "2026-02-01T09:00:00" } },
      referralCode: "cvalenzuela",
      referrals: []
    }
  ]
};
