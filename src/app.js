/**
 * Vaca Muerta Consulting - SPA Router & App Controller
 * Orquestador principal de la Single Page Application:
 * - Enrutamiento basado en hash (#/home, #/catalogo, #/admin, #/coordinador, #/campus, #/lms/:id)
 * - Control de acceso por roles (RBAC) con guardias de navegación
 * - Inyección y ciclo de vida de componentes
 */

import { authService } from './services/authService.js';
import { renderNavbar } from './components/Navbar.js';
import { renderHomeView, initHomeEvents } from './components/HomeView.js';
import { renderCatalogView, initCatalogEvents } from './components/CatalogView.js';
import { renderLoginModal, initLoginModalEvents } from './components/LoginModal.js';
import { renderAdminDashboard, initAdminEvents } from './components/AdminDashboard.js';
import { renderCoordinatorView, initCoordinatorEvents } from './components/CoordinatorView.js';
import { renderStudentPortal, initStudentPortalEvents } from './components/StudentPortal.js';
import { renderLMSPlayer, initLMSEvents } from './components/LMSPlayer.js';
import { renderCheckoutModal, openCheckoutModal, initCheckoutModalEvents } from './components/CheckoutModal.js';
import { showToast } from './utils/formatters.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app-root');
    this.init();
  }

  init() {
    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => this.handleRoute());

    // Escuchar cambios de sesión
    authService.subscribe((user) => {
      this.renderHeader();
      this.handleRoute();
    });

    // Renderizar estructura base
    this.renderBaseLayout();

    // Enrutar por primera vez
    this.handleRoute();
  }

  renderBaseLayout() {
    this.appContainer.innerHTML = `
      <div id="navbar-container"></div>
      <main id="app-content" class="min-h-[calc(100vh-160px)]"></main>
      <footer id="footer-container" class="bg-[#1B1F23] border-t border-slate-800 py-10 text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#74ACDF] to-sky-700 flex items-center justify-center font-bold text-slate-950 text-sm">
              VM
            </div>
            <div>
              <span class="font-bold text-white block">Vaca Muerta Consulting</span>
              <span class="font-mono text-[11px] text-slate-500">Dirección Técnica: Lic. Víctor Javier Paredes · Mat. Profesional PA 446</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-6 font-mono text-[11px]">
            <a href="#/home" class="hover:text-white transition-colors">Inicio</a>
            <a href="#/catalogo" class="hover:text-white transition-colors">Catálogo Oficial</a>
            <a href="#/campus" class="hover:text-white transition-colors">Campus Virtual</a>
            <span class="text-slate-600">|</span>
            <span class="text-[#FFB000]">Cuenca Neuquina · Argentina</span>
          </div>
        </div>
      </footer>
      <div id="modals-container">
        ${renderLoginModal()}
        ${renderCheckoutModal()}
      </div>
      <div id="toast-container"></div>
    `;

    this.renderHeader();
    this.initModals();
  }

  renderHeader() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    navbarContainer.innerHTML = renderNavbar();

    // Eventos del Navbar
    document.getElementById('btn-open-login')?.addEventListener('click', () => {
      const modal = document.getElementById('login-modal');
      modal?.classList.remove('hidden');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      authService.logout();
      showToast('Sesión cerrada correctamente.', 'info');
      window.location.hash = '#/home';
    });
  }

  initModals() {
    initLoginModalEvents((user) => {
      // Redirigir según rol tras login
      if (user.role === 'admin') {
        window.location.hash = '#/admin';
      } else if (user.role === 'coordinator') {
        window.location.hash = '#/coordinador';
      } else {
        window.location.hash = '#/campus';
      }
    });

    initCheckoutModalEvents((course) => {
      // Callback tras pago completado
      this.handleRoute();
    });
  }

  handleRoute() {
    const hash = window.location.hash || '#/home';
    const content = document.getElementById('app-content');
    if (!content) return;

    // Actualizar navbar para estados activos
    this.renderHeader();

    // RUTA 1: Inicio
    if (hash === '#/' || hash === '#/home') {
      content.innerHTML = renderHomeView();
      initHomeEvents();
      return;
    }

    // RUTA 2: Catálogo Oficial
    if (hash.startsWith('#/catalogo')) {
      content.innerHTML = renderCatalogView();
      initCatalogEvents((course) => openCheckoutModal(course));
      return;
    }

    // RUTA 3: Panel Admin (Dirección Técnica - RBAC Guard)
    if (hash === '#/admin') {
      const user = authService.getCurrentUser();
      if (!user || user.role !== 'admin') {
        showToast('Acceso restringido a Dirección Técnica (vparedes)', 'warning');
        document.getElementById('login-modal')?.classList.remove('hidden');
        window.location.hash = '#/home';
        return;
      }
      content.innerHTML = renderAdminDashboard();
      initAdminEvents();
      return;
    }

    // RUTA 4: Panel Coordinador Provincial (RBAC Guard)
    if (hash === '#/coordinador') {
      const user = authService.getCurrentUser();
      if (!user || (user.role !== 'coordinator' && user.role !== 'admin')) {
        showToast('Acceso restringido a Coordinadores Provinciales', 'warning');
        document.getElementById('login-modal')?.classList.remove('hidden');
        window.location.hash = '#/home';
        return;
      }
      content.innerHTML = renderCoordinatorView();
      initCoordinatorEvents();
      return;
    }

    // RUTA 5: Portal del Alumno (Campus & Referidos - RBAC Guard)
    if (hash === '#/campus') {
      const user = authService.getCurrentUser();
      if (!user) {
        showToast('Inicie sesión para acceder a su campus virtual', 'info');
        document.getElementById('login-modal')?.classList.remove('hidden');
        window.location.hash = '#/home';
        return;
      }
      content.innerHTML = renderStudentPortal();
      initStudentPortalEvents((course) => openCheckoutModal(course));
      return;
    }

    // RUTA 6: Reproductor LMS (/lms/:courseId o /lms/:courseId/:lessonId)
    if (hash.startsWith('#/lms/')) {
      const parts = hash.replace('#/lms/', '').split('/');
      const courseId = parts[0] || 'water-transfer-1-2';
      const lessonId = parts[1] || null;

      content.innerHTML = renderLMSPlayer(courseId, lessonId);
      initLMSEvents(courseId, (cId, lId) => {
        window.location.hash = `#/lms/${cId}/${lId}`;
      });
      return;
    }

    // Fallback 404
    content.innerHTML = `
      <div class="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 class="text-4xl font-black text-white">404</h2>
        <p class="text-sm text-slate-400">Página o lección no encontrada.</p>
        <a href="#/home" class="inline-block px-5 py-2.5 bg-[#74ACDF] text-slate-950 font-bold text-xs rounded-xl">
          Volver al Inicio
        </a>
      </div>
    `;
  }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
