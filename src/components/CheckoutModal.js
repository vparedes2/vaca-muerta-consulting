/**
 * Vaca Muerta Consulting - Modal de Inscripción
 * La inscripción y el pago se coordinan por WhatsApp con la Dirección Técnica.
 * El modal arma un mensaje prellenado con el curso, los datos del interesado
 * y, si llegó por recomendación, el código de quien lo recomendó.
 */

import { authService } from '../services/authService.js';
import { formatPrice, whatsappLink, CONTACT } from '../utils/formatters.js';

function getReferralCodeFromUrl() {
  const hash = window.location.hash || '';
  const query = hash.includes('?') ? hash.split('?')[1] : '';
  const params = new URLSearchParams(query);
  const ref = params.get('ref');
  if (ref) {
    try { window.sessionStorage.setItem('vmc_ref', ref); } catch (e) { /* sin almacenamiento */ }
    return ref;
  }
  try { return window.sessionStorage.getItem('vmc_ref') || ''; } catch (e) { return ''; }
}

export function renderCheckoutModal() {
  return `
    <div id="checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">

        <button id="btn-close-checkout" class="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors" aria-label="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="pb-4 border-b border-slate-800 mb-6">
          <span class="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Solicitud de inscripción</span>
          <h2 class="text-lg font-extrabold text-white" id="checkout-modal-course-title">Curso</h2>
          <span class="text-[11px] font-mono text-[#74ACDF]" id="checkout-course-code"></span>
        </div>

        <div class="bg-[#24282C] border border-slate-800 rounded-2xl p-4 mb-6 space-y-2 text-xs font-mono">
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Duración:</span>
            <span class="text-white text-right" id="checkout-duration"></span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Arancel:</span>
            <span class="text-white font-bold" id="checkout-total-price"></span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-400">Certificado:</span>
            <span class="text-white text-right">Con verificación QR</span>
          </div>
        </div>

        <form id="enroll-form" class="space-y-4">
          <div>
            <label for="enroll-name" class="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">Nombre y apellido</label>
            <input id="enroll-name" type="text" required autocomplete="name" class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-[#74ACDF]">
          </div>
          <div>
            <label for="enroll-location" class="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">Ciudad y provincia</label>
            <input id="enroll-location" type="text" required autocomplete="address-level2" class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-[#74ACDF]">
          </div>
          <div>
            <label for="enroll-ref" class="block text-xs font-mono font-bold uppercase text-slate-400 mb-1.5">Código de quien te recomendó <span class="normal-case font-normal text-slate-500">(opcional)</span></label>
            <input id="enroll-ref" type="text" class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white outline-none focus:border-[#74ACDF]">
          </div>

          <button type="submit" id="btn-process-payment" class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2z"/></svg>
            Continuar por WhatsApp
          </button>
          <p class="text-[11px] text-slate-500 text-center leading-relaxed">
            Te abrimos WhatsApp con un mensaje listo para enviar a la Dirección Técnica (${CONTACT.whatsappDisplay}).
            Ahí coordinamos fecha de inicio, arancel y medios de pago.
          </p>
        </form>

      </div>
    </div>
  `;
}

let activeCourseInModal = null;

export function openCheckoutModal(course) {
  const modal = document.getElementById('checkout-modal');
  if (!modal || !course) return;

  activeCourseInModal = course;
  const user = authService.getCurrentUser();

  document.getElementById('checkout-course-code').textContent = course.code || '';
  document.getElementById('checkout-modal-course-title').textContent = course.title;
  document.getElementById('checkout-duration').textContent = course.duration || '';
  document.getElementById('checkout-total-price').textContent = formatPrice(course.basePrice);

  const nameInput = document.getElementById('enroll-name');
  const refInput = document.getElementById('enroll-ref');
  if (nameInput && user && user.role === 'student' && !nameInput.value) nameInput.value = user.name || '';
  if (refInput && !refInput.value) refInput.value = getReferralCodeFromUrl();

  modal.classList.remove('hidden');
}

export function initCheckoutModalEvents() {
  const modal = document.getElementById('checkout-modal');
  const btnClose = document.getElementById('btn-close-checkout');
  const form = document.getElementById('enroll-form');

  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!activeCourseInModal) return;

    const name = document.getElementById('enroll-name').value.trim();
    const location = document.getElementById('enroll-location').value.trim();
    const ref = document.getElementById('enroll-ref').value.trim();

    const lines = [
      `Hola, quiero inscribirme en el curso "${activeCourseInModal.title}" (${activeCourseInModal.code}).`,
      `Nombre: ${name}`,
      `Ciudad y provincia: ${location}`
    ];
    if (ref) lines.push(`Me recomendó: ${ref}`);
    lines.push('¿Me pasan fechas, arancel y medios de pago?');

    window.open(whatsappLink(lines.join('\n')), '_blank', 'noopener');
    modal.classList.add('hidden');
  });
}
