/**
 * Vaca Muerta Consulting - Home View (Landing Page Institucional)
 * Orientada a quienes planean venir a trabajar a Vaca Muerta: capacitarse antes de viajar,
 * con certificado verificable por QR y avales institucionales.
 */

import { courseService } from '../services/courseService.js';
import { formatPrice, whatsappLink, CONTACT } from '../utils/formatters.js';

const AVALES = [
  {
    name: 'Cámara Argentina para la Formación Profesional y la Capacitación Laboral',
    logo: './assets/avales/camara-argentina-fp.png'
  },
  {
    name: 'Organización Internacional para la Educación Permanente (OIEP)',
    logo: './assets/avales/oiep.png'
  }
];

const PERFILES = [
  {
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
    title: 'Querés entrar a la industria',
    text: 'Sin experiencia, con un oficio o con una carrera terminada: conocé cómo funciona un yacimiento y qué puesto podés buscar.',
    course: 'Pasaporte a Vaca Muerta'
  },
  {
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    title: 'Querés trabajar en water transfer',
    text: 'Aprendé el servicio que abastece de agua a cada fractura: equipos, traza, bombeo y seguridad.',
    course: 'Water Transfer Nivel 1'
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'Te interesa la seguridad',
    text: 'Trabajás en el sector o querés especializarte en higiene y seguridad en hidrocarburos.',
    course: 'Inducción HSE · Higiene y Seguridad en Hidrocarburos'
  },
  {
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    title: 'Querés crear tus propias apps',
    text: 'Armá herramientas digitales para tu trabajo con inteligencia artificial, sin saber programar.',
    course: 'Tech & Field'
  }
];

const PASOS = [
  { n: '01', title: 'Consultá por WhatsApp', text: 'Te asesoramos sobre qué curso te conviene según tu perfil.' },
  { n: '02', title: 'Inscribite', text: 'Reservás tu lugar en la próxima cohorte. Los cupos son de 30 a 35 alumnos.' },
  { n: '03', title: 'Cursá desde tu provincia', text: 'Campus online y un encuentro en vivo por semana, sin moverte de tu casa.' },
  { n: '04', title: 'Llegá preparado', text: 'Certificado con QR verificable y un plan concreto para buscar trabajo.' }
];

function avalesStrip(compact = false) {
  return AVALES.map(a => `
    <div class="bg-white rounded-xl ${compact ? 'px-3 py-2 h-14' : 'px-5 py-3 h-20'} flex items-center justify-center shadow-md">
      <img src="${a.logo}" alt="${a.name}" title="${a.name}" class="max-h-full w-auto object-contain" loading="lazy">
    </div>
  `).join('');
}

