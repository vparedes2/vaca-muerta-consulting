# Vaca Muerta Consulting · Plataforma Web LMS & Supervisión Operativa

Plataforma web de formación técnica profesional para la industria upstream en la **Cuenca Neuquina (Vaca Muerta)**, inspirada en la arquitectura modular de **[Frappe LMS](https://github.com/frappe/lms)** y desarrollada como una **Single Page Application (SPA)** de arquitectura limpia, reactiva, desacoplada y lista para versionado en **GitHub** y despliegue continuo en **Vercel / Cloudflare / Netlify**.

---

## 1. Aval Institucional & Dirección Técnica

* **Entidad:** Vaca Muerta Consulting
* **Dirección Técnica & Académica:** Lic. Víctor Javier Paredes
* **Matrícula Profesional:** PA 446
* **Área de Incidencia:** Cuenca Neuquina (Añelo, Rincón de los Sauces, San Patricio del Chañar, Loma Campana, Bajada del Palo).
* **Alcance Operativo:** Supervisores y cuadrillas en diagramas 14x14 para operaciones simultáneas (SIMOPS) de Water Transfer, Well Testing, Flowback, Fractura Hidráulica y Seguridad Operacional.

---

## 2. Arquitectura Inspirada en Frappe LMS

La plataforma adapta el modelo relacional de **DocTypes** de Frappe Framework al paradigma de una SPA moderna de alto rendimiento sin requerir entornos de compilación pesados:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRAPPE LMS MAPPING                              │
├────────────────────────┬───────────────────────────────────────────────┤
│ Concepto Frappe LMS    │ Implementación en Vaca Muerta Consulting SPA │
├────────────────────────┼───────────────────────────────────────────────┤
│ LMS Course (DocType)   │ src/data/seedData.js (courses) & courseService│
│ LMS Chapter / Lesson   │ modules & lessons jerárquicos en LMSPlayer.js │
│ LMS Batch / Cohort     │ src/services/cohortService.js (Febrero A/B)   │
│ LMS Enrollment         │ studentCourses & seguimiento porcentual       │
│ Referral Program       │ src/services/referralService.js (20%/100%)    │
│ Sales Partner          │ src/services/coordinatorService.js (30% com.) │
│ Payment Request / Gate │ src/services/paymentService.js (Mercado Pago) │
│ Role Permission Manager│ src/services/authService.js (RBAC 3 Perfiles) │
└────────────────────────┴───────────────────────────────────────────────┘
```

### Clean Architecture en el Frontend:
```text
/
├── index.html                   # Entry point semántico HTML5 y configuración de Tailwind
├── vercel.json                  # Reglas de reescritura SPA y cabeceras de seguridad
├── package.json                 # Metadatos del proyecto y scripts de arranque local
├── README.md                    # Documentación técnica y manual de despliegue
└── src/
    ├── data/
    │   └── seedData.js          # Base de datos inicial (Cursos, Alumnos, Cohortes, Coordinadores)
    ├── services/
    │   ├── storageService.js    # Capa de abstracción de datos (localStorage / Adaptador REST)
    │   ├── authService.js       # Control de sesiones y permisos jerárquicos (RBAC)
    │   ├── courseService.js     # Catálogo oficial, lecciones y progreso pedagógico
    │   ├── cohortService.js     # Grupos escalonados para 190+ alumnos (cupos y tutorías)
    │   ├── referralService.js   # Lógica del 20% por colega y 100% bonificado con reintegro
    │   ├── coordinatorService.js# Comisiones comerciales del 30% y metas de febrero
    │   └── paymentService.js    # Integración con checkout dinámico de Mercado Pago
    ├── components/
    │   ├── Navbar.js            # Barra de navegación institucional reactiva
    │   ├── HomeView.js          # Landing page técnica con calculadora de ahorro
    │   ├── CatalogView.js       # Catálogo oficial con fechas de cohorte y valores
    │   ├── LoginModal.js        # Acceso con selección rápida en 1 clic
    │   ├── AdminDashboard.js    # Panel Dirección Técnica (ABM alumnos, cohortes, referidos)
    │   ├── CoordinatorView.js   # Panel Promotor Provincial (30% comisión y metas)
    │   ├── StudentPortal.js     # Campus Alumno (cursos, enlace personal y recálculo MP)
    │   ├── LMSPlayer.js         # Reproductor Frappe LMS (lecciones, video, checklists, test)
    │   └── CheckoutModal.js     # Pasarela interactiva de pago Mercado Pago
    ├── utils/
    │   └── formatters.js        # Formato de moneda ARS, fechas y sistema Toast
    └── app.js                   # Enrutador cliente SPA y bus de eventos
```

---

## 3. Pila Tecnológico-Visual: "Grafito Técnico"

La interfaz fue diseñada con una estética industrial premium orientada al sector energético:

* **Lienzo Principal (`brand.base`):** `#24282C` (Grafito Técnico Industrial)
* **Contenedores y Tarjetas (`brand.card`):** `#1B1F23` (Grafito Profundo de Panel)
* **Acentos y Primarios (`brand.accent`):** `#74ACDF` (Celeste Cuenca Neuquina / Acento Técnico)
* **Alertas y Seguridad (`brand.alert`):** `#FFB000` (Ámbar Industrial de Advertencia de Campo)
* **Aprobación / Operativo:** `#10B981` (Verde Seguro)
* **Tipografías:**
  - `Outfit`: Títulos y números de alto impacto.
  - `Inter`: Lectura fluida de procedimientos y normativas.
  - `JetBrains Mono`: Datos de presión (PSI), caudales (m³/h), códigos y credenciales.

---

## 4. Matriz de Roles y Permisos (RBAC)

La plataforma cuenta con 3 perfiles diferenciados con credenciales precargadas para evaluación inmediata:

| Perfil | Usuario | Contraseña | Alcance y Funcionalidades |
| :--- | :--- | :--- | :--- |
| **A. Dirección Técnica / Admin** | `vparedes` | `admin2026` | • **ABM Global de Alumnos & Egresados:** Alta, baja, modificación, DNI, teléfono, estado académico (`cursando` vs `egresado`).<br>• **Gestión de Cohortes (190+ alumnos):** Creación y control de cupos escalonados (Febrero A/B, Marzo) para evitar saturación de tutorías.<br>• **Auditoría de Referidos & Reintegros:** Control de reintegros de hasta el 100% (+ ganancia extra >5) y liquidación de comisiones a egresados.<br>• **Control de Colaboradores / Coordinadores:** Alta, liquidación y **eliminación de colaboradores** con revocación de códigos.<br>• **Gestión de Tarifas:** Modificación de aranceles y pasarela Mercado Pago. |
| **B. Promotor Provincial** | `coord.cuyo`<br>`coord.cba`<br>`coord.bba` | `cuyo2026`<br>`cordoba2026`<br>`bba2026` | • Panel adaptado por provincia (Cuyo, Córdoba, Buenos Aires).<br>• Seguimiento de inscriptos directos en su zona geográfica.<br>• Cálculo automatizado de su **comisión del 30%** sobre la facturación real.<br>• Control de metas comerciales de aquí a febrero (ej. 50 alumnos).<br>• Generador de enlace promocional único (`?promo=CUYO30`). |
| **C. Alumno en Cursado** | `alumno01` | `seguridad123` | • **Campus & Reproductor LMS:** Lecciones modulares, videos, checklists operativos de campo.<br>• **Billetera de Reintegros:** Cobro inicial 100%. Reintegro del 20% por colega post-cursado; 5 colegas = 100% bonificado; >5 colegas = 100% reintegro + 20% de ganancia neta extra en efectivo.<br>• **Panel de Control de Referidos:** Visualización de colegas inscriptos en tiempo real con simulador interactivo. |
| **D. Egresado Oficial** | `egresado01` | `seguridad123` | • **Comisión Permanente de Egresado (15%):** Gana 15% de comisión en efectivo por cada colega referido inscripto con su código que **abone efectivamente su arancel**.<br>• **Auditoría de Pagos:** Distinción en tiempo real entre *Arancel Abonado (Válido)* y *Pago Pendiente (No computable)*.<br>• Liquidación periódica por transferencia bancaria directa. |

---

## 5. Catálogo Oficial y Valores Financieros

Los valores arancelarios oficiales establecidos por la Dirección Técnica son:

1. **Inducción HSE Vaca Muerta** — `$320.000 ARS` (Código: `VM-HSE-101`) · *Foto de campo Cuenca Neuquina*
2. **Higiene y Seguridad en Hidrocarburos** — `$320.000 ARS` (Código: `VM-HYS-201`) · *Locación al ocaso en yacimiento*
3. **Operador de Water Transfer Nivel 1 y 2** — `$400.000 ARS` (Código: `VM-WT-301`) · *Manipulador layflat 12" en campo*
4. **Dev & Deploy: Apps en la Nube** — `$150.000 ARS` (Código: `VM-DEV-401`) · *Software hidráulico y telemetría web*

### Fórmulas Financieras del Ecosistema:

#### 1. Durante el Cursado (Alumno Regular):
* **Pago al Ingresar:**
  $$\text{Matrícula a Abonar en Pasarela} = \text{Arancel Oficial (100\%) Sin Descuentos Previos}$$

* **Reintegro del Valor del Curso al Finalizar:**
  $$\text{Reintegro del Curso} = \text{Arancel Oficial} \times \min(1.0, \text{Colegas Abonados} \times 0.20)$$

* **Ganancia Neta Extra en Efectivo (a partir del 6to Colega):**
  $$\text{Ganancia Neta Extra} = \max(0, \text{Colegas Abonados} - 5) \times (\text{Arancel Oficial} \times 0.20)$$

* **Total Liquidado por Transferencia al Alumno:**
  $$\text{Total Liquidado} = \text{Reintegro del Curso} + \text{Ganancia Neta Extra}$$

#### 2. Luego de Egresado (Comisión Permanente):
* **Comisión por Cada Referido Inscripto y Pagado:**
  $$\text{Comisión Egresado} = \sum_{\text{referidos abonados}} (\text{Arancel del Curso Abonado} \times 0.15)$$
  *(Condición excluyente: el referido debe tener su pago acreditado para ser válido).*

#### 3. Red Comercial de Coordinadores Provinciales:
* **Comisión Promotores Provinciales:**
  $$\text{Comisión Promotor (30\%)} = \text{Facturación Cobrada en Zona} \times 0.30$$


---

## 6. Manual de Despliegue Paso a Paso

### Opción A: Despliegue Continuo en Vercel (Recomendado)
1. Sube este repositorio a tu cuenta de **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) y selecciona **Add New Project**.
3. Importa el repositorio `vaca-muerta-consulting-lms`.
4. En **Framework Preset**, selecciona **Other** (el archivo `vercel.json` incluido gestiona automáticamente las rutas de la SPA).
5. Haz clic en **Deploy**. En menos de 30 segundos tu plataforma estará en línea con certificado SSL gratuito y CDN global.

### Opción B: Ejecución Local en Entorno de Desarrollo
Puedes probar la plataforma de forma local usando cualquier servidor estático:

#### Con Python:
```bash
python -m http.server 3000
```
Luego abre tu navegador en `http://localhost:3000`.

#### Con Node.js / npx:
```bash
npx serve -l 3000 .
```

---

## 7. Hoja de Ruta para Conexión con Backend Persistente

La capa `src/services/storageService.js` implementa el patrón **Repository**. Para migrar de almacenamiento local a un backend en la nube:

* **Opción Supabase:**
  Reemplazar los métodos `get` y `set` de `storageService.js` por llamadas a cliente `supabase.from('courses').select()` respetando los esquemas de tablas ya modelados en `seedData.js`.
* **Opción Frappe REST API:**
  Apuntar las consultas a los endpoints de Frappe `/api/resource/LMS Course` y `/api/resource/LMS Enrollment` pasando la cookie de sesión del Frappe Framework.

---

## 8. Licencia y Créditos

* **Desarrollo:** Soluciones Open-Source inspiradas en Frappe LMS.
* **Propiedad Intelectual y Dirección:** Lic. Víctor Javier Paredes (Matrícula Profesional PA 446).
* **Año:** 2026.
