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
          <button type="button" data-tab="tab-cursos" class="admin-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
            5. ABM Cursos &amp; Catálogo (${courses.length})
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
                        <button type="button" data-student-id="${st.id}" data-student-name="${st.name}" class="btn-change-cohort text-xs text-[#74ACDF] hover:underline font-semibold">
                          Reasignar Cohorte
                        </button>
                        <button type="button" data-student-id="${st.id}" data-student-name="${st.name}" class="btn-delete-student text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold ml-3" title="Eliminar alumno">
                          Eliminar
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

                <div class="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span class="text-slate-500 font-mono text-[10px]">ID: ${cohort.id}</span>
                  <button type="button" data-cohort-id="${cohort.id}" data-cohort-name="${cohort.name}" class="btn-delete-cohort text-rose-400 hover:text-rose-300 hover:underline font-semibold text-xs flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Eliminar Cohorte
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- CONTENIDO PESTAÑA 3: AUDITORÍA RED DE REFERIDOS & EGRESADOS -->
        <div id="tab-referidos" class="admin-tab-content pt-6 space-y-6 hidden">
          <div>
            <h3 class="text-base font-bold text-white">Auditoría Integral de Reintegros &amp; Comisiones a Egresados</h3>
            <p class="text-xs text-slate-400">
              Reglas Oficiales: 
              <strong>1. En Cursado:</strong> 20% reintegro post-capacitación por colega (100% con 5, +20% extra &gt;5).
              <strong>2. Egresados:</strong> Comisión permanente del 15% por cada nuevo colega inscripto con su código que <em>abone efectivamente su arancel</em>.
            </p>
          </div>

          <!-- Alerta de Reintegros y Comisiones -->
          <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
            <svg class="w-5 h-5 text-[#FFB000] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div class="text-xs text-slate-300 space-y-1">
              <span class="font-bold text-white block">Estado de Liquidaciones Pendientes por Transferencia:</span>
              <p class="text-slate-400">
                Se auditan <strong>${referralAudit.studentsWithFullRefund} alumnos con 100% de devolución</strong> de matrícula, <strong>${referralAudit.studentsWithExtraBonus} alumnos con ganancias netas extras</strong> (&gt;5 referidos), y <strong>${formatARS(referralAudit.totalGraduateCommissions || 0)} en comisiones a egresados</strong> (15% por referido abonado).
              </p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr class="bg-[#24282C] border-b border-slate-700 font-mono text-[11px] text-slate-400 uppercase">
                  <th class="p-3">Estudiante / Egresado</th>
                  <th class="p-3">Estado Académico</th>
                  <th class="p-3">Referidos (Pagados / Total)</th>
                  <th class="p-3">Concepto Liquidación</th>
                  <th class="p-3">Total a Pagar</th>
                  <th class="p-3">Colegas Referidos</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                ${referralAudit.auditList.map(item => `
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="p-3">
                      <div class="font-bold text-white">${item.name}</div>
                      <div class="text-[11px] font-mono text-slate-400">DNI: ${item.dni}</div>
                    </td>
                    <td class="p-3">
                      ${item.isGraduate ? `
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-[#FFB000] border border-amber-500/30">
                          🎓 Egresado Oficial
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Alumno en Cursado
                        </span>
                      `}
                    </td>
                    <td class="p-3 font-mono font-bold text-sm">
                      <span class="text-emerald-400">${item.paidReferralsCount} abonados</span>
                      ${item.pendingReferralsCount > 0 ? `<span class="text-slate-500 text-xs block">(${item.pendingReferralsCount} pendientes)</span>` : ''}
                    </td>
                    <td class="p-3 font-mono text-xs">
                      ${item.isGraduate ? `
                        <span class="text-[#74ACDF] font-bold">15% Comisión Egresado</span>
                        <span class="text-slate-500 block text-[10px]">Por colegas abonados</span>
                      ` : `
                        <span class="text-[#FFB000] font-bold">${formatARS(item.courseRefundAmount)} reintegro</span>
                        ${item.hasExtraBonus ? `<span class="text-emerald-400 block text-[10px]">+${formatARS(item.extraBonusTotal)} bono extra</span>` : ''}
                      `}
                    </td>
                    <td class="p-3 font-mono font-black text-sm text-white">
                      ${formatARS(item.totalPayout)}
                    </td>
                    <td class="p-3 text-[11px] text-slate-400">
                      ${item.referralsList.length > 0 ? `
                        <ul class="space-y-1">
                          ${item.referralsList.map(r => {
                            const isPaid = r.paymentStatus === 'paid' || r.isPaid !== false;
                            return `
                              <li class="flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
                                <span>${r.name}</span>
                                <span class="text-[10px] font-mono ${isPaid ? 'text-emerald-400' : 'text-amber-400'}">
                                  (${isPaid ? 'Abonado' : 'Pendiente'})
                                </span>
                              </li>
                            `;
                          }).join('')}
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

                  <div class="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <button type="button" data-coord-id="${coord.id}" class="btn-liquidate-coord flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-colors">
                      Liquidar
                    </button>
                    <button type="button" data-coord-id="${coord.id}" data-coord-name="${coord.name}" class="btn-delete-coord px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 hover:border-rose-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5" title="Eliminar colaborador">
                      <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- CONTENIDO PESTAÑA 5: ABM CURSOS & CATÁLOGO -->
        <div id="tab-cursos" class="admin-tab-content pt-6 space-y-6 hidden">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 class="text-base font-bold text-white">Gestión Integral del Catálogo Oficial de Cursos (ABM)</h3>
              <p class="text-xs text-slate-400">Crear nuevos programas, pausar inscripciones, ocultar de la vista pública, editar aranceles y eliminar cursos.</p>
            </div>
            <button id="btn-modal-add-course" class="px-4 py-2.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-sky-950/40">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              + Nuevo Curso
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${courses.map(course => {
              const isPaused = course.status === 'paused';
              const isHidden = course.status === 'hidden';
              return `
              <div class="bg-[#24282C] border ${isHidden ? 'border-dashed border-slate-700 opacity-80' : isPaused ? 'border-amber-500/40' : 'border-slate-800'} rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
                <div>
                  <!-- Encabezado del Curso -->
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex items-center gap-3">
                      <img src="${course.image || 'https://victorparedes.ar/bg1.jpg'}" alt="${course.title}" onerror="this.src='https://victorparedes.ar/bg1.jpg'" class="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0">
                      <div>
                        <div class="flex items-center gap-2 mb-1">
                          <span class="text-[10px] font-mono font-bold text-[#74ACDF] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">${course.code}</span>
                          <span class="text-[10px] text-slate-400 font-mono">${course.category}</span>
                        </div>
                        <h4 class="text-sm font-bold text-white leading-snug">${course.title}</h4>
                      </div>
                    </div>
                  </div>

                  <!-- Insignias de Estado -->
                  <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800">
                    ${isHidden ? `
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-600 flex items-center gap-1">
                        👁️ Oculto (Privado / Borrador)
                      </span>
                    ` : isPaused ? `
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-[#FFB000] border border-amber-500/40 flex items-center gap-1">
                        ⏸️ Inscripciones Pausadas
                      </span>
                    ` : `
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                        🟢 Activo en Catálogo
                      </span>
                    `}
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                      ${course.duration}
                    </span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                      ${course.modality}
                    </span>
                  </div>

                  <p class="text-[11px] text-slate-400 mt-2 line-clamp-2">
                    ${course.description}
                  </p>
                </div>

                <!-- Barra de Acciones y Arancel -->
                <div class="pt-3 border-t border-slate-800 space-y-3">
                  <!-- Control rápido de arancel -->
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-mono text-slate-400">Arancel Oficial:</span>
                    <span class="text-base font-black text-white font-mono" id="price-display-${course.id}">
                      ${formatARS(course.basePrice)}
                    </span>
                  </div>
                  
                  <form class="form-update-price flex gap-2" data-course-id="${course.id}">
                    <input type="number" step="5000" min="50000" value="${course.basePrice}" class="input-new-price w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
                    <button type="submit" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors shrink-0">
                      Actualizar
                    </button>
                  </form>

                  <!-- Botones de Control ABM -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                    <button type="button" data-course-id="${course.id}" class="btn-edit-course px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1" title="Editar datos del curso">
                      <svg class="w-3.5 h-3.5 text-[#74ACDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      Editar
                    </button>

                    <button type="button" data-course-id="${course.id}" class="btn-toggle-pause px-2.5 py-1.5 ${isPaused ? 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800' : 'bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-800'} font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1" title="${isPaused ? 'Reanudar inscripciones' : 'Pausar inscripciones'}">
                      ${isPaused ? '▶ Activar' : '⏸ Pausar'}
                    </button>

                    <button type="button" data-course-id="${course.id}" class="btn-toggle-visibility px-2.5 py-1.5 ${isHidden ? 'bg-sky-950/50 hover:bg-sky-900/60 text-sky-300 border border-sky-800' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'} font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1" title="${isHidden ? 'Mostrar en catálogo' : 'Ocultar de catálogo'}">
                      ${isHidden ? '👁️ Mostrar' : '🕶️ Ocultar'}
                    </button>

                    <button type="button" data-course-id="${course.id}" data-course-title="${course.title}" class="btn-delete-course px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/50 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1" title="Eliminar curso">
                      <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Borrar
                    </button>
                  </div>
                </div>

              </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>

    <!-- MODAL ABM CURSO (CREAR / EDITAR) -->
    <div id="modal-course-form" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button type="button" id="btn-close-course-modal" class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="flex items-center gap-3 mb-4">
          <span class="w-3 h-3 rounded-full bg-[#74ACDF]"></span>
          <h3 id="course-modal-title" class="text-lg font-bold text-white">Nuevo Curso de Formación</h3>
        </div>
        <form id="form-course-save" class="space-y-4">
          <input type="hidden" id="course-form-id" value="">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Código Oficial</label>
              <input type="text" id="course-form-code" required placeholder="Ej: VM-WT-02" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Categoría</label>
              <select id="course-form-category" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
                <option value="Operaciones de Campo">Operaciones de Campo</option>
                <option value="HSE & Normativa">HSE &amp; Normativa</option>
                <option value="Software & Simulación Upstream">Software &amp; Simulación Upstream</option>
                <option value="Perforación & Terminación">Perforación &amp; Terminación</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">Título del Curso</label>
            <input type="text" id="course-form-title" required placeholder="Título técnico del programa" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Arancel Base (ARS)</label>
              <input type="number" id="course-form-price" required step="5000" min="50000" placeholder="350000" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Duración</label>
              <input type="text" id="course-form-duration" required placeholder="40 Horas (4 Semanas)" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Estado</label>
              <select id="course-form-status" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
                <option value="active">🟢 Activo en Catálogo</option>
                <option value="paused">⏸️ Pausar Inscripciones</option>
                <option value="hidden">👁️ Oculto (Borrador)</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Modalidad</label>
              <input type="text" id="course-form-modality" value="Virtual + Tutoría Sincrónica" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Insignia / Badge Promocional</label>
              <input type="text" id="course-form-badge" placeholder="Programa Oficial 2026" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">URL de Imagen de Portada</label>
            <input type="url" id="course-form-image" required placeholder="https://..." class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
            <div class="mt-2 flex flex-wrap gap-1.5 items-center">
              <span class="text-[10px] text-slate-400 font-mono">Fotos oficiales victorparedes.ar:</span>
              <button type="button" class="btn-preset-img px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700" data-url="https://victorparedes.ar/th_tendido.jpg">Layflat 12"</button>
              <button type="button" class="btn-preset-img px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700" data-url="https://victorparedes.ar/bg1.jpg">Yacimiento</button>
              <button type="button" class="btn-preset-img px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700" data-url="https://victorparedes.ar/bg4.jpg">Pits</button>
              <button type="button" class="btn-preset-img px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700" data-url="https://victorparedes.ar/th_traza.jpg">Software</button>
              <button type="button" class="btn-preset-img px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700" data-url="https://victorparedes.ar/th_montaje.jpg">Montaje</button>
              <button type="button" class="btn-preset-img px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded border border-slate-700" data-url="https://victorparedes.ar/th_sim3d.jpg">Simulación 3D</button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">Descripción del Programa Formativo</label>
            <textarea id="course-form-desc" rows="3" required placeholder="Detalles técnicos, requerimientos y perfil..." class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]"></textarea>
          </div>
          <div class="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" id="btn-cancel-course-modal" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-sky-950/40">Guardar Curso</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL NUEVO COORDINADOR -->
    <div id="modal-coord-form" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        <button type="button" id="btn-close-coord-modal" class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="flex items-center gap-3 mb-4">
          <span class="w-3 h-3 rounded-full bg-[#FFB000]"></span>
          <h3 class="text-lg font-bold text-white">Nuevo Promotor / Coordinador Provincial</h3>
        </div>
        <form id="form-coord-save" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Nombre Completo</label>
              <input type="text" id="coord-form-name" required placeholder="Ej: Ing. Martín Gómez" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Provincia / Región</label>
              <input type="text" id="coord-form-province" required placeholder="Ej: Mendoza / Salta" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Usuario de Acceso</label>
              <input type="text" id="coord-form-username" required placeholder="coord.mza" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Código Promocional</label>
              <input type="text" id="coord-form-promocode" required placeholder="MZA30" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-[#FFB000] font-bold outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Email</label>
              <input type="email" id="coord-form-email" required placeholder="promotor@gmail.com" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Teléfono / WhatsApp</label>
              <input type="text" id="coord-form-phone" placeholder="+54 9 261..." class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" id="btn-cancel-coord-modal" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-2 bg-[#FFB000] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">Registrar Coordinador</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL NUEVA COHORTE -->
    <div id="modal-cohort-form" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        <button type="button" id="btn-close-cohort-modal" class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="flex items-center gap-3 mb-4">
          <span class="w-3 h-3 rounded-full bg-[#FFB000]"></span>
          <h3 class="text-lg font-bold text-white">Nueva Cohorte de Capacitación</h3>
        </div>
        <form id="form-cohort-save" class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">Nombre de la Cohorte</label>
            <input type="text" id="cohort-form-name" required placeholder="Ej: Cohorte Febrero C - Water Transfer" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
          </div>
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">Curso Asignado</label>
            <select id="cohort-form-course" required class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
              ${courses.map(c => `<option value="${c.id}">${c.title} (${c.code})</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Fecha de Inicio</label>
              <input type="date" id="cohort-form-start" required class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Capacidad Máxima</label>
              <input type="number" id="cohort-form-capacity" value="30" min="5" max="100" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Tutor Asignado</label>
              <input type="text" id="cohort-form-tutor" value="Lic. Víctor Javier Paredes" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Horario de Clases</label>
              <input type="text" id="cohort-form-schedule" value="Martes y Jueves 19:30 hs" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" id="btn-cancel-cohort-modal" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-2 bg-[#FFB000] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">Crear Cohorte</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL NUEVO ALUMNO -->
    <div id="modal-student-form" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        <button type="button" id="btn-close-student-modal" class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="flex items-center gap-3 mb-4">
          <span class="w-3 h-3 rounded-full bg-[#74ACDF]"></span>
          <h3 class="text-lg font-bold text-white">Alta Manual de Alumno</h3>
        </div>
        <form id="form-student-save" class="space-y-4">
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">Nombre Completo</label>
            <input type="text" id="student-form-name" required placeholder="Ej: Juan Pérez" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">DNI</label>
              <input type="text" id="student-form-dni" required placeholder="35123456" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs font-mono text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Teléfono / WhatsApp</label>
              <input type="text" id="student-form-phone" placeholder="+54 9 299..." class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Provincia</label>
              <input type="text" id="student-form-province" value="Neuquén" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Ciudad / Base</label>
              <input type="text" id="student-form-city" value="Añelo" class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Curso a Inscribir</label>
              <select id="student-form-course" required class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
                ${courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-mono text-slate-300 mb-1">Cohorte Asignada</label>
              <select id="student-form-cohort" required class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
                ${cohorts.map(co => `<option value="${co.id}">${co.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" id="btn-cancel-student-modal" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">Registrar Alumno</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL REASIGNAR COHORTE -->
    <div id="modal-reassign-cohort" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl relative text-slate-100">
        <button type="button" id="btn-close-reassign-modal" class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <h3 class="text-base font-bold text-white mb-1">Reasignar Cohorte</h3>
        <p id="reassign-student-name" class="text-xs text-[#74ACDF] mb-4 font-mono"></p>
        <form id="form-reassign-cohort" class="space-y-4">
          <input type="hidden" id="reassign-student-id" value="">
          <div>
            <label class="block text-xs font-mono text-slate-300 mb-1">Nueva Cohorte</label>
            <select id="reassign-cohort-select" required class="w-full px-3 py-2 bg-[#24282C] border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-[#74ACDF]">
              ${cohorts.map(co => `<option value="${co.id}">${co.name} (${co.courseTitle})</option>`).join('')}
            </select>
          </div>
          <div class="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button type="button" id="btn-cancel-reassign-modal" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">Cancelar</button>
            <button type="submit" class="px-5 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">Confirmar Cambio</button>
          </div>
        </form>
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

  // ==========================================
  // ABM DE CURSOS
  // ==========================================
  const modalCourse = document.getElementById('modal-course-form');
  const formCourse = document.getElementById('form-course-save');
  const courseModalTitle = document.getElementById('course-modal-title');

  // Abrir modal Nuevo Curso
  document.getElementById('btn-modal-add-course')?.addEventListener('click', () => {
    formCourse.reset();
    document.getElementById('course-form-id').value = '';
    document.getElementById('course-form-code').disabled = false;
    document.getElementById('course-form-image').value = 'https://victorparedes.ar/th_tendido.jpg';
    courseModalTitle.textContent = 'Nuevo Curso de Formación Upstream';
    modalCourse.classList.remove('hidden');
  });

  // Cerrar modal curso
  const closeCourseModal = () => modalCourse?.classList.add('hidden');
  document.getElementById('btn-close-course-modal')?.addEventListener('click', closeCourseModal);
  document.getElementById('btn-cancel-course-modal')?.addEventListener('click', closeCourseModal);

  // Chips para fotos oficiales
  document.querySelectorAll('.btn-preset-img').forEach(chip => {
    chip.addEventListener('click', () => {
      const inputImg = document.getElementById('course-form-image');
      if (inputImg) inputImg.value = chip.getAttribute('data-url');
    });
  });

  // Abrir modal Editar Curso
  document.querySelectorAll('.btn-edit-course').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id');
      const course = courseService.getById(courseId);
      if (!course) return;

      document.getElementById('course-form-id').value = course.id;
      document.getElementById('course-form-code').value = course.code;
      document.getElementById('course-form-code').disabled = true;
      document.getElementById('course-form-category').value = course.category;
      document.getElementById('course-form-title').value = course.title;
      document.getElementById('course-form-price').value = course.basePrice;
      document.getElementById('course-form-duration').value = course.duration;
      document.getElementById('course-form-status').value = course.status || 'active';
      document.getElementById('course-form-modality').value = course.modality || 'Virtual + Tutoría Sincrónica';
      document.getElementById('course-form-badge').value = course.badge || '';
      document.getElementById('course-form-image').value = course.image || 'https://victorparedes.ar/bg1.jpg';
      document.getElementById('course-form-desc').value = course.description || '';

      courseModalTitle.textContent = `Editar Capacitación: ${course.title}`;
      modalCourse.classList.remove('hidden');
    });
  });

  // Guardar Curso (Crear o Actualizar)
  formCourse?.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseId = document.getElementById('course-form-id').value;
    const courseData = {
      code: document.getElementById('course-form-code').value.trim(),
      category: document.getElementById('course-form-category').value,
      title: document.getElementById('course-form-title').value.trim(),
      basePrice: Number(document.getElementById('course-form-price').value),
      duration: document.getElementById('course-form-duration').value.trim(),
      status: document.getElementById('course-form-status').value,
      modality: document.getElementById('course-form-modality').value.trim(),
      badge: document.getElementById('course-form-badge').value.trim(),
      image: document.getElementById('course-form-image').value.trim(),
      description: document.getElementById('course-form-desc').value.trim()
    };

    try {
      if (courseId) {
        courseService.update(courseId, courseData);
        showToast('Curso actualizado exitosamente.', 'success');
      } else {
        courseService.create(courseData);
        showToast('Curso creado y publicado exitosamente.', 'success');
      }
      closeCourseModal();
      storageService.reloadWhenSaved();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Pausar / Reactivar inscripciones
  document.querySelectorAll('.btn-toggle-pause').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id');
      const updated = courseService.togglePause(courseId);
      const isPaused = updated.status === 'paused';
      showToast(isPaused ? `Inscripciones pausadas para ${updated.code}` : `Inscripciones reactivadas para ${updated.code}`, isPaused ? 'warning' : 'success');
      storageService.reloadWhenSaved();
    });
  });

  // Ocultar / Mostrar curso del catálogo
  document.querySelectorAll('.btn-toggle-visibility').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id');
      const updated = courseService.toggleVisibility(courseId);
      const isHidden = updated.status === 'hidden';
      showToast(isHidden ? `Curso ${updated.code} ocultado del catálogo público.` : `Curso ${updated.code} visible en catálogo público.`, isHidden ? 'info' : 'success');
      storageService.reloadWhenSaved();
    });
  });

  // Eliminar curso
  document.querySelectorAll('.btn-delete-course').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course-id');
      const title = btn.getAttribute('data-course-title') || courseId;
      if (confirm(`¿Confirma que desea eliminar el curso "${title}" del catálogo oficial?`)) {
        courseService.delete(courseId);
        showToast(`Curso ${title} eliminado del catálogo.`, 'info');
        storageService.reloadWhenSaved();
      }
    });
  });

  // Actualización rápida de precios
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

  // ==========================================
  // ABM DE ALUMNOS
  // ==========================================
  const modalStudent = document.getElementById('modal-student-form');
  const formStudent = document.getElementById('form-student-save');
  const closeStudentModal = () => modalStudent?.classList.add('hidden');

  document.getElementById('btn-modal-add-student')?.addEventListener('click', () => {
    formStudent.reset();
    modalStudent.classList.remove('hidden');
  });
  document.getElementById('btn-close-student-modal')?.addEventListener('click', closeStudentModal);
  document.getElementById('btn-cancel-student-modal')?.addEventListener('click', closeStudentModal);

  formStudent?.addEventListener('submit', (e) => {
    e.preventDefault();
    const users = storageService.get('users') || [];
    const name = document.getElementById('student-form-name').value.trim();
    const dni = document.getElementById('student-form-dni').value.trim();
    const phone = document.getElementById('student-form-phone').value.trim();
    const province = document.getElementById('student-form-province').value.trim();
    const city = document.getElementById('student-form-city').value.trim();
    const courseId = document.getElementById('student-form-course').value;
    const cohortId = document.getElementById('student-form-cohort').value;

    const baseUser = name.toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '');
    const username = `${baseUser}${dni.slice(-4)}`;

    const newStudent = {
      id: `usr-${Date.now()}`,
      username: username,
      password: 'alumno2026',
      name: name,
      role: 'student',
      dni: dni,
      email: `${username}@gmail.com`,
      phone: phone,
      province: province,
      city: city,
      cohorteId: cohortId,
      enrolledCourses: [courseId],
      isGraduate: false,
      referralCode: `VM${dni.slice(-4)}`,
      referredBy: null,
      referrals: []
    };

    users.push(newStudent);
    storageService.set('users', users);
    showToast(`Alumno ${name} registrado con éxito. Usuario: ${username}`, 'success');
    closeStudentModal();
    storageService.reloadWhenSaved();
  });

  // Eliminar alumno
  document.querySelectorAll('.btn-delete-student').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = btn.getAttribute('data-student-id');
      const studentName = btn.getAttribute('data-student-name') || 'el alumno';
      if (confirm(`¿Confirma que desea eliminar a "${studentName}" del padrón de alumnos?`)) {
        const users = storageService.get('users') || [];
        const updated = users.filter(u => u.id !== studentId);
        storageService.set('users', updated);
        showToast(`Alumno ${studentName} eliminado.`, 'info');
        storageService.reloadWhenSaved();
      }
    });
  });

  // Reasignar cohorte a alumno
  const modalReassign = document.getElementById('modal-reassign-cohort');
  const formReassign = document.getElementById('form-reassign-cohort');
  const closeReassignModal = () => modalReassign?.classList.add('hidden');

  document.querySelectorAll('.btn-change-cohort').forEach(btn => {
    btn.addEventListener('click', () => {
      const studentId = btn.getAttribute('data-student-id');
      const studentName = btn.getAttribute('data-student-name') || 'Alumno';
      document.getElementById('reassign-student-id').value = studentId;
      document.getElementById('reassign-student-name').textContent = `Alumno: ${studentName}`;
      modalReassign.classList.remove('hidden');
    });
  });

  document.getElementById('btn-close-reassign-modal')?.addEventListener('click', closeReassignModal);
  document.getElementById('btn-cancel-reassign-modal')?.addEventListener('click', closeReassignModal);

  formReassign?.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = document.getElementById('reassign-student-id').value;
    const newCohortId = document.getElementById('reassign-cohort-select').value;
    const users = storageService.get('users') || [];
    const index = users.findIndex(u => u.id === studentId);

    if (index !== -1) {
      users[index].cohorteId = newCohortId;
      storageService.set('users', users);
      showToast('Cohorte reasignada exitosamente.', 'success');
      closeReassignModal();
      storageService.reloadWhenSaved();
    }
  });

  // ==========================================
  // GESTIÓN DE COHORTES
  // ==========================================
  const modalCohort = document.getElementById('modal-cohort-form');
  const formCohort = document.getElementById('form-cohort-save');
  const closeCohortModal = () => modalCohort?.classList.add('hidden');

  document.getElementById('btn-modal-add-cohort')?.addEventListener('click', () => {
    formCohort.reset();
    modalCohort.classList.remove('hidden');
  });
  document.getElementById('btn-close-cohort-modal')?.addEventListener('click', closeCohortModal);
  document.getElementById('btn-cancel-cohort-modal')?.addEventListener('click', closeCohortModal);

  formCohort?.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseId = document.getElementById('cohort-form-course').value;
    const course = courseService.getById(courseId);
    const cohortData = {
      name: document.getElementById('cohort-form-name').value.trim(),
      courseId: courseId,
      courseTitle: course ? course.title : 'Capacitación Oficial',
      startDate: document.getElementById('cohort-form-start').value,
      capacity: Number(document.getElementById('cohort-form-capacity').value),
      tutor: document.getElementById('cohort-form-tutor').value.trim(),
      schedule: document.getElementById('cohort-form-schedule').value.trim()
    };

    cohortService.create(cohortData);
    showToast(`Cohorte "${cohortData.name}" creada con éxito.`, 'success');
    closeCohortModal();
    storageService.reloadWhenSaved();
  });

  // Eliminar cohorte
  document.querySelectorAll('.btn-delete-cohort').forEach(btn => {
    btn.addEventListener('click', () => {
      const cohortId = btn.getAttribute('data-cohort-id');
      const cohortName = btn.getAttribute('data-cohort-name') || cohortId;
      if (confirm(`¿Confirma que desea eliminar la cohorte "${cohortName}"?`)) {
        const cohorts = storageService.get('cohorts') || [];
        const updated = cohorts.filter(c => c.id !== cohortId);
        storageService.set('cohorts', updated);
        showToast(`Cohorte ${cohortName} eliminada.`, 'info');
        storageService.reloadWhenSaved();
      }
    });
  });

  // ==========================================
  // PROMOTORES / COORDINADORES PROVINCIALES
  // ==========================================
  const modalCoord = document.getElementById('modal-coord-form');
  const formCoord = document.getElementById('form-coord-save');
  const closeCoordModal = () => modalCoord?.classList.add('hidden');

  document.getElementById('btn-modal-add-coordinator')?.addEventListener('click', () => {
    formCoord.reset();
    modalCoord.classList.remove('hidden');
  });
  document.getElementById('btn-close-coord-modal')?.addEventListener('click', closeCoordModal);
  document.getElementById('btn-cancel-coord-modal')?.addEventListener('click', closeCoordModal);

  formCoord?.addEventListener('submit', (e) => {
    e.preventDefault();
    const coordData = {
      name: document.getElementById('coord-form-name').value.trim(),
      province: document.getElementById('coord-form-province').value.trim(),
      username: document.getElementById('coord-form-username').value.trim(),
      promoCode: document.getElementById('coord-form-promocode').value.trim().toUpperCase(),
      email: document.getElementById('coord-form-email').value.trim(),
      phone: document.getElementById('coord-form-phone').value.trim()
    };

    try {
      coordinatorService.create(coordData);
      showToast(`Coordinador ${coordData.name} registrado con código ${coordData.promoCode}.`, 'success');
      closeCoordModal();
      storageService.reloadWhenSaved();
    } catch (err) {
      showToast(err.message, 'error');
    }
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
        storageService.reloadWhenSaved();
      }
    });
  });

  // Delete coordinator / colaborador
  document.querySelectorAll('.btn-delete-coord').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const coordId = e.currentTarget.getAttribute('data-coord-id');
      const coordName = e.currentTarget.getAttribute('data-coord-name');
      if (confirm(`¿Confirma que desea eliminar al colaborador/coordinador "${coordName}"? Esta acción revocará sus accesos y su código comercial.`)) {
        coordinatorService.delete(coordId);
        showToast(`Colaborador ${coordName} eliminado correctamente.`, 'info');
        storageService.reloadWhenSaved();
      }
    });
  });

  // ==========================================
  // UTILIDADES GLOBALES (RESET & BACKUP)
  // ==========================================
  document.getElementById('btn-reset-db')?.addEventListener('click', () => {
    if (confirm('¿Desea restablecer todos los datos a la configuración inicial? Se restaurarán los 4 cursos, cohortes y alumnos de prueba.')) {
      storageService.resetToDefaults();
      showToast('Base de datos restablecida correctamente.', 'success');
      storageService.reloadWhenSaved();
    }
  });

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
}

