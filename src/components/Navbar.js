/**
 * Vaca Muerta Consulting - Componente Navbar
 * Barra superior institucional con roles, estado de sesión y acceso directo al campus.
 */

import { authService } from '../services/authService.js';
import { renderBrandLogo } from './BrandLogo.js';

export function renderNavbar() {
  const user = authService.getCurrentUser();
  const currentHash = window.location.hash || '#/home';

  let roleBadge = '';
  let roleMenu = '';

  if (user) {
    if (user.role === 'admin') {
      roleBadge = `<span class="px-2 py-0.5 text-xs font-semibold rounded bg-[#FFB000]/20 text-[#FFB000] border border-[#FFB000]/30 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-[#FFB000] animate-pulse"></span>
        Dirección Técnica
      </span>`;
      roleMenu = `<a href="#/admin" class="nav-link ${currentHash === '#/admin' ? 'active' : ''}">Panel Admin</a>`;
    } else if (user.role === 'coordinator') {
      roleBadge = `<span class="px-2 py-0.5 text-xs font-semibold rounded bg-[#74ACDF]/20 text-[#74ACDF] border border-[#74ACDF]/30 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-[#74ACDF] animate-pulse"></span>
        Coordinador ${user.zone || 'Provincial'}
      </span>`;
      roleMenu = `<a href="#/coordinador" class="nav-link ${currentHash === '#/coordinador' ? 'active' : ''}">Panel Comercial</a>`;
    } else if (user.role === 'student') {
      roleBadge = `<span class="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Alumno Activo
      </span>`;
      roleMenu = `<a href="#/campus" class="nav-link ${currentHash === '#/campus' ? 'active' : ''}">Mi Campus & Referidos</a>`;
    }
  }

  return `
    <header class="sticky top-0 z-40 bg-[#1B1F23]/95 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          
          <!-- Logo & Credencial Oficial -->
          <div class="flex items-center gap-3">
            <a href="#/home" class="flex items-center">
              ${renderBrandLogo({ layout: 'horizontal', size: 'md', withDirector: true })}
            </a>
            ${roleBadge}
          </div>

          <!-- Navegación Principal -->
          <nav class="hidden md:flex items-center gap-1 lg:gap-2">
            <a href="#/home" class="nav-link ${currentHash === '#/home' ? 'active' : ''}">Inicio</a>
            <a href="#/catalogo" class="nav-link ${currentHash === '#/catalogo' ? 'active' : ''}">Catálogo Oficial</a>
            ${roleMenu}
          </nav>

          <!-- Acciones de Usuario -->
          <div class="flex items-center gap-3">
            ${user ? `
              <div class="hidden sm:flex flex-col text-right">
                <span class="text-xs font-semibold text-white leading-tight">${user.name}</span>
                <span class="text-[11px] text-slate-400 font-mono">${user.email}</span>
              </div>
              <button id="btn-logout" class="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5" title="Cerrar Sesión">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span class="hidden sm:inline">Salir</span>
              </button>
            ` : `
              <button id="btn-open-login" class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-[#74ACDF] hover:bg-sky-400 rounded-lg shadow-md shadow-sky-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                Ingreso al Sistema
              </button>
            `}
          </div>

        </div>
      </div>
    </header>
  `;
}
