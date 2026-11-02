/**
 * Vaca Muerta Consulting - Coordinator View (Expansión Comercial Provincial)
 * Panel adaptado para los asesores comerciales en provincias (Cuyo, Córdoba, Buenos Aires).
 * Seguimiento de inscriptos directos en su zona, cálculo automatizado del 30% de comisión
 * y control de metas hacia febrero.
 */

import { authService } from '../services/authService.js';
import { coordinatorService } from '../services/coordinatorService.js';
import { storageService } from '../services/storageService.js';
import { formatARS, copyToClipboard, showToast } from '../utils/formatters.js';

export function renderCoordinatorView() {
  const currentUser = authService.getCurrentUser();
  const coordinatorId = currentUser?.coordinatorId || 'coord-cuyo';
  const stats = coordinatorService.getStats(coordinatorId);

  if (!stats) {
    return `
      <div class="max-w-4xl mx-auto p-12 text-center text-slate-400">
        <p>No se encontraron datos del coordinador asignado.</p>
      </div>
    `;
  }

  const coord = stats.coordinator;
  const users = storageService.get('users') || [];
  const students = users.filter(u => u.role === 'student');

  const promoUrl = `${window.location.origin}/#/catalogo?promo=${coord.promoCode}`;

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <!-- Cabecera del Coordinador Provincial -->
      <div class="bg-gradient-to-r from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#74ACDF]/20 text-[#74ACDF] border border-[#74ACDF]/30">
              Módulo Promotor Provincial · Expansión Comercial
            </span>
            <span class="text-xs font-mono text-slate-400">Jurisdicción: <strong class="text-white">${coord.province}</strong></span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white">Panel de Gestión Comercial: ${coord.name}</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            Código Promocional Oficial: <span class="text-[#FFB000] font-bold">${coord.promoCode}</span> · Comisión Directa: <span class="text-emerald-400 font-bold">30%</span>
          </p>
        </div>

        <!-- Enlace Comercial Único Copiable -->
        <div class="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
          <span class="text-[11px] font-mono font-bold uppercase text-slate-400 block">Tu Enlace de Difusión Provincial:</span>
          <div class="flex items-center gap-2">
            <input type="text" readonly value="${promoUrl}" id="input-promo-url" class="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-[#74ACDF] w-56 sm:w-64 outline-none">
            <button type="button" id="btn-copy-promo-url" class="px-3 py-1.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              Copiar
            </button>
          </div>
        </div>
      </div>

      <!-- Tarjetas de Métricas de Ventas y Comisiones -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Meta a Febrero -->
        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div class="flex justify-between text-xs font-mono text-slate-400">
            <span>META COMERCIAL FEBRERO</span>
            <span class="text-[#FFB000] font-bold">${stats.targetProgress}%</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black text-white font-mono">${stats.activeReferralsCount}</span>
            <span class="text-xs text-slate-400">/ ${stats.targetGoal} inscriptos</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-1">
            <div class="bg-gradient-to-r from-[#74ACDF] to-[#FFB000] h-full rounded-full" style="width: ${stats.targetProgress}%"></div>
          </div>
          <span class="text-[11px] text-slate-500 font-mono block">Faltan ${stats.missingForGoal} para el objetivo</span>
        </div>

        <!-- Facturación Zona -->
        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div class="flex justify-between text-xs font-mono text-slate-400">
            <span>FACTURACIÓN TOTAL ZONA</span>
            <span class="text-emerald-400 font-bold">Cobrado</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            ${formatARS(stats.totalSalesRevenue)}
          </div>
          <span class="text-[11px] text-slate-400 font-mono block">En cursos arancelados oficiales</span>
        </div>

        <!-- Comisión 30% Devengada -->
        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div class="flex justify-between text-xs font-mono text-slate-400">
            <span>COMISIÓN DEVENGADA (30%)</span>
            <span class="text-[#74ACDF] font-bold">Oficial</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
            ${formatARS(stats.commissionEarned)}
          </div>
          <span class="text-[11px] text-slate-400 font-mono block">Calculado sobre recaudación real</span>
        </div>

        <!-- Pendiente de Cobro -->
        <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div class="flex justify-between text-xs font-mono text-slate-400">
            <span>SALDO PENDIENTE LIQUIDACIÓN</span>
            <span class="text-[#FFB000] font-bold">Por Tesorería</span>
          </div>
          <div class="text-2xl sm:text-3xl font-black text-[#FFB000] font-mono mt-1">
            ${formatARS(stats.commissionPending)}
          </div>
          <span class="text-[11px] text-slate-400 font-mono block">Liquidado a la fecha: ${formatARS(stats.commissionPaid)}</span>
        </div>

      </div>

      <!-- Detalle de Alumnos Inscriptos en su Jurisdicción -->
      <div class="bg-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 class="text-lg font-bold text-white">Inscriptos Directos en ${coord.province}</h3>
          <p class="text-xs text-slate-400 mt-0.5">Seguimiento de alumnos captados mediante el código comercial ${coord.promoCode}.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr class="bg-[#24282C] border-b border-slate-700 font-mono text-[11px] text-slate-400 uppercase">
                <th class="p-3">Alumno</th>
                <th class="p-3">Localidad</th>
                <th class="p-3">Curso Inscripto</th>
                <th class="p-3">Arancel Bruto</th>
                <th class="p-3">Tu Comisión 30%</th>
                <th class="p-3">Estado de Pago</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-3">
                  <div class="font-bold text-white">Cristian Valenzuela</div>
                  <div class="text-[11px] text-slate-400 font-mono">DNI: 37.890.114</div>
                </td>
                <td class="p-3">Malargüe, Mendoza</td>
                <td class="p-3 font-semibold text-slate-200">Inducción HSE Vaca Muerta</td>
                <td class="p-3 font-mono font-bold">$320.000 ARS</td>
                <td class="p-3 font-mono font-bold text-emerald-400">$96.000 ARS</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                    Abonado / Confirmado
                  </span>
                </td>
              </tr>
              <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-3">
                  <div class="font-bold text-white">Franco Benítez</div>
                  <div class="text-[11px] text-slate-400 font-mono">DNI: 35.120.449</div>
                </td>
                <td class="p-3">Luján de Cuyo, Mendoza</td>
                <td class="p-3 font-semibold text-slate-200">Water Transfer Nivel 1 y 2</td>
                <td class="p-3 font-mono font-bold">$400.000 ARS</td>
                <td class="p-3 font-mono font-bold text-emerald-400">$120.000 ARS</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                    Abonado / Confirmado
                  </span>
                </td>
              </tr>
              <tr class="hover:bg-slate-800/40 transition-colors">
                <td class="p-3">
                  <div class="font-bold text-white">Alejandro Sosa</div>
                  <div class="text-[11px] text-slate-400 font-mono">DNI: 33.781.902</div>
                </td>
                <td class="p-3">San Juan Capital</td>
                <td class="p-3 font-semibold text-slate-200">Higiene y Seguridad en Hidrocarburos</td>
                <td class="p-3 font-mono font-bold">$320.000 ARS</td>
                <td class="p-3 font-mono font-bold text-emerald-400">$96.000 ARS</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded bg-amber-500/20 text-[#FFB000] text-[11px] font-mono font-bold">
                    Preinscripto (Pendiente Pago)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Herramientas de Difusión y Argumentario Comercial -->
        <div class="pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800 space-y-1">
            <span class="font-bold text-white block">Matrícula Profesional PA 446</span>
            <p class="text-slate-400">Respaldo técnico directo del Lic. Víctor Javier Paredes, garantizando validez ante operadoras.</p>
          </div>
          <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800 space-y-1">
            <span class="font-bold text-white block">Compatibilidad con Diagrama 14x14</span>
            <p class="text-slate-400">Clases asincrónicas grabadas y tutorías vespertinas adaptadas a los días de descanso.</p>
          </div>
          <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800 space-y-1">
            <span class="font-bold text-white block">Financiación en Cuotas</span>
            <p class="text-slate-400">Mercado Pago con tarjetas bancarias y facturación A o B deducible de ganancias.</p>
          </div>
        </div>

      </div>

    </div>
  `;
}

export function initCoordinatorEvents() {
  const btnCopy = document.getElementById('btn-copy-promo-url');
  const input = document.getElementById('input-promo-url');

  btnCopy?.addEventListener('click', () => {
    if (input) {
      copyToClipboard(input.value, 'Enlace de coordinador copiado al portapapeles');
    }
  });
}
