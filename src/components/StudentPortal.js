/**
 * Vaca Muerta Consulting - Student Portal (Campus de Aprendizaje & Control de Referidos)
 * Campus del alumno con:
 * - Reproductor LMS y avance pedagógico
 * - Control de Colegas Referidos inscriptos hasta el momento
 * - Billetera de Reintegros Garantizados post-capacitación:
 *   * 20% de reintegro por colega
 *   * Con 5 colegas: 100% bonificado (se devuelve el valor total del curso)
 *   * Con > 5 colegas: se devuelve el curso completo + 20% adicional de ganancia neta por cada uno extra
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

  // Arancel base de referencia del alumno (ej: Water Transfer $400.000)
  const basePrice = studentCourses.length > 0 ? studentCourses[0].basePrice : 400000;
  const referralSummary = referralService.getDiscountSummary(user.id, basePrice);
  const referralsList = referralService.getReferralsForStudent(user.id);
  const referralLink = `${window.location.origin}/#/catalogo?ref=${user.username || 'alumno01'}`;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- FICHA DEL ALUMNO & COHORTE ASIGNADA -->
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
            <h2 class="text-xl sm:text-2xl font-bold text-white">Mis Cursos en Cursado</h2>
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
                      Entrar al Reproductor LMS
                    </a>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SECCIÓN 2: CONTROL DE COLEGAS REFERIDOS & BILLETERA DE REINTEGROS -->
      <div class="bg-gradient-to-br from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFB000]/20 text-[#FFB000] border border-[#FFB000]/30">
                Control de Colegas Inscriptos &amp; Reintegros Post-Cursado
              </span>
              <span class="text-xs text-slate-400 font-mono">Liquidación al concluir capacitación</span>
            </div>
            <h2 class="text-2xl font-black text-white">Mi Billetera de Reintegros por Referidos</h2>
            <p class="text-xs text-slate-300 max-w-2xl leading-relaxed">
              El arancel oficial se abona al ingresar. Al concluir la capacitación, <strong>se te reintegra el 20% por cada colega inscripto</strong>. Con <strong>5 colegas recuperas el 100% de lo que pagaste</strong>, y si refieres más de 5, <strong>cobras el reintegro total del curso más un 20% adicional de ganancia neta por cada uno</strong>.
            </p>
          </div>

          <!-- Balance Total a Reintegrar -->
          <div class="bg-[#1B1F23] border border-slate-700 px-5 py-4 rounded-2xl text-right shrink-0">
            <span class="text-[11px] text-slate-400 font-mono block">Total a Cobrar al Concluir:</span>
            <span class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
              ${formatARS(referralSummary.totalPayout)}
            </span>
            <span class="text-[10px] text-slate-400 font-mono">
              ${referralSummary.isFullyBonified ? '★ 100% Bonificado' : `${referralSummary.refundPercent}% de Recupero`} 
              ${referralSummary.hasExtraBonus ? `(+${formatARS(referralSummary.extraBonusTotal)} ganancia)` : ''}
            </span>
          </div>
        </div>

        <!-- Enlace Personal Copiable -->
        <div class="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-xs font-mono font-bold uppercase text-slate-300 block">Tu Enlace Personal Único:</span>
            <span class="text-xs text-slate-400 block font-mono break-all text-[#74ACDF]" id="text-referral-link">${referralLink}</span>
          </div>
          <button type="button" id="btn-copy-student-ref" class="px-5 py-2.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            Copiar Enlace
          </button>
        </div>

        <!-- Desglose Financiero de Reintegros -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800 space-y-1">
            <span class="text-[11px] font-mono text-slate-400 block uppercase">Arancel Oficial Abonado:</span>
            <span class="text-lg font-black text-white font-mono">${formatARS(basePrice)}</span>
            <span class="text-[10px] text-slate-500 font-mono block">100% de la matrícula oficial</span>
          </div>

          <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800 space-y-1">
            <span class="text-[11px] font-mono text-slate-400 block uppercase">Reintegro del Curso (${referralSummary.refundPercent}%):</span>
            <span class="text-lg font-black text-[#FFB000] font-mono">${formatARS(referralSummary.courseRefundAmount)}</span>
            <span class="text-[10px] text-slate-500 font-mono block">${referralSummary.referralsCount} colegas × 20% (Hasta 100%)</span>
          </div>

          <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800 space-y-1">
            <span class="text-[11px] font-mono text-slate-400 block uppercase">Ganancia Extra (&gt;5 Referidos):</span>
            <span class="text-lg font-black text-emerald-400 font-mono">+${formatARS(referralSummary.extraBonusTotal)}</span>
            <span class="text-[10px] text-emerald-400/80 font-mono block">${referralSummary.extraReferralsCount} colegas extra × 20% neto</span>
          </div>
        </div>

        <!-- Barra de Progreso Hacia la Meta de 5 Referidos (100% Bonificado) -->
        <div class="space-y-3 bg-[#24282C] p-5 rounded-2xl border border-slate-800">
          <div class="flex justify-between items-center text-xs font-mono">
            <span class="text-slate-300 font-semibold" id="portal-ref-counter-text">
              ${referralsList.length} colegas inscriptos confirmados en el sistema
            </span>
            <span class="text-[#FFB000] font-bold">
              ${referralSummary.isFullyBonified ? '★ 100% RECUPERADO (Curso Bonificado)' : `Faltan ${referralSummary.missingForFull} para reintegro del 100%`}
            </span>
          </div>

          <div class="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700">
            <div id="portal-progress-bar" class="bg-gradient-to-r from-[#74ACDF] via-[#FFB000] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${referralSummary.targetProgress}%"></div>
          </div>

          <div class="grid grid-cols-5 text-center text-[10px] font-mono text-slate-400 pt-1">
            <span class="${referralsList.length >= 1 ? 'text-[#74ACDF] font-bold' : ''}">1 (20% Reintegro)</span>
            <span class="${referralsList.length >= 2 ? 'text-[#74ACDF] font-bold' : ''}">2 (40% Reintegro)</span>
            <span class="${referralsList.length >= 3 ? 'text-[#74ACDF] font-bold' : ''}">3 (60% Reintegro)</span>
            <span class="${referralsList.length >= 4 ? 'text-[#74ACDF] font-bold' : ''}">4 (80% Reintegro)</span>
            <span class="${referralsList.length >= 5 ? 'text-emerald-400 font-bold' : ''}">5 (100% ¡TOTAL!)</span>
          </div>

          ${referralSummary.hasExtraBonus ? `
            <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <svg class="w-5 h-5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>
                <strong>¡Nivel Superior Alcanzado!</strong> Has inscripto ${referralsList.length} colegas. Además del reintegro total del 100% del valor de tu curso, se te acreditarán <strong>+${formatARS(referralSummary.extraBonusTotal)}</strong> (+20% por cada colega por sobre los 5).
              </span>
            </div>
          ` : ''}
        </div>

        <!-- TABLA DE CONTROL DE COLEGAS INSCRIPTOS HASTA EL MOMENTO -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-bold text-white">Listado de Colegas Inscriptos en tu Red:</h4>
              <p class="text-[11px] text-slate-400">Control oficial de inscripciones validadas en el sistema para tu liquidación.</p>
            </div>
            
            <!-- Botón de Simulación para Probar Dinámicamente -->
            <button type="button" id="btn-simulate-referral" class="px-3 py-1.5 bg-[#FFB000]/20 hover:bg-[#FFB000]/30 text-[#FFB000] border border-[#FFB000]/40 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Simular Nuevo Referido Inscripto (+20%)
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr class="bg-[#24282C] border-b border-slate-700 font-mono text-[11px] text-slate-400 uppercase">
                  <th class="p-3">Colega Referido</th>
                  <th class="p-3">Capacitación Elegida</th>
                  <th class="p-3">Fecha de Alta</th>
                  <th class="p-3">Estado en Sistema</th>
                  <th class="p-3 text-right">Reintegro Acumulado</th>
                </tr>
              </thead>
              <tbody id="table-referrals-body" class="divide-y divide-slate-800">
                ${referralsList.map((ref, idx) => {
                  const isExtra = idx >= 5;
                  return `
                    <tr class="hover:bg-slate-800/40 transition-colors">
                      <td class="p-3">
                        <div class="font-bold text-white">${ref.name}</div>
                        <div class="text-[11px] text-slate-400 font-mono">DNI: ${ref.dni}</div>
                      </td>
                      <td class="p-3 font-semibold text-slate-200">${ref.courseTitle || 'Water Transfer Nivel 1 y 2'}</td>
                      <td class="p-3 font-mono text-slate-400">${ref.registeredAt || '2026-01-28'}</td>
                      <td class="p-3">
                        <span class="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                          ✓ ${ref.status || 'Inscripto y Confirmado'}
                        </span>
                      </td>
                      <td class="p-3 text-right font-mono font-bold ${isExtra ? 'text-emerald-400' : 'text-[#FFB000]'}">
                        +20% ${isExtra ? '(¡Ganancia Neta Extra!)' : '(Reintegro Curso)'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- SECCIÓN 3: PAGO DE MATRÍCULA MERCADO PAGO -->
      <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Pasarela Oficial de Pagos</span>
          <h2 class="text-xl sm:text-2xl font-bold text-white">Abono Oficial de Matrícula (Mercado Pago)</h2>
          <p class="text-xs text-slate-400 mt-1">El arancel oficial se abona al 100%. Todos los reintegros acumulados se devuelven por transferencia una vez concluido el cursado.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-6 space-y-4">
            <span class="text-xs font-mono font-bold uppercase text-slate-400 block">Detalle de Facturación Oficial:</span>
            
            <div class="space-y-2 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-slate-400">Arancel Oficial Water Transfer:</span>
                <span class="text-white font-bold">$400.000 ARS</span>
              </div>
              <div class="flex justify-between text-slate-400">
                <span>Modalidad de Cobro:</span>
                <span class="text-white">100% al inicio</span>
              </div>
              <div class="flex justify-between text-[#FFB000] pt-1">
                <span>Reintegro a Devolver Post-Cursado:</span>
                <span class="font-bold">${formatARS(referralSummary.totalPayout)}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700">
                <span>Total a Pagar en Pasarela:</span>
                <span class="text-[#74ACDF] font-mono text-xl">$400.000 ARS</span>
              </div>
            </div>

            <p class="text-[11px] text-slate-400 font-mono">
              Hasta 6 cuotas con tarjetas bancarias o dinero en cuenta Mercado Pago.
            </p>
          </div>

          <div class="space-y-3">
            <button type="button" id="btn-trigger-mp-checkout" class="w-full py-4 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-sky-950/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <span>Abonar Matrícula Oficial ($400.000 ARS)</span>
            </button>

            <div class="text-center">
              <span class="text-[11px] text-slate-500 font-mono">
                🔒 Certificado SSL · Factura Oficial AFIP A o B emitida por la Consultora
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

  // Copiar enlace personal
  const btnCopy = document.getElementById('btn-copy-student-ref');
  const referralLink = `${window.location.origin}/#/catalogo?ref=${user.username || 'alumno01'}`;

  btnCopy?.addEventListener('click', () => {
    copyToClipboard(referralLink, '¡Enlace de referido copiado! Compártelo con tus colegas.');
  });

  // Simular inscripción de un colega nuevo (+20% de reintegro en tiempo real)
  const btnSimulate = document.getElementById('btn-simulate-referral');
  btnSimulate?.addEventListener('click', () => {
    const colleaguesPool = [
      { name: "Gonzalo Castro", dni: "37.401.992", courseTitle: "Water Transfer Nivel 1 y 2", paidAmount: 400000 },
      { name: "Federico Luján", dni: "38.109.432", courseTitle: "Inducción HSE Vaca Muerta", paidAmount: 320000 },
      { name: "Claudio Vera", dni: "32.908.771", courseTitle: "Higiene y Seguridad", paidAmount: 320000 },
      { name: "Sergio Mansilla", dni: "35.402.112", courseTitle: "Water Transfer Nivel 1 y 2", paidAmount: 400000 },
      { name: "Darío Figueroa", dni: "34.110.887", courseTitle: "Dev & Deploy Cloud", paidAmount: 150000 },
      { name: "Lucas Maidana", dni: "36.882.100", courseTitle: "Water Transfer Nivel 1 y 2", paidAmount: 400000 }
    ];

    const currentCount = referralService.getReferralsForStudent(user.id).length;
    const nextColleague = colleaguesPool[currentCount % colleaguesPool.length];

    try {
      referralService.addReferral(user.id, nextColleague);
      const isBeyondFive = (currentCount + 1) > 5;
      
      if (isBeyondFive) {
        showToast(`¡Colega ${nextColleague.name} inscripto! ¡Sumaste +20% de ganancia neta en efectivo!`, 'success');
      } else if (currentCount + 1 === 5) {
        showToast(`¡5 colegas inscriptos! ¡Has alcanzado el 100% de reintegro de tu curso!`, 'success');
      } else {
        showToast(`¡Colega ${nextColleague.name} inscripto! +20% acumulado de reintegro post-cursado.`, 'success');
      }

      setTimeout(() => window.location.reload(), 450);
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Abrir Checkout Mercado Pago
  const btnCheckout = document.getElementById('btn-trigger-mp-checkout');
  btnCheckout?.addEventListener('click', () => {
    const defaultCourse = courseService.getById('water-transfer-1-2');
    if (defaultCourse && onOpenCheckout) {
      onOpenCheckout(defaultCourse);
    }
  });
}
