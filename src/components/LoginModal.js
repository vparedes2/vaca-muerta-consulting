/**
 * Vaca Muerta Consulting - Login Modal
 * Control de acceso RBAC con credenciales de prueba preconfiguradas en 1 clic.
 */

import { authService } from '../services/authService.js';
import { showToast } from '../utils/formatters.js';

export function renderLoginModal() {
  return `
    <div id="login-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        <!-- Cerrar Modal -->
        <button id="btn-close-login" class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-[#74ACDF] to-sky-700 items-center justify-center font-black text-slate-950 text-xl mb-3 shadow-lg shadow-sky-950/60">
            VM
          </div>
          <h2 class="text-xl font-extrabold text-white">Acceso a la Plataforma</h2>
          <p class="text-xs text-slate-400 mt-1 font-mono">Control de Acceso Basado en Roles (RBAC)</p>
        </div>

        <!-- Botones de Acceso Rápido de Prueba (1 Clic) -->
        <div class="mb-6 bg-[#24282C] border border-slate-800 rounded-xl p-3">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
            Perfiles de Prueba Rápidos (1 Clic)
          </span>
          <div class="grid grid-cols-3 gap-2">
            <button type="button" data-fill="admin" class="btn-quick-fill px-2 py-2 bg-slate-800 hover:bg-[#FFB000]/20 hover:border-[#FFB000]/50 border border-slate-700 rounded-lg text-center transition-all group">
              <span class="block text-[11px] font-bold text-[#FFB000]">Admin</span>
              <span class="block text-[9px] text-slate-400 font-mono">vparedes</span>
            </button>
            <button type="button" data-fill="coord" class="btn-quick-fill px-2 py-2 bg-slate-800 hover:bg-[#74ACDF]/20 hover:border-[#74ACDF]/50 border border-slate-700 rounded-lg text-center transition-all group">
              <span class="block text-[11px] font-bold text-[#74ACDF]">Coordinador</span>
              <span class="block text-[9px] text-slate-400 font-mono">coord.cuyo</span>
            </button>
            <button type="button" data-fill="alumno" class="btn-quick-fill px-2 py-2 bg-slate-800 hover:bg-emerald-500/20 hover:border-emerald-500/50 border border-slate-700 rounded-lg text-center transition-all group">
              <span class="block text-[11px] font-bold text-emerald-400">Alumno</span>
              <span class="block text-[9px] text-slate-400 font-mono">alumno01</span>
            </button>
          </div>
        </div>

        <!-- Formulario -->
        <form id="form-login" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Usuario o Identificador</label>
            <input type="text" id="login-username" required placeholder="Ej: vparedes o alumno01" class="w-full px-3 py-2.5 bg-[#24282C] border border-slate-700 focus:border-[#74ACDF] focus:ring-1 focus:ring-[#74ACDF] rounded-lg text-sm text-white placeholder-slate-500 outline-none transition-all font-mono">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
            <input type="password" id="login-password" required placeholder="••••••••" class="w-full px-3 py-2.5 bg-[#24282C] border border-slate-700 focus:border-[#74ACDF] focus:ring-1 focus:ring-[#74ACDF] rounded-lg text-sm text-white placeholder-slate-500 outline-none transition-all font-mono">
          </div>

          <div id="login-error" class="hidden text-xs text-rose-400 bg-rose-950/50 border border-rose-900 px-3 py-2 rounded-lg"></div>

          <button type="submit" class="w-full py-2.5 px-4 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-lg shadow-lg shadow-sky-950/40 transition-all transform hover:-translate-y-0.5">
            Ingresar al Campus
          </button>
        </form>

        <div class="mt-4 text-center">
          <p class="text-[11px] text-slate-500">
            Dirección Técnica: <span class="text-slate-400 font-semibold">Lic. Víctor Javier Paredes (PA 446)</span>
          </p>
        </div>

      </div>
    </div>
  `;
}

export function initLoginModalEvents(onLoginSuccess) {
  const modal = document.getElementById('login-modal');
  const btnClose = document.getElementById('btn-close-login');
  const form = document.getElementById('form-login');
  const errorBox = document.getElementById('login-error');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  if (!modal) return;

  // Cerrar al hacer clic en fondo o cruz
  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Botones de llenado rápido de prueba
  document.querySelectorAll('.btn-quick-fill').forEach(btn => {
    btn.addEventListener('click', () => {
      const fillType = btn.getAttribute('data-fill');
      if (fillType === 'admin') {
        usernameInput.value = 'vparedes';
        passwordInput.value = 'admin2026';
      } else if (fillType === 'coord') {
        usernameInput.value = 'coord.cuyo';
        passwordInput.value = 'cuyo2026';
      } else if (fillType === 'alumno') {
        usernameInput.value = 'alumno01';
        passwordInput.value = 'seguridad123';
      }
      errorBox.classList.add('hidden');
    });
  });

  // Submit login
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const res = authService.login(username, password);
    if (res.success) {
      showToast(`¡Bienvenido, ${res.user.name}!`, 'success');
      modal.classList.add('hidden');
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      errorBox.textContent = res.message;
      errorBox.classList.remove('hidden');
    }
  });
}
