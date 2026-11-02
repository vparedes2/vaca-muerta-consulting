/**
 * Vaca Muerta Consulting - Catalog View
 * Catálogo detallado con los 4 cursos oficiales, cohortes asociadas y checkout dinámico.
 */

import { courseService } from '../services/courseService.js';
import { cohortService } from '../services/cohortService.js';
import { authService } from '../services/authService.js';
import { paymentService } from '../services/paymentService.js';
import { formatARS, formatDate, showToast } from '../utils/formatters.js';

export function renderCatalogView() {
  const courses = courseService.getAll();
  const cohorts = cohortService.getAll();
  const user = authService.getCurrentUser();

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <!-- Encabezado de Sección -->
      <div class="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Cuenca Neuquina · Ciclo 2026</span>
          <h1 class="text-3xl sm:text-4xl font-black text-white mt-1">Catálogo Oficial de Capacitaciones</h1>
          <p class="text-sm text-slate-400 mt-2 max-w-2xl">
            Programas técnicos de alta exigencia para supervisores y operarios. Todos los cursos incluyen certificación oficial avalada por la Dirección Técnica (Lic. Víctor Javier Paredes, Mat. PA 446).
          </p>
        </div>

        ${user && user.role === 'student' ? `
          <div class="bg-[#1B1F23] border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              ✓
            </div>
            <div class="text-xs">
              <span class="text-emerald-400 font-bold block">Plan de Referidos Activo</span>
              <span class="text-slate-300">Tus descuentos se aplican automáticamente</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Listado de Cursos en Fichas Completas -->
      <div class="space-y-8">
        ${courses.map(course => {
          // Cohortes disponibles para este curso
          const courseCohorts = cohorts.filter(c => c.courseId === course.id);

          return `
            <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all hover:border-slate-700">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                <!-- Columna Izquierda: Imagen y Resumen Rápido -->
                <div class="lg:col-span-4 relative bg-slate-900 p-6 flex flex-col justify-between">
                  <div class="absolute inset-0 z-0">
                    <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover opacity-30">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#1B1F23] via-[#1B1F23]/80 to-transparent"></div>
                  </div>

                  <div class="relative z-10 space-y-3">
                    <span class="px-2.5 py-1 rounded bg-[#FFB000]/20 text-[#FFB000] border border-[#FFB000]/40 text-xs font-mono font-bold inline-block">
                      ${course.badge}
                    </span>
                    <h2 class="text-xl sm:text-2xl font-black text-white leading-tight">
                      ${course.title}
                    </h2>
                    <span class="text-xs font-mono text-slate-300 block">Código: ${course.code}</span>
                  </div>

                  <div class="relative z-10 pt-6 mt-6 border-t border-slate-700/60 space-y-3">
                    <div class="flex items-baseline justify-between">
                      <span class="text-xs font-mono text-slate-400">Arancel Oficial:</span>
                      <span class="text-2xl font-black text-white font-mono">${formatARS(course.basePrice)}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-center text-xs">
                      <div class="bg-[#24282C]/90 p-2 rounded-lg border border-slate-800">
                        <span class="text-slate-400 block text-[10px] font-mono">DURACIÓN</span>
                        <span class="font-bold text-white">${course.duration}</span>
                      </div>
                      <div class="bg-[#24282C]/90 p-2 rounded-lg border border-slate-800">
                        <span class="text-slate-400 block text-[10px] font-mono">MODALIDAD</span>
                        <span class="font-bold text-[#74ACDF]">Virtual + Tutor</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Columna Derecha: Temario, Módulos y Cohortes -->
                <div class="lg:col-span-8 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  
                  <div class="space-y-4">
                    <p class="text-sm text-slate-300 leading-relaxed">
                      ${course.description}
                    </p>

                    <!-- Módulos y Lecciones Destacadas -->
                    <div>
                      <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Estructura Curricular (${course.modules ? course.modules.length : 0} Módulos):
                      </h4>
                      <div class="space-y-2">
                        ${(course.modules || []).map(m => `
                          <div class="bg-[#24282C] border border-slate-800 rounded-xl p-3 text-xs">
                            <span class="font-bold text-white block mb-1">${m.title}</span>
                            <ul class="list-disc list-inside text-slate-400 space-y-0.5">
                              ${(m.lessons || []).map(l => `<li>${l.title} (${l.duration})</li>`).join('')}
                            </ul>
                          </div>
                        `).join('')}
                      </div>
                    </div>

                    <!-- Cohortes Disponibles -->
                    <div>
                      <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Grupos Escalonados de Inicio (Tutorías Reducidas):
                      </h4>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        ${courseCohorts.length > 0 ? courseCohorts.map(cohort => `
                          <div class="bg-[#24282C] border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                            <div class="flex items-center justify-between font-bold text-white">
                              <span>${cohort.name}</span>
                              <span class="text-[#FFB000] font-mono">${cohort.capacity - cohort.enrolled} cupos</span>
                            </div>
                            <div class="text-slate-400 text-[11px]">Inicio: ${formatDate(cohort.startDate)}</div>
                            <div class="text-slate-400 text-[11px]">Tutor: <span class="text-slate-200">${cohort.tutor}</span></div>
                          </div>
                        `).join('') : `
                          <div class="text-xs text-slate-500 italic p-2">Próximas cohortes por confirmarse en Dirección Académica.</div>
                        `}
                      </div>
                    </div>
                  </div>

                  <!-- Botón de Inscripción / Checkout -->
                  <div class="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div class="text-xs text-slate-400 font-mono">
                      <span>✓ Facturación Oficial A y B</span> · <span>Mercado Pago en hasta 6 cuotas</span>
                    </div>

                    <button type="button" data-course-id="${course.id}" class="btn-enroll-course px-6 py-3 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-sky-950/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                      Inscribirme / Abonar con Mercado Pago
                    </button>
                  </div>

                </div>

              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

export function initCatalogEvents(onOpenCheckout) {
  document.querySelectorAll('.btn-enroll-course').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id');
      const course = courseService.getById(courseId);
      if (course && onOpenCheckout) {
        onOpenCheckout(course);
      }
    });
  });
}
