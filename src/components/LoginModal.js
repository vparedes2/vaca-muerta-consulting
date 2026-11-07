/**
 * Vaca Muerta Consulting - Login Modal
 * Ingreso con Google o con email y contraseña (Supabase Auth), recuperación de contraseña
 * y formulario para crear una contraseña nueva al volver desde el mail.
 */

import { authService } from '../services/authService.js';
import { renderBrandLogo } from './BrandLogo.js';
import { showToast } from '../utils/formatters.js';

const GOOGLE_ICON = `
  <svg class="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
  </svg>`;

const inputClass = 'w-full px-3.5 py-2.5 bg-[#24282C] border border-slate-700 focus:border-[#74ACDF] focus:ring-1 focus:ring-[#74ACDF] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all';

export function renderLoginModal() {
  return `
    <div id="login-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[92vh] overflow-y-auto">

        <button id="btn-close-login" class="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800" title="Cerrar">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div class="flex flex-col items-center text-center mb-6 pt-2">
          ${renderBrandLogo({ layout: 'vertical', size: 'md', withDirector: true })}
          <div class="mt-4 border-t border-slate-800 pt-3 w-full">
            <h2 class="text-base font-bold text-white font-display">Ingreso al Sistema</h2>
            <p class="text-xs text-slate-400 mt-0.5">Acceso para Dirección Técnica y alumnos</p>
          </div>
        </div>

        <button type="button" id="btn-login-google" class="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5">
          ${GOOGLE_ICON}
          Ingresar con Google
        </button>

        <div class="flex items-center gap-3 my-5 text-[11px] font-mono text-slate-500">
          <span class="flex-1 h-px bg-slate-800"></span>
          o con tu email
          <span class="flex-1 h-px bg-slate-800"></span>
        </div>

        <form id="form-login" class="space-y-4">
          <div>
            <label for="login-username" class="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Email o usuario</label>
            <input type="text" id="login-username" required placeholder="tu@email.com" autocomplete="username" class="${inputClass}">
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="login-password" class="block text-xs font-semibold text-slate-300 font-mono">Contraseña</label>
              <button type="button" id="btn-forgot-password" class="text-[11px] text-[#74ACDF] hover:text-sky-300 hover:underline">¿Olvidaste tu contraseña?</button>
            </div>
            <input type="password" id="login-password" required placeholder="••••••••••••" autocomplete="current-password" class="${inputClass}">
          </div>

          <div id="login-error" class="hidden text-xs text-rose-300 bg-rose-950/60 border border-rose-900 px-3.5 py-2.5 rounded-xl"></div>
          <div id="login-info" class="hidden text-xs text-emerald-200 bg-emerald-950/50 border border-emerald-900 px-3.5 py-2.5 rounded-xl"></div>

          <button type="submit" class="w-full py-3 px-4 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-sky-950/50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
            Ingresar
          </button>
          <p class="text-[11px] text-slate-500 text-center">Tu sesión queda iniciada en este navegador hasta que toques "Salir".</p>
        </form>

        <div class="mt-6 text-center pt-4 border-t border-slate-800/80">
          <p class="text-[11px] text-slate-500 font-mono">Vaca Muerta Consulting · Campus virtual</p>
        </div>

      </div>
    </div>

    <div id="password-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md hidden animate-fadeIn">
      <div class="bg-[#1B1F23] border border-slate-700 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        <h2 class="text-lg font-bold text-white font-display">Creá tu contraseña nueva</h2>
        <p class="text-xs text-slate-400 mt-1 mb-5">Usá al menos 8 caracteres, combinando letras y números.</p>
        <form id="form-new-password" class="space-y-4">
          <div>
            <label for="new-password" class="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Contraseña nueva</label>
            <input type="password" id="new-password" required minlength="8" autocomplete="new-password" class="${inputClass}">
          </div>
          <div>
            <label for="new-password-2" class="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">Repetila</label>
            <input type="password" id="new-password-2" required minlength="8" autocomplete="new-password" class="${inputClass}">
          </div>
          <div id="new-password-error" class="hidden text-xs text-rose-300 bg-rose-950/60 border border-rose-900 px-3.5 py-2.5 rounded-xl"></div>
          <button type="submit" class="w-full py-3 px-4 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-black text-sm rounded-xl transition-all">Guardar contraseña</button>
        </form>
      </div>
    </div>
  `;
}

export function openPasswordModal() {
  document.getElementById('password-modal')?.classList.remove('hidden');
  document.getElementById('new-password')?.focus();
}

export function initLoginModalEvents(onLoginSuccess) {
  const modal = document.getElementById('login-modal');
  const btnClose = document.getElementById('btn-close-login');
  const form = document.getElementById('form-login');
  const errorBox = document.getElementById('login-error');
  const infoBox = document.getElementById('login-info');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');

  if (!modal) return;

  const showError = (msg) => {
    infoBox.classList.add('hidden');
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  };
  const showInfo = (msg) => {
    errorBox.classList.add('hidden');
    infoBox.textContent = msg;
    infoBox.classList.remove('hidden');
  };

  btnClose?.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Google
  const btnGoogle = document.getElementById('btn-login-google');
  btnGoogle?.addEventListener('click', async () => {
    btnGoogle.disabled = true;
    const res = await authService.loginWithGoogle();
    if (!res.success) {
      btnGoogle.disabled = false;
      showError(res.message);
    }
    // Si sale bien, el navegador va a Google y vuelve al sitio.
  });

  // Olvidé mi contraseña
  document.getElementById('btn-forgot-password')?.addEventListener('click', async () => {
    const email = usernameInput.value.trim();
    if (!email.includes('@')) {
      showError('Escribí tu email arriba y volvé a tocar "¿Olvidaste tu contraseña?".');
      usernameInput.focus();
      return;
    }
    const res = await authService.sendPasswordReset(email);
    if (res.success) {
      showInfo(`Te enviamos un mail a ${email} con un enlace para crear una contraseña nueva. Abrilo en este mismo navegador. Si no lo ves, revisá spam.`);
    } else {
      showError(res.message);
    }
  });

  // Email y contraseña
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const res = username.includes('@')
      ? await authService.loginWithEmail(username, password)
      : authService.login(username, password);

    if (submitBtn) submitBtn.disabled = false;
    if (res.success) {
      showToast(`¡Bienvenido, ${res.user.name}!`, 'success');
      modal.classList.add('hidden');
      form.reset();
      errorBox.classList.add('hidden');
      infoBox.classList.add('hidden');
      if (onLoginSuccess) onLoginSuccess(res.user);
    } else {
      showError(res.message || 'Usuario o contraseña incorrectos.');
    }
  });

  // Contraseña nueva (al volver del mail)
  const pwModal = document.getElementById('password-modal');
  const pwForm = document.getElementById('form-new-password');
  const pwError = document.getElementById('new-password-error');
  pwForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const p1 = document.getElementById('new-password').value;
    const p2 = document.getElementById('new-password-2').value;
    if (p1 !== p2) {
      pwError.textContent = 'Las contraseñas no coinciden.';
      pwError.classList.remove('hidden');
      return;
    }
    const res = await authService.updatePassword(p1);
    if (res.success) {
      pwModal.classList.add('hidden');
      pwForm.reset();
      showToast('Contraseña actualizada. Ya podés usarla para ingresar.', 'success');
      if (authService.isAdmin()) window.location.hash = '#/admin';
    } else {
      pwError.textContent = res.message;
      pwError.classList.remove('hidden');
    }
  });
}
