/**
 * Vaca Muerta Consulting - Admin Dashboard
 * Módulo de Dirección Técnica (Lic. Víctor Javier Paredes, Mat. Profesional PA 446).
 * Control de ABM Alumnos, Cohortes escalonadas (190+ alumnos), Auditoría de Referidos,
 * Comisiones provinciales del 30% y gestión de pasarela Mercado Pago.
 */

import { storageService } from '../services/storageService.js';
import { courseService } from '../services/courseService.js';
import { cohortService } from '../services/cohortService.js';
import { referralService } from '../services/referralService.js';
import { coordinatorService } from '../services/coordinatorService.js';
import { formatARS, formatDate, showToast } from '../utils/formatters.js';

export function renderAdminDashboard() {
  const users = storageService.get('users') || [];
  const students = users.filter(u => u.role === 'student');
  const cohorts = cohortService.getAll();
  const coordinators = coordinatorService.getAll();
  const courses = courseService.getAll();
  const referralAudit = referralService.getGlobalReferralAudit();

  // Calcular métricas globales
  let totalRevenueEst = 0;
  students.forEach(st => {
    (st.enrolledCourses || []).forEach(cId => {
      const c = courses.find(item => item.id === cId);
      if (c) totalRevenueEst += c.basePrice;
    });
  });

  let totalCoordCommissions = 0;
  coordinators.forEach(c => totalCoordCommissions += (c.commissionEarned || 0));

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Cabecera de Dirección Técnica -->
      <div class="bg-gradient-to-r from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFB000]/20 text-[#FFB000] border border-[#FFB000]/40">
              Módulo de Alta Dirección Técnica
            </span>
            <span class="text-xs font-mono text-slate-400">Matrícula: PA 446</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">Panel de Control General · Dirección Académica</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Director Técnico: <strong class="text-white">Lic. Víctor Javier Paredes</strong> · Cuenca Neuquina
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-backup-export" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2">
            <svg class="w-4 h-4 text-[#74ACDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Exportar Backup JSON
          </button>
          <button id="btn-reset-db" class="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900 text-xs font-semibold rounded-xl transition-colors">
            Reiniciar Demo
          </button>
        </div>
      </div>

      <!-- Tarjetas de Métricas Ejecutivas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ALUMNOS PROYECTADOS</span>
            <span class="text-[#74ACDF] font-bold">Meta 190+</span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">${students.length}</span>
            <span class="text-xs text-slate-400">activos en sistema</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-[#74ACDF] h-full rounded-full" style="width: ${Math.min(100, (students.length / 190) * 100)}%"></div>
          </div>
        </div>

        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>COHORTES ACTIVAS</span>
            <span class="text-emerald-400 font-bold">Escalonadas</span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">${cohorts.length}</span>
            <span class="text-xs text-slate-400">grupos con tutor</span>
          </div>
          <div class="text-[11px] text-slate-400 mt-2 font-mono">
            Control de saturación en tutoría
          </div>
        </div>

        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>RED DE REFERIDOS</span>
            <span class="text-[#FFB000] font-bold">20% / Colega</span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-black text-[#FFB000] font-mono">${referralAudit.totalReferralsCount}</span>
            <span class="text-xs text-slate-400">promedio ${referralAudit.averageReferrals} p/estudiante</span>
          </div>
          <div class="text-[11px] text-amber-300/80 mt-2 font-mono">
            ${referralAudit.studentsWithBonification} alumnos con 100% bonificado
          </div>
        </div>

        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div class="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PROMOTORES PROVINCIALES</span>
            <span class="text-[#74ACDF] font-bold">30% Comisión</span>
          </div>
          <div class="mt-2 flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">${coordinators.length}</span>
            <span class="text-xs text-slate-400">nodos (Cuyo, Cba, BsAs)</span>
          </div>
          <div class="text-[11px] text-emerald-400 mt-2 font-mono">
            ${formatARS(totalCoordCommissions)} comisiones
          </div>
        </div>

      </div>

      <!-- Pestañas de Navegación del Panel de Control -->
      <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div class="border-b border-slate-800 pb-4 flex flex-wrap gap-2" id="admin-tabs">
          <button type="button" data-tab="tab-alumnos" class="admin-tab-btn px-4 py-2 bg-[#74ACDF] text-slate-950 font-bold text-xs rounded-xl transition-all">
            1. ABM Global de Alumnos (${students.length})
          </button>
          <button type="button" data-tab="tab-cohortes" class="admin-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
            2. Gestión de Cohortes (${cohorts.length})
          </button>
          <button type="button" data-tab="tab-referidos" class="admin-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
            3. Auditoría Red de Referidos
          </button>
          <button type="button" data-tab="tab-coordinadores" class="admin-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
            4. Promotores Provinciales (30%)
          </button>
          <button type="button" data-tab="tab-tarifas" class="admin-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
            5. Tarifas &amp; Mercado Pago
          </button>
        </div>

        <!-- CONTENIDO PESTAÑA 1: ABM ALUMNOS -->
        <div id="tab-alumnos" class="admin-tab-content pt-6 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold text-white">Directorio Oficial de Alumnos</h3>
              <p class="text-xs text-slate-400">Gestión de datos de contacto, DNI, teléfono, cohorte asignada y estado de inscripción.</p>
            </div>
            <button id="btn-modal-add-student" class="px-4 py-2.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Nuevo Alumno
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr class="bg-[#24282C] border-b border-slate-700 font-mono text-[11px] text-slate-400 uppercase">
                  <th class="p-3">Alumno / Credencial</th>
                  <th class="p-3">DNI &amp; Teléfono</th>
                  <th class="p-3">Ubicación</th>
                  <th class="p-3">Cohorte Asignada</th>
                  <th class="p-3">Cursos</th>
                  <th class="p-3">Referidos</th>
                  <th class="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${students.map(st => {
                  const cohort = cohorts.find(c => c.id === st.cohorteId);
                  const refCount = (st.referrals || []).length;
                  return `
                    <tr class="hover:bg-slate-800/40 transition-colors">
                      <td class="p-3">
                        <div class="font-bold text-white">${st.name}</div>
                        <div class="text-[11px] font-mono text-slate-400">Usuario: <span class="text-[#74ACDF]">${st.username}</span></div>
                      </td>
                      <td class="p-3 font-mono">
                        <div>DNI: ${st.dni || 'S/D'}</div>
                        <div class="text-slate-400 text-[11px]">${st.phone || 'S/D'}</div>
                      </td>
                      <td class="p-3">
                        <div>${st.city || 'Añelo'}</div>
                        <div class="text-slate-400 text-[11px]">${st.province || 'Neuquén'}</div>
                      </td>
                      <td class="p-3">
                        <span class="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200 block">
                          ${cohort ? cohort.name : 'Sin Asignar'}
                        </span>
                      </td>
                      <td class="p-3 font-mono text-[11px]">
                        ${(st.enrolledCourses || []).length} cursos
                      </td>
                      <td class="p-3">
                        <span class="px-2 py-1 rounded ${refCount >= 5 ? 'bg-amber-500/20 text-[#FFB000] border border-amber-500/40 font-black' : 'bg-slate-800 text-slate-300'} text-xs font-mono">
                          ${refCount} refs (${refCount * 20}%)
                        </span>
                      </td>
                      <td class="p-3 text-right">
                        <button type="button" data-student-id="${st.id}" class="btn-change-cohort text-xs text-[#74ACDF] hover:underline font-semibold">
                          Reasignar Cohorte
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- CONTENIDO PESTAÑA 2: GESTIÓN DE COHORTES -->
        <div id="tab-cohortes" class="admin-tab-content pt-6 space-y-6 hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold text-white">Grupos Escalonados de Formación (190+ Alumnos Proyectados)</h3>
              <p class="text-xs text-slate-400">División por cupos para garantizar tutorías personalizadas y evitar sobrecarga en yacimiento.</p>
            </div>
            <button id="btn-modal-add-cohort" class="px-4 py-2.5 bg-[#FFB000] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Nueva Cohorte
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${cohorts.map(cohort => `
              <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
                <div class="flex items-start justify-between">
                  <div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#74ACDF]/20 text-[#74ACDF] border border-[#74ACDF]/30 inline-block mb-1">
                      ${cohort.courseTitle}
                    </span>
                    <h4 class="text-base font-bold text-white">${cohort.name}</h4>
                  </div>
                  <span class="px-2.5 py-1 rounded text-xs font-mono font-bold ${cohort.occupancyRate >= 90 ? 'bg-amber-500/20 text-[#FFB000] border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}">
                    ${cohort.enrolled} / ${cohort.capacity} Cupos (${cohort.occupancyRate}%)
                  </span>
                </div>

                <!-- Barra de Ocupación -->
                <div>
                  <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div class="h-full rounded-full ${cohort.occupancyRate >= 90 ? 'bg-[#FFB000]' : 'bg-[#74ACDF]'}" style="width: ${cohort.occupancyRate}%"></div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
                  <div>
                    <span class="text-slate-500 block text-[10px]">FECHA DE INICIO</span>
                    <span class="font-bold text-white">${formatDate(cohort.startDate)}</span>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">TUTOR ASIGNADO</span>
                    <span class="text-slate-200">${cohort.tutor}</span>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">HORARIO CLASES</span>
                    <span class="text-slate-300">${cohort.schedule}</span>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[10px]">SALA MEET</span>
                    <a href="${cohort.roomLink}" target="_blank" class="text-[#74ACDF] hover:underline">Abrir Enlace</a>
                  </div>
                </div>

                ${cohort.notes ? `
                  <p class="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    ℹ️ ${cohort.notes}
                  </p>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CONTENIDO PESTAÑA 3: AUDITORÍA RED DE REFERIDOS -->
        <div id="tab-referidos" class="admin-tab-content pt-6 space-y-6 hidden">
          <div>
            <h3 class="text-base font-bold text-white">Auditoría Integral de Reintegros &amp; Red de Referidos Post-Capacitación</h3>
            <p class="text-xs text-slate-400">
              Política: El alumno abona el 100% al inicio. Al finalizar la capacitación se devuelve el 20% por colega. Con 5 colegas se reintegra el 100% de su curso, y con más de 5 se abona el 100% del curso más un 20% de ganancia neta por cada colega por sobre los 5.
            </p>
          </div>

          <!-- Alerta de Reintegros 100% y Ganancias Extras -->
          <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
            <svg class="w-5 h-5 text-[#FFB000] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div class="text-xs text-slate-300 space-y-1">
              <span class="font-bold text-white block">Compromisos de Liquidación Bancaria Post-Cursado:</span>
              <p class="text-slate-400">
                Se registran <strong>${referralAudit.studentsWithFullRefund} alumnos con 100% de devolución</strong> de matrícula y <strong>${referralAudit.studentsWithExtraBonus} alumnos con ganancias netas adicionales</strong> (&gt;5 referidos). Verifique la finalización del cursado antes de emitir las transferencias.
              </p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr class="bg-[#24282C] border-b border-slate-700 font-mono text-[11px] text-slate-400 uppercase">
                  <th class="p-3">Estudiante Titular</th>
                  <th class="p-3">DNI / Contacto</th>
                  <th class="p-3">Colegas Inscriptos</th>
                  <th class="p-3">Devolución Curso</th>
                  <th class="p-3">Ganancia Extra (&gt;5)</th>
                  <th class="p-3">Total a Liquidar</th>
                  <th class="p-3">Detalle de Colegas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${referralAudit.auditList.map(item => `
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="p-3 font-bold text-white">${item.name}</td>
                    <td class="p-3 font-mono text-[11px]">
                      <div>${item.dni}</div>
                      <div class="text-slate-400">${item.email}</div>
                    </td>
                    <td class="p-3 font-mono font-bold text-center text-sm text-[#74ACDF]">
                      ${item.referralsCount}
                    </td>
                    <td class="p-3 font-mono font-bold text-[#FFB000]">
                      ${formatARS(item.courseRefundAmount)}
                      ${item.isFullyBonified ? '<span class="text-[10px] block text-emerald-400">★ 100% Recuperado</span>' : ''}
                    </td>
                    <td class="p-3 font-mono font-bold ${item.hasExtraBonus ? 'text-emerald-400' : 'text-slate-500'}">
                      ${item.hasExtraBonus ? `+${formatARS(item.extraBonusTotal)}` : '$0'}
                    </td>
                    <td class="p-3 font-mono font-black text-sm text-white">
                      ${formatARS(item.totalPayout)}
                    </td>
                    <td class="p-3 text-[11px] text-slate-400">
                      ${item.referralsList.length > 0 ? `
                        <ul class="list-disc list-inside space-y-0.5">
                          ${item.referralsList.map(r => `<li>${r.name} (${r.status})</li>`).join('')}
                        </ul>
                      ` : '<em>Sin referidos aún</em>'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- CONTENIDO PESTAÑA 4: PROMOTORES PROVINCIALES (30%) -->
        <div id="tab-coordinadores" class="admin-tab-content pt-6 space-y-6 hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold text-white">Red Comercial Provincial (Comisión Oficial del 30%)</h3>
              <p class="text-xs text-slate-400">Auditoría de ventas por provincia, comisiones devengadas y liquidación a promotores.</p>
            </div>
            <button id="btn-modal-add-coordinator" class="px-4 py-2.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Nuevo Coordinador
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${coordinators.map(coord => {
              const stats = coordinatorService.getStats(coord.id);
              return `
                <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#74ACDF]/20 text-[#74ACDF] border border-[#74ACDF]/30 inline-block mb-1">
                        ${coord.province}
                      </span>
                      <h4 class="text-base font-bold text-white">${coord.name}</h4>
                      <span class="text-xs font-mono text-slate-400 block">${coord.email}</span>
                    </div>
                    <span class="text-xs font-mono font-bold text-[#FFB000] bg-slate-900 px-2 py-1 rounded border border-slate-700">
                      ${coord.promoCode}
                    </span>
                  </div>

                  <!-- Métricas de Venta -->
                  <div class="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <div class="flex justify-between font-mono">
                      <span class="text-slate-400">Inscripciones Zona:</span>
                      <span class="font-bold text-white">${stats.activeReferralsCount} de ${stats.targetGoal} (Meta)</span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-[#74ACDF] h-full rounded-full" style="width: ${stats.targetProgress}%"></div>
                    </div>
                    <div class="flex justify-between font-mono pt-1">
                      <span class="text-slate-400">Facturación Cobrada:</span>
                      <span class="font-bold text-white">${formatARS(stats.totalSalesRevenue)}</span>
                    </div>
                    <div class="flex justify-between font-mono">
                      <span class="text-slate-400">Comisión 30% Devengada:</span>
                      <span class="font-bold text-emerald-400">${formatARS(stats.commissionEarned)}</span>
                    </div>
                    <div class="flex justify-between font-mono">
                      <span class="text-slate-400">Pendiente de Liquidar:</span>
                      <span class="font-bold text-[#FFB000]">${formatARS(stats.commissionPending)}</span>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-slate-800">
                    <button type="button" data-coord-id="${coord.id}" class="btn-liquidate-coord w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors">
                      Liquidar Comisión
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- CONTENIDO PESTAÑA 5: TARIFAS & MERCADO PAGO -->
        <div id="tab-tarifas" class="admin-tab-content pt-6 space-y-6 hidden">
          <div>
            <h3 class="text-base font-bold text-white">Gestión de Aranceles Oficiales &amp; Pasarela Mercado Pago</h3>
            <p class="text-xs text-slate-400">Actualización en tiempo real de los valores de los cursos y configuración de pagos.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${courses.map(course => `
              <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-5 space-y-4">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-[10px] font-mono font-bold text-[#74ACDF]">${course.code}</span>
                    <h4 class="text-base font-bold text-white">${course.title}</h4>
                  </div>
                  <span class="text-lg font-black text-white font-mono" id="price-display-${course.id}">
                    ${formatARS(course.basePrice)}
                  </span>
                </div>

                <form class="form-update-price flex gap-2 pt-2 border-t border-slate-800" data-course-id="${course.id}">
                  <input type="number" step="5000" min="50000" value="${course.basePrice}" class="input-new-price w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
                  <button type="submit" class="px-4 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0">
                    Guardar
                  </button>
                </form>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}

export function initAdminEvents() {
  // Tabs switching
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => {
        b.className = 'admin-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all';
      });
      btn.className = 'admin-tab-btn px-4 py-2 bg-[#74ACDF] text-slate-950 font-bold text-xs rounded-xl transition-all';

      tabContents.forEach(c => {
        if (c.id === targetTab) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // Update prices
  document.querySelectorAll('.form-update-price').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const courseId = form.getAttribute('data-course-id');
      const input = form.querySelector('.input-new-price');
      const newPrice = Number(input.value);

      try {
        courseService.updatePrice(courseId, newPrice);
        const display = document.getElementById(`price-display-${courseId}`);
        if (display) display.textContent = formatARS(newPrice);
        showToast(`Arancel de ${courseId} actualizado a ${formatARS(newPrice)}`, 'success');
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  });

  // Reset database button
  document.getElementById('btn-reset-db')?.addEventListener('click', () => {
    if (confirm('¿Desea restablecer todos los datos a la configuración inicial? Se restaurarán los 4 cursos, cohortes y alumnos de prueba.')) {
      storageService.resetToDefaults();
      showToast('Base de datos restablecida correctamente.', 'success');
      setTimeout(() => window.location.reload(), 500);
    }
  });

  // Export JSON backup
  document.getElementById('btn-backup-export')?.addEventListener('click', () => {
    const data = storageService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_vaca_muerta_consulting_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado exitosamente.', 'success');
  });

  // Liquidate coordinator commission
  document.querySelectorAll('.btn-liquidate-coord').forEach(btn => {
    btn.addEventListener('click', () => {
      const coordId = btn.getAttribute('data-coord-id');
      const stats = coordinatorService.getStats(coordId);
      if (stats.commissionPending <= 0) {
        showToast('No hay saldo de comisión pendiente para liquidar.', 'info');
        return;
      }
      const toPay = prompt(`Ingrese el monto a liquidar para ${stats.coordinator.name} (Pendiente: ${formatARS(stats.commissionPending)}):`, stats.commissionPending);
      if (toPay && Number(toPay) > 0) {
        coordinatorService.liquidateCommission(coordId, Number(toPay));
        showToast(`Se liquidaron ${formatARS(Number(toPay))} a ${stats.coordinator.name}`, 'success');
        setTimeout(() => window.location.reload(), 500);
      }
    });
  });
}
