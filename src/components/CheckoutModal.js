/**
 * Vaca Muerta Consulting - Checkout Modal (Mercado Pago Dinámico)
 * Pasarela de pago oficial con recálculo dinámico de arancel según referidos (20% c/u / 100% con 5),
 * simulación de cobro seguro y emisión de comprobante de matrícula.
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
                <span class="text-slate-400">Arancel Oficial del Curso:</span>
                <span class="text-white font-bold" id="checkout-base-price">$400.000 ARS</span>
              </div>
              
              <div class="flex justify-between text-emerald-400" id="checkout-discount-row">
                <span>Bonificación por Referidos (<span id="checkout-discount-rate">40%</span>):</span>
                <span class="font-bold" id="checkout-discount-value">-$160.000 ARS</span>
              </div>

              <div class="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700/80">
                <span>Total Final a Abonar:</span>
                <span class="text-2xl font-black text-[#74ACDF] font-mono" id="checkout-total-price">$240.000 ARS</span>
              </div>
            </div>

            <div id="checkout-bonified-alert" class="hidden p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300">
              ★ <strong>100% Bonificado:</strong> ¡Felicitaciones! Has alcanzado 5 colegas inscriptos. Tu curso no tiene costo arancelario y se activará la orden de reintegro garantizado.
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
            <span id="btn-process-text">Confirmar y Abonar con Mercado Pago</span>
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
          <h3 class="text-xl font-black text-white">¡Inscripción Confirmada!</h3>
          <p class="text-xs text-slate-300 max-w-sm mx-auto">
            El pago fue procesado exitosamente por Mercado Pago. Se emitió el comprobante digital y tienes acceso habilitado al campus virtual.
          </p>

          <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-4 text-left text-xs font-mono space-y-2 max-w-sm mx-auto">
            <div class="flex justify-between">
              <span class="text-slate-400">Comprobante ID:</span>
              <span class="text-white font-bold" id="receipt-id">PAY-981249</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Total Facturado:</span>
              <span class="text-emerald-400 font-bold" id="receipt-amount">$240.000 ARS</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Estado:</span>
              <span class="text-emerald-400 font-bold">Acreditación Inmediata</span>
            </div>
          </div>

          <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" id="btn-go-to-lms" class="px-6 py-3 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all">
              Ingresar Directo al Reproductor LMS
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
  document.getElementById('checkout-base-price').textContent = formatARS(details.basePrice);
  document.getElementById('checkout-discount-rate').textContent = `${details.discountPercent}%`;
  document.getElementById('checkout-discount-value').textContent = `-${formatARS(details.discountAmount)}`;
  document.getElementById('checkout-total-price').textContent = formatARS(details.finalAmount);

  const bonifiedAlert = document.getElementById('checkout-bonified-alert');
  const btnProcessText = document.getElementById('btn-process-text');

  if (details.isFullyBonified) {
    bonifiedAlert.classList.remove('hidden');
    btnProcessText.textContent = 'Confirmar Inscripción 100% Bonificada ($0)';
  } else {
    bonifiedAlert.classList.add('hidden');
    btnProcessText.textContent = `Abonar ${formatARS(details.finalAmount)} con Mercado Pago`;
  }

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
      const paymentRecord = paymentService.recordPayment(user.id, activeCourseInModal.id, details.finalAmount, 'Mercado Pago');
      courseService.enrollStudent(user.id, activeCourseInModal.id);

      // Mostrar comprobante
      document.getElementById('checkout-view-form').classList.add('hidden');
      document.getElementById('checkout-view-success').classList.remove('hidden');
      document.getElementById('receipt-id').textContent = paymentRecord.id;
      document.getElementById('receipt-amount').textContent = formatARS(paymentRecord.amount);

      btnProcess.disabled = false;
      showToast('¡Pago aprobado por Mercado Pago!', 'success');

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