export function renderHomeView() {
  const courses = courseService.getPublicCourses();
  const featured = courses.find(c => c.featured) || courses[0];
  const others = courses.filter(c => featured && c.id !== featured.id);
  const waGeneral = whatsappLink('Hola, quiero información sobre los cursos de Vaca Muerta Consulting.');
  const waPasaporte = whatsappLink('Hola, quiero información sobre el curso Pasaporte a Vaca Muerta.');
  const waAyudas = whatsappLink('Hola, quiero consultar por las ayudas con descuento para los cursos.');

  return `
    <div class="space-y-20 pb-20">

      <!-- HERO -->
      <section class="relative overflow-hidden pt-12 pb-16 border-b border-slate-800 bg-gradient-to-b from-[#1B1F23] to-[#24282C]">
        <div class="absolute inset-0 bg-[radial-gradient(#74ACDF_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div class="lg:col-span-7 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-[#74ACDF]">
                <span class="w-2 h-2 rounded-full bg-[#FFB000]"></span>
                <span>Cuenca Neuquina · Formación previa al ingreso</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
                Antes de venir a <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#74ACDF] via-sky-300 to-amber-300">Vaca Muerta</span>, preparate acá.
              </h1>

              <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Capacitación online para entrar a la industria del petróleo y gas: operaciones, montajes, ductos, obras y seguridad.
                Cursás desde tu provincia y llegás a Neuquén sabiendo cómo funciona un yacimiento, qué puesto buscar y cómo es la vida en campo.
              </p>

              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a href="#/catalogo" class="px-6 py-3.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-sky-950/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                  Ver Pasaporte a Vaca Muerta
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </a>
                <a href="${waGeneral}" target="_blank" rel="noopener" class="px-6 py-3.5 bg-[#1B1F23] hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:border-emerald-500/60 rounded-xl transition-all flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.1c-.24.68-1.42 1.31-1.95 1.36-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.82 2.01.89 2.15.07.15.12.32.02.51-.1.19-.14.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.3-.13.59.17.29.74 1.22 1.58 1.97 1.09.97 2.01 1.27 2.3 1.41.29.14.46.12.63-.07.17-.19.72-.84.92-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.7-.17 1.38z"/></svg>
                  Consultar por WhatsApp
                </a>
              </div>

              <div class="pt-5 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
                <a href="https://victorparedes.ar" target="_blank" rel="noopener" class="group flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-[#74ACDF]/70 shadow-lg group-hover:scale-105 transition-transform bg-[#1B1F23] shrink-0">
                    <img src="https://victorparedes.ar/foto.jpg" alt="Lic. Víctor Javier Paredes" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://victorparedes.ar/bg1.jpg'">
                  </div>
                  <div>
                    <div class="text-white font-bold group-hover:text-[#74ACDF] transition-colors">Dirección Técnica: Lic. Víctor Javier Paredes</div>
                    <div class="font-mono text-slate-400 text-[11px]">
                      Mat. PA 446 · Más de 15 años en Vaca Muerta · Autor de <em class="text-slate-300">Water Transfer en Vaca Muerta</em>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <!-- Tarjeta de certificado -->
            <div class="lg:col-span-5">
              <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#FFB000]">Tu certificado</span>
                  <span class="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Verificable por QR</span>
                </div>

                <figure class="space-y-2">
                  <img src="./assets/certificado-ejemplo.jpg" alt="Ejemplo de certificado de Vaca Muerta Consulting con los datos personales difuminados" class="w-full rounded-lg border border-slate-700 shadow-lg">
                  <figcaption class="text-xs text-slate-400 leading-relaxed">
                    Ejemplo real con los datos personales ocultos. Cualquier empresa escanea el QR y comprueba en segundos que hiciste el curso.
                  </figcaption>
                </figure>

                <div class="space-y-2">
                  <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Con aval de</span>
                  <div class="grid grid-cols-2 gap-3">
                    ${avalesStrip(true)}
                  </div>
                </div>

                <ul class="text-xs text-slate-300 space-y-2 pt-1">
                  <li class="flex gap-2"><span class="text-[#74ACDF]">✓</span> 100% online, con encuentros en vivo por Meet</li>
                  <li class="flex gap-2"><span class="text-[#74ACDF]">✓</span> Grupos de 30 a 35 alumnos con tutor</li>
                  <li class="flex gap-2"><span class="text-[#74ACDF]">✓</span> Ayudas con descuento disponibles</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- FRANJA DE MARCA -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative h-44 sm:h-56 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <img src="./assets/cartel-vmc.jpg" alt="Cartel iluminado de Vaca Muerta Consulting" class="absolute inset-0 w-full h-full object-cover" style="object-position: 30% 40%">
          <div class="absolute inset-0" style="background: linear-gradient(90deg, rgba(27,31,35,0) 30%, rgba(27,31,35,.75) 60%, rgba(27,31,35,.95) 100%)"></div>
          <div class="absolute inset-y-0 right-0 flex items-center justify-end pr-5 sm:pr-10 w-3/5 sm:w-auto sm:max-w-md text-right">
            <p class="text-base sm:text-2xl font-extrabold text-white leading-snug">Formación con respaldo profesional desde Neuquén</p>
          </div>
        </div>
      </section>

      <!-- AVALES -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-5">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Certificados con verificación QR y aval de</span>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-5">
            ${avalesStrip(false)}
          </div>
        </div>
      </section>

      <!-- ¿PARA QUIÉN ES? -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">¿Para quién es?</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Hay un curso para cada punto de partida</h2>
          <p class="text-sm text-slate-400 mt-2 max-w-2xl">No importa tu edad, tu formación ni de qué provincia seas: si querés trabajar en Vaca Muerta o crecer dentro de la industria, empezá por el que más se ajuste a vos.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${PERFILES.map(p => `
            <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 space-y-3">
              <div class="w-11 h-11 rounded-xl bg-[#74ACDF]/10 border border-[#74ACDF]/30 text-[#74ACDF] flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${p.icon}"/></svg>
              </div>
              <h3 class="text-base font-bold text-white">${p.title}</h3>
              <p class="text-sm text-slate-400 leading-relaxed">${p.text}</p>
              <div class="pt-3 border-t border-slate-800 text-xs">
                <span class="text-slate-500 font-mono">Te recomendamos:</span>
                <span class="text-[#FFB000] font-semibold block mt-0.5">${p.course}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-base font-bold text-white">Obtené ayudas con descuento</h3>
            <p class="text-sm text-slate-300">Tenemos opciones para que el arancel no sea un impedimento. Consultanos y te contamos cómo acceder.</p>
          </div>
          <a href="${waAyudas}" target="_blank" rel="noopener" class="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all text-center shrink-0">Consultar ayudas</a>
        </div>
      </section>

      <!-- CURSOS -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Cursos 2027</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Capacitaciones disponibles</h2>
          </div>
          <a href="#/catalogo" class="text-xs font-bold text-[#74ACDF] hover:text-sky-300 flex items-center gap-1 group">
            Ver programas completos
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        ${featured ? `
          <div class="bg-gradient-to-br from-[#1B1F23] to-[#24282C] border border-[#FFB000]/40 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            <div class="lg:col-span-5 relative min-h-[220px] bg-slate-800">
              <img src="${featured.image}" alt="${featured.title}" class="absolute inset-0 w-full h-full object-cover opacity-70">
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#FFB000] text-slate-950 text-xs font-bold">${featured.badge || 'Destacado'}</span>
            </div>
            <div class="lg:col-span-7 p-6 sm:p-8 space-y-4">
              <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span class="text-[#74ACDF] font-semibold">${featured.category}</span>
                <span>·</span>
                <span>${featured.duration}</span>
              </div>
              <h3 class="text-2xl font-black text-white leading-tight">${featured.title}</h3>
              <p class="text-sm text-slate-300 leading-relaxed">${featured.description}</p>
              <div class="flex items-baseline gap-3 pt-1">
                <span class="text-[11px] text-slate-400 uppercase font-mono">Arancel</span>
                <span class="text-xl font-black text-white font-mono">${formatPrice(featured.basePrice)}</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <a href="#/catalogo" class="px-5 py-3 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition-all">Ver programa</a>
                <a href="${waPasaporte}" target="_blank" rel="noopener" class="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all">Consultar fechas y ayudas</a>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${others.map(course => `
            <div class="bg-[#1B1F23] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:-translate-y-1 shadow-lg">
              <div>
                <div class="relative h-36 rounded-xl overflow-hidden mb-4 bg-slate-800">
                  <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
                </div>
                <div class="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                  <span class="text-[#74ACDF] font-semibold">${course.category}</span>
                  <span class="text-right">${course.duration}</span>
                </div>
                <h3 class="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#74ACDF] transition-colors">${course.title}</h3>
                <p class="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">${course.description}</p>
              </div>
              <div class="pt-4 border-t border-slate-800">
                <div class="flex items-baseline justify-between mb-3">
                  <span class="text-[11px] text-slate-400 uppercase font-mono">Arancel</span>
                  <span class="text-base font-black text-white font-mono">${formatPrice(course.basePrice)}</span>
                </div>
                <a href="#/catalogo" class="w-full py-2 bg-slate-800 hover:bg-[#74ACDF] hover:text-slate-950 text-white font-bold text-xs rounded-lg transition-colors text-center block">Ver programa</a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- CÓMO FUNCIONA -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Cómo funciona</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">De tu casa a Vaca Muerta en cuatro pasos</h2>
        </div>
        <ol class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${PASOS.map(p => `
            <li class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 space-y-2">
              <span class="text-2xl font-black font-mono text-[#FFB000]">${p.n}</span>
              <h3 class="text-sm font-bold text-white">${p.title}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${p.text}</p>
            </li>
          `).join('')}
        </ol>
      </section>

      <!-- CONTACTO -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-[#74ACDF]/15 via-[#1B1F23] to-[#FFB000]/10 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <h2 class="text-2xl font-extrabold text-white">¿Tenés dudas antes de inscribirte?</h2>
            <p class="text-sm text-slate-300">Escribinos y te responde directamente la Dirección Técnica.</p>
            <p class="text-xs font-mono text-slate-400">${CONTACT.whatsappDisplay} · ${CONTACT.email}</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <a href="${waGeneral}" target="_blank" rel="noopener" class="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all">Escribir por WhatsApp</a>
            <a href="${CONTACT.certVerifyUrl}" target="_blank" rel="noopener" class="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all">Verificar un certificado</a>
          </div>
        </div>
      </section>

    </div>
  `;
}

export function initHomeEvents() {
  // La home no tiene interacciones propias por ahora.
}
