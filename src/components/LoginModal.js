/**
 * Vaca Muerta Consulting - Login Modal
 * Formulario de autenticación limpio y seguro, sin datos de ingreso visibles.
 */

import { authService } from '../services/authService.js';
import { renderBrandLogo } from './BrandLogo.js';
import { showToast } from '../utils/formatters.js';

export function renderLoginModal() {
  return `
    <div id="login-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        <!-- Cerrar Modal -->
        <button id="btn-close-login" class="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <!-- Header Institucional -->
        <div class="flex flex-col items-center text-center mb-6 pt-2">
          ${renderBrandLogo({ layout: 'vertical', size: 'md', withDirector: true })}
          <div class="mt-4 border-t border-slate-800 pt-3 w-full">
            <h2 class="text-base font-bold text-white font-display">Ingreso al Sistema</h2>
            <p class="text-xs text-slate-400 mt-0.5">Acceso para Dirección, Coordinadores y Alumnos</p>
          </div>
        </div>

        <!-- Formulario Limpio -->
        <form id="form-login" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Usuario o Correo Electrónico</label>
            <input type="text" id="login-username" required placeholder="Ingrese su usuario o email" autocomplete="username" class="w-full px-3.5 py-2.5 bg-[#24282C] border border-slate-700 focus:border-[#74ACDF] focus:ring-1 focus:ring-[#74ACDF] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all">
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Contraseña</label>
            <input type="password" id="login-password" required placeholder="••••••••••••" autocomplete="current-password" class="w-full px-3.5 py-2.5 bg-[#24282C] border border-slate-700 focus:border-[#74ACDF] focus:ring-1 focus:ring-[#74ACDF] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all">
          </div>

          <div id="login-error" class="hidden text-xs text-rose-300 bg-rose-950/60 border border-rose-900 px-3.5 py-2.5 rounded-xl font-mono"></div>

          <button type="submit" class="w-full py-3 px-4 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-sky-950/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
            Ingresar al Sistema
          </button>
        </form>

        <div class="mt-6 text-center pt-4 border-t border-slate-800/80">
          <p class="text-[11px] text-slate-500 font-mono">
            Vaca Muerta Consulting · Plataforma Upstream &amp; Supervisión Operativa
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

  // Submit login
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    const res = authService.login(username, password);
    if (res.success) {
      showToast(`¡Bienvenido, ${res.user.name}!`, 'success');
      modal.classList.add('hidden');
      form.reset();
      errorBox.classList.add('hidden');
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      errorBox.textContent = res.message || 'Usuario o contraseña incorrectos.';
      errorBox.classList.remove('hidden');
    }
  });
}
