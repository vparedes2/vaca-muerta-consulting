/**
 * Vaca Muerta Consulting - Checkout Modal (Mercado Pago Dinámico)
 * Pasarela de pago oficial con política de reintegro post-capacitación:
 * - El arancel oficial del curso se abona al 100% al inicio.
 * - Todos los reintegros acumulados por referidos (20% c/u, 100% con 5, y +20% por cada colega extra)
 *   se devuelven a la cuenta del alumno una vez concluido el cursado.
 */

import { authService } from '../services/authService.js';
import { paymentService } from '../services/paymentService.js';
import { courseService } from '../services/courseService.js';
import { formatARS, showToast } from '../utils/formatters.js';

export function renderCheckoutModal() {
  return `
    <div id="checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        
        <!-- Cerrar Modal -->
        <button id="btn-close-checkout" class="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div id="checkout-view-form">
          <!-- Header de Mercado Pago -->
          <div class="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
            <div class="w-10 h-10 rounded-xl bg-[#009EE3]/20 border border-[#009EE3]/40 flex items-center justify-center text-[#009EE3] font-black text-sm">
              MP
            </div>
            <div>
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block leading-none">Pasarela de Pago Certificada</span>
              <h2 class="text-base font-extrabold text-white">Mercado Pago · Checkout Pro</h2>
            </div>
          </div>

          <!-- Resumen del Curso y Aranceles -->
          <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-5 space-y-4 mb-6">
            <div>
              <span class="text-[10px] font-mono font-bold text-[#74ACDF] block" id="checkout-course-code">VM-WT-301</span>
              <h3 class="text-base font-bold text-white" id="checkout-modal-course-title">Operador de Water Transfer Nivel 1 y 2</h3>
              <p class="text-xs text-slate-400 mt-1">Dirección Técnica: Lic. Víctor Javier Paredes (PA 446)</p>
            </div>

            <div class="pt-3 border-t border-slate-700 space-y-2 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-slate-400">Modalidad Arancelaria:</span>
                <span class="text-white">Pago del 100% de Matrícula</span>
              </div>
              
              <div class="flex justify-between text-[#FFB000]" id="checkout-discount-row">
                <span>Reintegro Acumulado a Devolver:</span>
                <span class="font-bold" id="checkout-refund-value">$160.000 ARS</span>
              </div>

              <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700/80">
                <span>Total a Abonar Ahora en Pasarela:</span>
                <span class="text-2xl font-black text-[#74ACDF] font-mono" id="checkout-total-price">$400.000 ARS</span>
              </div>
            </div>

            <div class="p-3 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs text-slate-300 space-y-1">
              <span class="text-white font-bold block flex items-center gap-1.5 text-[11px]">
                <svg class="w-4 h-4 text-[#74ACDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Política Oficial de Reintegro Post-Capacitación:
              </span>
              <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
                El arancel oficial se abona al ingresar. Todos los reintegros acumulados por tus colegas referidos (20% por colega, 100% con 5, y +20% extra por cada uno por sobre los 5) se transfieren a tu cuenta bancaria una vez finalizada la capacitación.
              </p>
            </div>
          </div>

          <!-- Métodos de Pago Disponibles en Mercado Pago -->
          <div class="space-y-3 mb-6">
            <label class="block text-xs font-mono font-bold uppercase text-slate-400">Seleccione Medio de Pago:</label>
            <div class="grid grid-cols-2 gap-3 text-xs">
              <label class="flex items-center gap-2 p-3 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer hover:border-[#74ACDF]">
                <input type="radio" name="mp-method" value="credit" checked class="text-[#74ACDF]">
                <span class="font-semibold text-white">Tarjeta Débito/Crédito</span>
              </label>
              <label class="flex items-center gap-2 p-3 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer hover:border-[#74ACDF]">
                <input type="radio" name="mp-method" value="wallet" class="text-[#74ACDF]">
                <span class="font-semibold text-white">Dinero en Cuenta MP</span>
              </label>
            </div>
          </div>

          <!-- Botón de Confirmación -->
          <button type="button" id="btn-process-payment" class="w-full py-3.5 bg-[#009EE3] hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-sky-950/40 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span id="btn-process-text">Abonar Arancel Oficial con Mercado Pago</span>
          </button>

          <p class="text-[11px] text-slate-500 text-center mt-3 font-mono">
            Transacción encriptada con estándar bancario PCI-DSS de Mercado Pago.
          </p>
        </div>

        <!-- Vista de Éxito / Comprobante de Pago Aprobado -->
        <div id="checkout-view-success" class="hidden text-center py-6 space-y-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black">
            ✓
          </div>
          <h3 class="text-xl font-black text-white">¡Matrícula Oficial Abonada!</h3>
          <p class="text-xs text-slate-300 max-w-sm mx-auto">
            El pago del 100% del arancel fue procesado exitosamente por Mercado Pago. Tu vacante está reservada y tu cuenta habilitada para acumular reintegros por referidos.
          </p>

          <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-4 text-left text-xs font-mono space-y-2 max-w-sm mx-auto">
            <div class="flex justify-between">
              <span class="text-slate-400">Comprobante ID:</span>
              <span class="text-white font-bold" id="receipt-id">PAY-981249</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Total Abonado:</span>
              <span class="text-emerald-400 font-bold" id="receipt-amount">$400.000 ARS</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Estado:</span>
              <span class="text-emerald-400 font-bold">Matrícula Confirmada</span>
            </div>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" id="btn-go-to-lms" class="px-6 py-3 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all">
              Ingresar al Reproductor LMS
            </button>
            <button type="button" id="btn-close-success" class="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all">
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

let activeCourseInModal = null;

export function openCheckoutModal(course) {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  activeCourseInModal = course;
  const user = authService.getCurrentUser() || { id: 'user-alumno01', name: 'Esteban Morales' };
  const details = paymentService.calculateCheckoutAmount(user.id, course);

  // Llenar campos
  document.getElementById('checkout-course-code').textContent = course.code;
  document.getElementById('checkout-modal-course-title').textContent = course.title;
  document.getElementById('checkout-total-price').textContent = formatARS(details.basePrice);
  document.getElementById('checkout-refund-value').textContent = `${formatARS(details.totalRefundPayout)} a devolver`;

  const btnProcessText = document.getElementById('btn-process-text');
  btnProcessText.textContent = `Abonar ${formatARS(details.basePrice)} con Mercado Pago`;

  // Reset vistas
  document.getElementById('checkout-view-form').classList.remove('hidden');
  document.getElementById('checkout-view-success').classList.add('hidden');

  modal.classList.remove('hidden');
}

export function initCheckoutModalEvents(onPaymentComplete) {
  const modal = document.getElementById('checkout-modal');
  const btnClose = document.getElementById('btn-close-checkout');
  const btnCloseSuccess = document.getElementById('btn-close-success');
  const btnProcess = document.getElementById('btn-process-payment');
  const btnGoToLMS = document.getElementById('btn-go-to-lms');

  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  btnCloseSuccess?.addEventListener('click', () => modal.classList.add('hidden'));

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  btnProcess?.addEventListener('click', () => {
    if (!activeCourseInModal) return;

    const user = authService.getCurrentUser() || { id: 'user-alumno01', name: 'Esteban Morales' };
    const details = paymentService.calculateCheckoutAmount(user.id, activeCourseInModal);

    btnProcess.disabled = true;
    btnProcess.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Conectando con Mercado Pago...
    `;

    setTimeout(() => {
      const paymentRecord = paymentService.recordPayment(user.id, activeCourseInModal.id, details.basePrice, 'Mercado Pago');
      courseService.enrollStudent(user.id, activeCourseInModal.id);

      // Mostrar comprobante
      document.getElementById('checkout-view-form').classList.add('hidden');
      document.getElementById('checkout-view-success').classList.remove('hidden');
      document.getElementById('receipt-id').textContent = paymentRecord.id;
      document.getElementById('receipt-amount').textContent = formatARS(paymentRecord.amount);

      btnProcess.disabled = false;
      showToast('¡Matrícula abonada con éxito en Mercado Pago!', 'success');

      if (onPaymentComplete) {
        onPaymentComplete(activeCourseInModal);
      }
    }, 1200);
  });

  btnGoToLMS?.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (activeCourseInModal) {
      window.location.hash = `#/lms/${activeCourseInModal.id}`;
    }
  });
}
