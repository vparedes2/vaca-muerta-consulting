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
    title: 'Sin experiencia en la industria',
    text: 'Terminaste el secundario o una carrera y querés probar suerte en Neuquén.',
    course: 'Pasaporte a Vaca Muerta'
  },
  {
    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
    title: 'Tenés un oficio',
    text: 'Soldador, electricista, mecánico o chofer y querés trabajar en montajes, ductos u obras.',
    course: 'Pasaporte a Vaca Muerta'
  },
  {
    icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
    title: 'Técnicos y profesionales',
    text: 'Ya estás en el sector o venís de otro y querés especializarte en un servicio.',
    course: 'Water Transfer Nivel 1 · Inducción HSE · Tech & Field'
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

                <div class="flex items-start gap-4">
                  <div class="w-20 h-20 shrink-0 rounded-lg bg-white p-1.5 grid grid-cols-5 grid-rows-5 gap-0.5" aria-hidden="true">
                    ${[1,1,1,0,1, 1,0,1,1,0, 1,1,0,1,1, 0,1,1,0,1, 1,0,1,1,1].map(v => `<span class="${v ? 'bg-slate-900' : 'bg-white'} rounded-[1px]"></span>`).join('')}
                  </div>
                  <div class="text-sm text-slate-300 leading-relaxed">
                    Cualquier empresa puede escanear el código y comprobar en segundos que hiciste el curso, cuándo y con qué carga horaria.
                  </div>
                </div>

                <div class="space-y-2">
                  <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">Con aval de</span>
                  <div class="grid grid-cols-2 gap-3">
                    ${avalesStrip(true)}
                  </div>
                </div>

                <ul class="text-xs text-slate-300 space-y-2 pt-1">
                  <li class="flex gap-2"><span class="text-[#74ACDF]">✓</span> 100% online, con encuentros en vivo por Meet</li>
                  <li class="flex gap-2"><span class="text-[#74ACDF]">✓</span> Grupos de 30 a 35 alumnos con tutor</li>
                  <li class="flex gap-2"><span class="text-[#74ACDF]">✓</span> Preparación para tu credencial PASE</li>
                </ul>
              </div>
            </div>

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
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Elegí según tu punto de partida</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div class="flex flex-wrap items-center gap-3 pt-2">
                <a href="#/catalogo" class="px-5 py-3 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition-all">Ver programa</a>
                <a href="${waPasaporte}" target="_blank" rel="noopener" class="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all">Consultar arancel y fechas</a>
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

      <!-- PASE -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-3">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#FFB000]">Credencial PASE AOG</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Te preparamos para tu credencial PASE y para tu primera entrevista</h2>
            <p class="text-sm text-slate-300 leading-relaxed">
              Para entrar a los yacimientos de la Cuenca Neuquina necesitás la credencial PASE (Pasaporte Seguro Argentina Oil &amp; Gas). Es gratuita y se tramita en su plataforma oficial.
              Nuestros cursos no la reemplazan: trabajan los mismos ejes de seguridad con más profundidad, y en el Pasaporte a Vaca Muerta la tramitás antes de egresar.
            </p>
          </div>
          <div class="lg:col-span-4">
            <a href="https://paseaog.com" target="_blank" rel="noopener" class="w-full px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2">
              Ir a la plataforma PASE
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
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
