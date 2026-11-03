/**
 * Vaca Muerta Consulting - Student Portal (Campus del alumno)
 * Campus del alumno y egresado con:
 * - Reproductor LMS y avance pedagógico
 * - Ayuda económica: beca por recomendación (20% por inscripción abonada, 100% con 5)
 *   y Programa Embajadores para egresados (15% por inscripción abonada).
 * - Consultas y pagos por WhatsApp (sin pasarela simulada).
 */

import { authService } from '../services/authService.js';
import { courseService } from '../services/courseService.js';
import { cohortService } from '../services/cohortService.js';
import { referralService } from '../services/referralService.js';
import { formatARS, copyToClipboard, whatsappLink } from '../utils/formatters.js';

export function renderStudentPortal() {
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'student') {
    return `
      <div class="max-w-4xl mx-auto p-12 text-center text-slate-400">
        <p>Iniciá sesión con tu cuenta de alumno para entrar a tu campus.</p>
        <button id="btn-portal-login" class="mt-4 px-4 py-2 bg-[#74ACDF] text-slate-950 font-bold rounded-lg">Iniciar Sesión</button>
      </div>
    `;
  }

  const isGraduate = user.academicStatus === 'egresado';
  const enrolledCourseIds = user.enrolledCourses || ['water-transfer-n1', 'hse-vaca-muerta'];
  const allCourses = courseService.getAll();
  const studentCourses = allCourses.filter(c => enrolledCourseIds.includes(c.id));
  const assignedCohort = cohortService.getById(user.cohorteId || 'cohorte-wt-1');

  // Arancel base de referencia del alumno (ej: Water Transfer $400.000)
  const basePrice = studentCourses.length > 0 ? (Number(studentCourses[0].basePrice) || 0) : 0;
  const referralSummary = referralService.getDiscountSummary(user.id, basePrice);
  const referralsList = referralService.getReferralsForStudent(user.id);
  const referralLink = `${window.location.origin}/#/catalogo?ref=${user.username || user.id}`;
  const isGraduateSummary = referralSummary.isGraduate === true;
  const hasPrice = Number(basePrice) > 0;
  const becaAmountLabel = isGraduateSummary || hasPrice
    ? formatARS(referralSummary.totalPayout)
    : `${referralSummary.refundPercent}% del arancel`;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- FICHA DEL ALUMNO / EGRESADO & COHORTE ASIGNADA -->
      <div class="bg-gradient-to-r from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex flex-wrap items-center gap-3 mb-2">
            ${isGraduate ? `
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-[#FFB000] border border-amber-500/40 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FFB000] animate-pulse"></span>
                🎓 Egresado
              </span>
              <span class="text-xs font-mono text-slate-400">Certificado: ${user.certificateNumber || 'VMC-CERT-2026-089'}</span>
            ` : `
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Alumno Activo en Cursado
              </span>
              <span class="text-xs font-mono text-slate-400">DNI: ${user.dni || '34.892.115'}</span>
            `}
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">¡Hola, ${user.name}!</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Cohorte: <strong class="text-white">${assignedCohort ? assignedCohort.name : 'A confirmar'}</strong> · Tutor: <span class="text-[#74ACDF]">${assignedCohort ? assignedCohort.tutor : 'Lic. Víctor Paredes'}</span>
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

          <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-1">
            <div class="text-slate-400 text-[10px] uppercase">Clases en Vivo &amp; Consultas</div>
            <div class="text-white font-bold">${assignedCohort && assignedCohort.schedule ? assignedCohort.schedule : 'A confirmar'}</div>
            ${assignedCohort && assignedCohort.roomLink ? `
              <a href="${assignedCohort.roomLink}" target="_blank" rel="noopener" class="text-[#74ACDF] hover:underline flex items-center gap-1 mt-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                Ingresar a la clase en vivo
              </a>
            ` : `<div class="text-slate-500 mt-1">El enlace se habilita al iniciar la cohorte</div>`}
          </div>
        </div>
      </div>

      <!-- SECCIÓN 1: MIS CURSOS & REPRODUCTOR LMS -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Aula Virtual</span>
            <h2 class="text-xl sm:text-2xl font-bold text-white">Mis cursos</h2>
          </div>
          <span class="text-xs font-mono text-slate-400">${studentCourses.length} cursos matriculados</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${studentCourses.map(course => {
            const prog = courseService.getUserProgress(user.id, course.id);
            return `
              <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#74ACDF]/20 text-[#74ACDF] border border-[#74ACDF]/30">
                      ${course.code}
                    </span>
                    <span class="text-xs font-mono font-bold text-emerald-400">${prog.percent}% Completado</span>
                  </div>
                  <h3 class="text-lg font-bold text-white mb-2">${course.title}</h3>
                  <p class="text-xs text-slate-400 line-clamp-2">${course.description}</p>
                </div>

                <div class="space-y-4 pt-4 border-t border-slate-800">
                  <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#74ACDF] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${prog.percent}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-mono">
                      ${prog.completedLessons ? prog.completedLessons.length : 0} lecciones finalizadas
                    </span>
                    <a href="#/lms/${course.id}" class="px-4 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Entrar al curso
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SECCIÓN 2: AYUDA ECONÓMICA · BECA POR RECOMENDACIÓN -->
      <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Ayuda económica</span>
            <h2 class="text-xl sm:text-2xl font-bold text-white">
              ${isGraduateSummary ? 'Programa Embajadores' : 'Beca por recomendación'}
            </h2>
            <p class="text-sm text-slate-300 leading-relaxed">
              ${isGraduateSummary
                ? 'Como egresado, podés seguir recomendando la capacitación. Por cada persona que se inscriba con tu código y abone su curso, recibís un reconocimiento equivalente al 15% de su arancel.'
                : 'Si conocés a alguien que también quiere capacitarse, compartile tu código. Cada persona que se inscriba con él y abone su curso te suma un 20% de beca sobre tu arancel. Con 5 recomendaciones, tu curso queda 100% becado.'}
            </p>
            <p class="text-xs text-slate-500">
              ${isGraduateSummary
                ? 'Solo cuentan las inscripciones con el pago acreditado. Se liquida por transferencia.'
                : 'Solo cuentan las inscripciones con el pago acreditado. La beca se acredita por transferencia al terminar la cursada. Desde la sexta recomendación, cada nueva inscripción suma un reconocimiento del 20% de tu arancel.'}
            </p>
          </div>

          <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 min-w-[220px]">
            <span class="text-[11px] font-mono uppercase text-emerald-300 block">${isGraduateSummary ? 'Reconocimiento acumulado' : 'Beca acumulada'}</span>
            <span class="text-2xl font-black text-white font-mono block mt-1">${becaAmountLabel}</span>
            <span class="text-[11px] text-slate-400 block mt-1">
              ${isGraduateSummary
                ? `${referralSummary.paidReferralsCount} inscripciones confirmadas`
                : (hasPrice ? `${referralSummary.refundPercent}% de tu curso` : 'Sobre el arancel que abonaste') + (referralSummary.hasExtraBonus ? ' + reconocimiento adicional' : '')}
            </span>
          </div>
        </div>

        ${!isGraduateSummary ? `
          <div>
            <div class="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
              <span>Avance hacia la beca completa</span>
              <span>${referralSummary.isFullyBonified ? 'Beca completa' : `Faltan ${referralSummary.missingForFull} recomendaciones`}</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div class="bg-gradient-to-r from-[#74ACDF] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${referralSummary.targetProgress}%"></div>
            </div>
          </div>
        ` : ''}

        <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs">
            <span class="text-slate-400 block font-mono">Tu enlace para compartir</span>
            <span class="text-white font-mono break-all">${referralLink}</span>
          </div>
          <button type="button" id="btn-copy-student-ref" class="px-5 py-2.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0">
            Copiar enlace
          </button>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-800">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th class="p-3">Persona</th>
                <th class="p-3">Curso</th>
                <th class="p-3">Estado</th>
                <th class="p-3 text-right">Aporte</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              ${referralsList.length === 0 ? `
                <tr><td colspan="4" class="p-4 text-center text-slate-500">Todavía no hay inscripciones con tu código.</td></tr>
              ` : referralsList.map(r => {
                const paid = r.paymentStatus === 'paid' || r.isPaid === true;
                return `
                  <tr class="text-slate-300">
                    <td class="p-3 font-semibold text-white">${r.name}</td>
                    <td class="p-3">${r.courseTitle || '-'}</td>
                    <td class="p-3">${paid
                      ? '<span class="text-emerald-400">Pago confirmado</span>'
                      : '<span class="text-amber-300">Pago pendiente</span>'}</td>
                    <td class="p-3 text-right font-mono">${paid ? (isGraduateSummary ? '15%' : '20%') : '—'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECCIÓN 3: CONSULTAS Y PAGOS -->
      <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Pagos, inscripciones y consultas</span>
          <h2 class="text-xl font-bold text-white">Hablá directamente con la Dirección Técnica</h2>
          <p class="text-xs text-slate-400">Cuotas, medios de pago, cambios de cohorte o dudas del curso: lo resolvemos por WhatsApp.</p>
        </div>
        <a href="${whatsappLink(`Hola, soy ${user.name}, alumno/a del campus. Tengo una consulta:`)}" target="_blank" rel="noopener" class="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all text-center shrink-0">
          Escribir por WhatsApp
        </a>
      </div>

    </div>
  `;
}

export function initStudentPortalEvents() {
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'student') return;

  const btnCopy = document.getElementById('btn-copy-student-ref');
  const referralLink = `${window.location.origin}/#/catalogo?ref=${user.username || user.id}`;

  btnCopy?.addEventListener('click', () => {
    copyToClipboard(referralLink, 'Enlace copiado. Compartilo con quien quiera capacitarse.');
  });
}
