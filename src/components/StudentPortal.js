/**
 * Vaca Muerta Consulting - Student Portal (Campus de Aprendizaje & Plan Referidos)
 * Campus del alumno con acceso al reproductor LMS, control de cohorte asignada,
 * programa de referidos inteligente (base 2 referidos / 40% OFF hasta 100% con 5)
 * y botones de pago dinámicos con Mercado Pago.
 */

import { authService } from '../services/authService.js';
import { courseService } from '../services/courseService.js';
import { cohortService } from '../services/cohortService.js';
import { referralService } from '../services/referralService.js';
import { formatARS, copyToClipboard, showToast } from '../utils/formatters.js';

export function renderStudentPortal() {
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'student') {
    return `
      <div class="max-w-4xl mx-auto p-12 text-center text-slate-400">
        <p>Por favor inicie sesión con una cuenta de alumno (ej: alumno01 / seguridad123) para acceder a su campus.</p>
        <button id="btn-portal-login" class="mt-4 px-4 py-2 bg-[#74ACDF] text-slate-950 font-bold rounded-lg">Iniciar Sesión</button>
      </div>
    `;
  }

  const enrolledCourseIds = user.enrolledCourses || ['water-transfer-1-2', 'hse-vaca-muerta'];
  const allCourses = courseService.getAll();
  const studentCourses = allCourses.filter(c => enrolledCourseIds.includes(c.id));
  const assignedCohort = cohortService.getById(user.cohorteId || 'cohorte-feb-a');

  // Plan de Referidos
  const referralSummary = referralService.getDiscountSummary(user.id, 400000);
  const referralsList = referralService.getReferralsForStudent(user.id);
  const referralLink = `${window.location.origin}/#/catalogo?ref=${user.username || 'alumno01'}`;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Ficha del Alumno & Cohorte Asignada -->
      <div class="bg-gradient-to-r from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Campus Virtual Activo
            </span>
            <span class="text-xs font-mono text-slate-400">DNI: ${user.dni || '34.892.115'}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">¡Hola, ${user.name}!</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Cohorte Asignada: <strong class="text-white">${assignedCohort ? assignedCohort.name : 'Cohorte Febrero A'}</strong> · Tutor: <span class="text-[#74ACDF]">${assignedCohort ? assignedCohort.tutor : 'Lic. Víctor Paredes'}</span>
          </p>
        </div>

        <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs font-mono space-y-1">
          <div class="text-slate-400 text-[10px] uppercase">Clases en Vivo &amp; Consultas</div>
          <div class="text-white font-bold">${assignedCohort ? assignedCohort.schedule : 'Lunes, Miércoles y Viernes 19:00 hs'}</div>
          <a href="${assignedCohort ? assignedCohort.roomLink : '#'}" target="_blank" class="text-[#74ACDF] hover:underline flex items-center gap-1 mt-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Ingresar a Sala Virtual
          </a>
        </div>
      </div>

      <!-- SECCIÓN 1: MIS CURSOS & REPRODUCTOR LMS -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Aula Virtual</span>
            <h2 class="text-xl sm:text-2xl font-bold text-white">Mis Cursos en Curso</h2>
          </div>
          <span class="text-xs font-mono text-slate-400">${studentCourses.length} cursos activos</span>
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
                  <!-- Barra de Progreso LMS -->
                  <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div class="bg-gradient-to-r from-[#74ACDF] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${prog.percent}%"></div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-mono">
                      ${prog.completedLessons ? prog.completedLessons.length : 0} lecciones finalizadas
                    </span>
                    <a href="#/lms/${course.id}" class="px-4 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      Entrar al Reproductor LMS
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SECCIÓN 2: PROGRAMA DE REFERIDOS INTELIGENTE (40% BASE A 100%) -->
      <div class="bg-gradient-to-br from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFB000]/20 text-[#FFB000] border border-[#FFB000]/30">
                Plan de Ahorro Colectivo
              </span>
              <span class="text-xs text-slate-400 font-mono">20% de descuento por cada colega</span>
            </div>
            <h2 class="text-2xl font-black text-white">Tu Red de Referidos</h2>
          </div>

          <!-- Badge de Descuento Actual -->
          <div class="bg-[#1B1F23] border border-slate-700 px-5 py-3 rounded-2xl text-right">
            <span class="text-[11px] text-slate-400 font-mono block">Descuento Acumulado:</span>
            <span class="text-2xl sm:text-3xl font-black text-[#FFB000] font-mono" id="portal-discount-label">
              ${referralSummary.discountPercent}% OFF
            </span>
          </div>
        </div>

        <!-- Enlace Personal Copiable -->
        <div class="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-xs font-mono font-bold uppercase text-slate-300 block">Tu Enlace Personal de Referido:</span>
            <span class="text-xs text-slate-400 block font-mono break-all text-[#74ACDF]" id="text-referral-link">${referralLink}</span>
          </div>
          <button type="button" id="btn-copy-student-ref" class="px-5 py-2.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            Copiar Enlace
          </button>
        </div>

        <!-- Barra de Progreso a 5 Referidos (100% Bonificado) -->
        <div class="space-y-3 bg-[#24282C] p-5 rounded-2xl border border-slate-800">
          <div class="flex justify-between items-center text-xs font-mono">
            <span class="text-slate-300 font-semibold" id="portal-ref-counter-text">
              ${referralsList.length} de 5 colegas inscriptos
            </span>
            <span class="text-[#FFB000] font-bold">
              ${referralSummary.isFullyBonified ? '★ 100% Bonificado (Reintegro Total)' : `Faltan ${referralSummary.missingForFull} para bonificación total`}
            </span>
          </div>

          <div class="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700">
            <div id="portal-progress-bar" class="bg-gradient-to-r from-[#74ACDF] to-[#FFB000] h-full rounded-full transition-all duration-500" style="width: ${referralSummary.targetProgress}%"></div>
          </div>

          <!-- Hitos 1 a 5 -->
          <div class="grid grid-cols-5 text-center text-[10px] font-mono text-slate-400 pt-1">
            <span class="${referralsList.length >= 1 ? 'text-[#74ACDF] font-bold' : ''}">1 (20%)</span>
            <span class="${referralsList.length >= 2 ? 'text-[#74ACDF] font-bold' : ''}">2 (40% Base)</span>
            <span class="${referralsList.length >= 3 ? 'text-[#74ACDF] font-bold' : ''}">3 (60%)</span>
            <span class="${referralsList.length >= 4 ? 'text-[#74ACDF] font-bold' : ''}">4 (80%)</span>
            <span class="${referralsList.length >= 5 ? 'text-[#FFB000] font-bold' : ''}">5 (100% Reintegro)</span>
          </div>
        </div>

        <!-- Tabla de Colegas Confirmados -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white">Colegas Inscriptos con tu Enlace:</h4>
            
            <!-- Botón de Simulación Dinámica para Testing -->
            <button type="button" id="btn-simulate-referral" class="px-3 py-1.5 bg-[#FFB000]/20 hover:bg-[#FFB000]/30 text-[#FFB000] border border-[#FFB000]/40 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Simular Nuevo Referido (+20%)
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr class="bg-[#24282C] border-b border-slate-700 font-mono text-[11px] text-slate-400 uppercase">
                  <th class="p-3">Colega</th>
                  <th class="p-3">Curso Elegido</th>
                  <th class="p-3">Fecha</th>
                  <th class="p-3">Descuento Obtenido</th>
                  <th class="p-3">Estado</th>
                </tr>
              </thead>
              <tbody id="table-referrals-body" class="divide-y divide-slate-800">
                ${referralsList.map(ref => `
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="p-3">
                      <div class="font-bold text-white">${ref.name}</div>
                      <div class="text-[11px] text-slate-400 font-mono">DNI: ${ref.dni}</div>
                    </td>
                    <td class="p-3 font-semibold text-slate-200">${ref.courseTitle || 'Water Transfer 1 y 2'}</td>
                    <td class="p-3 font-mono text-slate-400">${ref.registeredAt || '2026-01-28'}</td>
                    <td class="p-3 font-mono font-bold text-emerald-400">+20% Bonificación</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                        ${ref.status || 'Confirmado'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- SECCIÓN 3: INSCRIPCIÓN Y BOTÓN DINÁMICO MERCADO PAGO -->
      <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Pasarela de Pagos</span>
          <h2 class="text-xl sm:text-2xl font-bold text-white">Abonar o Ampliar Matrícula con Mercado Pago</h2>
          <p class="text-xs text-slate-400 mt-1">El importe final se recalcula automáticamente restando el descuento acumulado por tus referidos.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-6 space-y-4">
            <span class="text-xs font-mono font-bold uppercase text-slate-400 block">Resumen Arancelario Personal:</span>
            
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-slate-400">Arancel Oficial Water Transfer:</span>
                <span class="text-white font-bold">$400.000 ARS</span>
              </div>
              <div class="flex justify-between text-emerald-400">
                <span>Descuento Referidos (<span id="checkout-discount-pct">${referralSummary.discountPercent}%</span>):</span>
                <span class="font-bold" id="checkout-discount-amt">-${formatARS(referralSummary.discountAmount)}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700">
                <span>Total a Pagar en Checkout:</span>
                <span class="text-[#74ACDF] font-mono text-xl" id="checkout-final-amt">${formatARS(referralSummary.finalPrice)}</span>
              </div>
            </div>

            <p class="text-[11px] text-slate-400 font-mono">
              Hasta 6 cuotas con tarjetas bancarias o saldo en cuenta Mercado Pago.
            </p>
          </div>

          <div class="space-y-3">
            <button type="button" id="btn-trigger-mp-checkout" class="w-full py-4 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-sky-950/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <span>Pagar con Mercado Pago (<span id="mp-btn-amount">${formatARS(referralSummary.finalPrice)}</span>)</span>
            </button>

            <div class="text-center">
              <span class="text-[11px] text-slate-500 font-mono">
                🔒 Certificado de Pago Seguro SSL · Factura AFIP Oficial Emitida por la Consultora
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;
}

export function initStudentPortalEvents(onOpenCheckout) {
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'student') return;

  // Copy referral link
  const btnCopy = document.getElementById('btn-copy-student-ref');
  const referralLink = `${window.location.origin}/#/catalogo?ref=${user.username || 'alumno01'}`;

  btnCopy?.addEventListener('click', () => {
    copyToClipboard(referralLink, '¡Enlace de referido copiado! Compártelo con tus colegas.');
  });

  // Dynamic referral simulation (Add +1 colleague to test live recalculation!)
  const btnSimulate = document.getElementById('btn-simulate-referral');
  btnSimulate?.addEventListener('click', () => {
    const colleaguesSample = [
      { name: "Matías Albornoz", dni: "38.221.908", courseTitle: "Water Transfer 1 y 2", paidAmount: 400000 },
      { name: "Rodrigo Salinas", dni: "36.441.229", courseTitle: "Inducción HSE Vaca Muerta", paidAmount: 320000 },
      { name: "Luciano Herrera", dni: "37.992.115", courseTitle: "Higiene y Seguridad", paidAmount: 320000 }
    ];

    const currentCount = referralService.getReferralsForStudent(user.id).length;
    const nextColleague = colleaguesSample[currentCount % colleaguesSample.length];

    try {
      const res = referralService.addReferral(user.id, nextColleague);
      showToast(`¡Colega ${nextColleague.name} inscripto con éxito! +20% de descuento aplicado.`, 'success');

      // Update UI in place
      setTimeout(() => window.location.reload(), 400);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Trigger MP checkout modal
  const btnCheckout = document.getElementById('btn-trigger-mp-checkout');
  btnCheckout?.addEventListener('click', () => {
    const defaultCourse = courseService.getById('water-transfer-1-2');
    if (defaultCourse && onOpenCheckout) {
      onOpenCheckout(defaultCourse);
    }
  });
}
