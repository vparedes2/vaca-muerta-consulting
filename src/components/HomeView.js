/**
 * Vaca Muerta Consulting - Home View (Landing Page Institucional)
 * Estética de "Grafito Técnico" industrial con dirección técnica oficial, calculadora de referidos y catálogo.
 */

import { courseService } from '../services/courseService.js';
import { formatARS } from '../utils/formatters.js';

export function renderHomeView() {
  const courses = courseService.getAll();

  return `
    <div class="space-y-16 pb-20">
      
      <!-- HERO INDUSTRIAL -->
      <section class="relative overflow-hidden pt-12 pb-20 border-b border-slate-800 bg-gradient-to-b from-[#1B1F23] to-[#24282C]">
        <div class="absolute inset-0 bg-[radial-gradient(#74ACDF_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div class="lg:col-span-7 space-y-6">
              
              <!-- Badge Institucional -->
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-[#74ACDF]">
                <span class="w-2 h-2 rounded-full bg-[#FFB000] animate-ping"></span>
                <span>Cuenca Neuquina · Formación Profesional Upstream</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Supervisión Operativa &amp; Excelencia en <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#74ACDF] via-sky-300 to-amber-300">Vaca Muerta</span>
              </h1>

              <p class="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Plataforma pedagógica de alto estándar para la industria de hidrocarburos. Formación intensiva en 
                <strong>HSE, Water Transfer Nivel 1 y 2, y Modernización Digital</strong>, diseñada para liderar cuadrillas 
                en régimen 14x14 y operaciones simultáneas de fractura hidráulica.
              </p>

              <!-- Botones de Acción -->
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <a href="#/catalogo" class="px-6 py-3.5 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-sky-950/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Ver Catálogo de Cursos
                </a>
                <a href="#calculadora-referidos" class="px-6 py-3.5 bg-[#1B1F23] hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 hover:border-[#FFB000]/50 rounded-xl transition-all flex items-center gap-2">
                  <svg class="w-4 h-4 text-[#FFB000]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  Calculadora Plan Referidos
                </a>
              </div>

              <!-- Ficha de Aval Técnico & Autor -->
              <div class="pt-4 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
                <a href="https://victorparedes.ar" target="_blank" rel="noopener" class="group flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-[#74ACDF]/70 shadow-lg group-hover:scale-105 transition-transform bg-[#1B1F23] shrink-0">
                    <img src="https://victorparedes.ar/foto.jpg" alt="Lic. Víctor Javier Paredes" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://victorparedes.ar/bg1.jpg'">
                  </div>
                  <div>
                    <div class="text-white font-bold group-hover:text-[#74ACDF] transition-colors flex items-center gap-1.5">
                      Dirección Técnica: Lic. Víctor Javier Paredes
                      <svg class="w-3.5 h-3.5 text-[#74ACDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </div>
                    <div class="font-mono text-slate-400 text-[11px]">
                      Matrícula Profesional PA 446 · Autor de <em class="text-slate-300">Water Transfer en Vaca Muerta</em> · <span class="text-[#74ACDF]">victorparedes.ar</span>
                    </div>
                  </div>
                </a>
              </div>

            </div>

            <!-- Panel Lateral de Resumen Operativo -->
            <div class="lg:col-span-5">
              <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-[#74ACDF]/5 rounded-bl-full pointer-events-none"></div>

                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                  <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#FFB000]">Métricas del Ecosistema</span>
                  <span class="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">En Operación</span>
                </div>

                <div class="grid grid-cols-2 gap-4 my-5">
                  <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800">
                    <span class="block text-2xl font-black text-white">190+</span>
                    <span class="text-xs text-slate-400">Alumnos Proyectados</span>
                  </div>
                  <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800">
                    <span class="block text-2xl font-black text-[#74ACDF]">4 Cohortes</span>
                    <span class="text-xs text-slate-400">Escalonadas (Feb-Mar)</span>
                  </div>
                  <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800">
                    <span class="block text-2xl font-black text-[#FFB000]">30%</span>
                    <span class="text-xs text-slate-400">Comisión Promotores</span>
                  </div>
                  <div class="bg-[#24282C] p-4 rounded-xl border border-slate-800">
                    <span class="block text-2xl font-black text-emerald-400">100%</span>
                    <span class="text-xs text-slate-400">Bonificación con 5 Refs</span>
                  </div>
                </div>

                <div class="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div class="flex items-center gap-2 font-semibold text-white">
                    <svg class="w-4 h-4 text-[#74ACDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Distribución Pedagógica Anticohesión:
                  </div>
                  <p class="text-slate-400 text-[11px] leading-relaxed">
                    Cupos máximos de 30 a 35 estudiantes por cohorte para garantizar tutorías sincrónicas sin saturación operativa.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- CATÁLOGO OFICIAL RESUMIDO -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#74ACDF]">Oferta Curricular 2026</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white mt-1">Cursos Arancelados Oficiales</h2>
          </div>
          <a href="#/catalogo" class="text-xs font-bold text-[#74ACDF] hover:text-sky-300 flex items-center gap-1 group">
            Ver todas las fichas técnicas
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${courses.map(course => `
            <div class="bg-[#1B1F23] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group hover:-translate-y-1 shadow-lg">
              <div>
                <div class="relative h-40 rounded-xl overflow-hidden mb-4 bg-slate-800">
                  <img src="${course.image}" alt="${course.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  <span class="absolute top-2 left-2 px-2 py-1 bg-black/75 backdrop-blur-sm text-[10px] font-mono font-semibold rounded text-white border border-white/10">
                    ${course.code}
                  </span>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span class="text-[#74ACDF] font-semibold">${course.category}</span>
                  <span>${course.duration}</span>
                </div>
                <h3 class="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#74ACDF] transition-colors">
                  ${course.title}
                </h3>
                <p class="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  ${course.description}
                </p>
              </div>

              <div class="pt-4 border-t border-slate-800">
                <div class="flex items-baseline justify-between mb-3">
                  <span class="text-[11px] text-slate-400 uppercase font-mono">Arancel Oficial:</span>
                  <span class="text-lg font-black text-white font-mono">${formatARS(course.basePrice)}</span>
                </div>
                <a href="#/catalogo" class="w-full py-2 bg-slate-800 hover:bg-[#74ACDF] hover:text-slate-950 text-white font-bold text-xs rounded-lg transition-colors text-center block">
                  Ver Programa &amp; Cohortes
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- CALCULADORA INTERACTIVA DE REFERIDOS -->
      <section id="calculadora-referidos" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-br from-[#1B1F23] via-[#24282C] to-[#1B1F23] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-6 space-y-4">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFB000]/20 text-[#FFB000] border border-[#FFB000]/30 inline-block">
                Programa Exclusivo para Estudiantes
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white">
                Simula tus Reintegros con el <br class="hidden sm:inline">
                <span class="text-[#FFB000]">Plan de Referidos Inteligente</span>
              </h2>
              <p class="text-sm text-slate-300 leading-relaxed">
                El arancel oficial se abona al ingresar. <strong>Una vez concluida la capacitación</strong>, se te devuelve 
                el <strong>20% por cada colega inscripto</strong>. Con <strong>5 colegas recuperas el 100%</strong> de lo que pagaste por el curso, 
                y si refieres <strong>más de 5 colegas</strong>, recibes el 100% de reintegro <strong>MÁS un 20% de ganancia neta en efectivo por cada colega adicional</strong>.
              </p>

              <!-- Selector Interactivo de Colegas Referidos -->
              <div class="pt-4 space-y-3">
                <label class="block text-xs font-mono font-bold uppercase text-slate-400">
                  Selecciona la cantidad de colegas referidos:
                </label>
                <div class="flex flex-wrap gap-2" id="referral-buttons">
                  <button type="button" data-ref-count="0" class="btn-ref-select px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white hover:bg-slate-700">0 (0%)</button>
                  <button type="button" data-ref-count="1" class="btn-ref-select px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white hover:bg-slate-700">1 (20%)</button>
                  <button type="button" data-ref-count="2" class="btn-ref-select px-3.5 py-2 bg-[#74ACDF] text-slate-950 border border-sky-400 rounded-xl text-xs font-bold ring-2 ring-sky-500/50">2 (40% Base)</button>
                  <button type="button" data-ref-count="3" class="btn-ref-select px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white hover:bg-slate-700">3 (60%)</button>
                  <button type="button" data-ref-count="4" class="btn-ref-select px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white hover:bg-slate-700">4 (80%)</button>
                  <button type="button" data-ref-count="5" class="btn-ref-select px-3.5 py-2 bg-[#FFB000] text-slate-950 border border-amber-400 rounded-xl text-xs font-bold">5 (100% ¡TOTAL!)</button>
                  <button type="button" data-ref-count="6" class="btn-ref-select px-3.5 py-2 bg-emerald-600 text-white border border-emerald-400 rounded-xl text-xs font-bold">6 (+20% Extra)</button>
                  <button type="button" data-ref-count="7" class="btn-ref-select px-3.5 py-2 bg-emerald-600 text-white border border-emerald-400 rounded-xl text-xs font-bold">7 (+40% Extra)</button>
                </div>
              </div>

            </div>

            <!-- Caja de Resultados Financieros en Tiempo Real -->
            <div class="lg:col-span-6">
              <div class="bg-[#1B1F23] border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span class="text-xs text-slate-400 block font-mono">Arancel Oficial Abonado:</span>
                    <span class="text-sm font-bold text-white" id="calc-course-name">$400.000 ARS (Water Transfer)</span>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-slate-400 block font-mono">Reintegro Post-Cursado:</span>
                    <span class="text-xl font-black text-[#FFB000]" id="calc-discount-badge">40% Reintegro</span>
                  </div>
                </div>

                <!-- Barra de Progreso a 5 Referidos -->
                <div>
                  <div class="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>Recupero del valor del curso</span>
                    <span id="calc-progress-label">2 de 5 colegas (40%)</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                    <div id="calc-progress-bar" class="bg-gradient-to-r from-[#74ACDF] via-[#FFB000] to-emerald-400 h-full rounded-full transition-all duration-500" style="width: 40%"></div>
                  </div>
                </div>

                <!-- Resultados Finales -->
                <div class="grid grid-cols-2 gap-4 bg-[#24282C] p-4 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span class="text-[11px] text-slate-400 block">Devolución Curso:</span>
                    <span class="text-lg font-black text-[#FFB000]" id="calc-saved-amount">$160.000 ARS</span>
                    <span class="text-[10px] text-slate-500 block">Hasta 100% ($400k)</span>
                  </div>
                  <div>
                    <span class="text-[11px] text-slate-400 block">Total a Cobrar al Concluir:</span>
                    <span class="text-2xl font-black text-emerald-400" id="calc-final-amount">$160.000 ARS</span>
                    <span class="text-[10px] text-emerald-400/80 block" id="calc-extra-label">Curso + Ganancias</span>
                  </div>
                </div>

                <div id="calc-notice-100" class="hidden p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300">
                  <span id="calc-notice-text">
                    ★ <strong>¡100% Bonificado!</strong> Con 5 colegas recuperas la totalidad de lo abonado por tu capacitación una vez finalizado el cursado.
                  </span>
                </div>

                <!-- Callout de Beneficio Permanente para Egresados (15%) -->
                <div class="p-3.5 bg-[#24282C] border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs">
                  <span class="text-base">🎓</span>
                  <div class="space-y-0.5">
                    <strong class="text-[#FFB000] block font-mono">Luego de Egresado: 15% de Comisión Permanente</strong>
                    <p class="text-slate-300 text-[11px] leading-relaxed">
                      Al graduarte, pasas a ser Embajador: cobras el <strong>15% de comisión en efectivo</strong> por cada nuevo colega inscripto con tu código que abone su arancel oficial.
                    </p>
                  </div>
                </div>

                <a href="#/campus" class="w-full py-3 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl transition-all block text-center shadow-lg shadow-sky-950/40">
                  Ingresar a Mi Campus y Compartir Enlace
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- EXPANSIÓN PROVINCIAL & COORDINADORES -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#FFB000]">Red Comercial Nacional</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Coordinadores Promotores Provinciales</h2>
          <p class="text-sm text-slate-400">
            Asesores directos en las principales cuencas y centros industriales del país, coordinando la captación con una comisión oficial del 30%.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div class="w-12 h-12 rounded-xl bg-[#74ACDF]/10 border border-[#74ACDF]/30 text-[#74ACDF] flex items-center justify-center font-bold mx-auto text-lg">
              CY
            </div>
            <h3 class="text-base font-bold text-white">Nodo Cuyo</h3>
            <p class="text-xs text-slate-400">Mendoza &amp; San Juan (Malargüe, Luján de Cuyo)</p>
            <div class="pt-3 border-t border-slate-800 text-xs font-mono text-slate-300">
              Coordinador: Lic. Gastón Albarracín<br>
              <span class="text-[#74ACDF]">Código: CUYO30</span>
            </div>
          </div>

          <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#FFB000] flex items-center justify-center font-bold mx-auto text-lg">
              CB
            </div>
            <h3 class="text-base font-bold text-white">Nodo Córdoba</h3>
            <p class="text-xs text-slate-400">Centros Universitarios &amp; Parques Industriales</p>
            <div class="pt-3 border-t border-slate-800 text-xs font-mono text-slate-300">
              Coordinadora: Ing. Mariana Benítez<br>
              <span class="text-[#FFB000]">Código: CBA30</span>
            </div>
          </div>

          <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold mx-auto text-lg">
              BA
            </div>
            <h3 class="text-base font-bold text-white">Nodo Buenos Aires</h3>
            <p class="text-xs text-slate-400">Bahía Blanca, Dock Sud y Área Metropolitana</p>
            <div class="pt-3 border-t border-slate-800 text-xs font-mono text-slate-300">
              Coordinador: Téc. Lucas Ferreyra<br>
              <span class="text-emerald-400">Código: BBA30</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  `;
}

export function initHomeEvents() {
  const basePrice = 400000; // Water transfer
  const buttons = document.querySelectorAll('.btn-ref-select');
  const discountBadge = document.getElementById('calc-discount-badge');
  const progressBar = document.getElementById('calc-progress-bar');
  const progressLabel = document.getElementById('calc-progress-label');
  const savedAmount = document.getElementById('calc-saved-amount');
  const finalAmount = document.getElementById('calc-final-amount');
  const notice100 = document.getElementById('calc-notice-100');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const count = parseInt(btn.getAttribute('data-ref-count'), 10);
      
      // Update button styles
      buttons.forEach(b => {
        const c = parseInt(b.getAttribute('data-ref-count'), 10);
        if (c > 5) {
          b.className = 'btn-ref-select px-3.5 py-2 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs font-bold text-emerald-300 hover:bg-emerald-900';
        } else {
          b.className = 'btn-ref-select px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white hover:bg-slate-700';
        }
      });
      btn.className = 'btn-ref-select px-3.5 py-2 bg-[#74ACDF] text-slate-950 border border-sky-400 rounded-xl text-xs font-bold ring-2 ring-sky-500/50';

      const refundPercent = Math.min(1.0, count * 0.20);
      const refundDisplay = Math.round(refundPercent * 100);
      const courseRefund = Math.round(basePrice * refundPercent);
      const extraReferrals = Math.max(0, count - 5);
      const extraBonus = extraReferrals * Math.round(basePrice * 0.20);
      const totalPayout = courseRefund + extraBonus;

      if (discountBadge) {
        if (count > 5) {
          discountBadge.textContent = `100% + ${extraReferrals * 20}% Extra`;
        } else {
          discountBadge.textContent = `${refundDisplay}% Reintegro`;
        }
      }

      if (progressLabel) {
        if (count >= 5) {
          progressLabel.textContent = `${count} colegas (★ 100% Recuperado)`;
        } else {
          progressLabel.textContent = `${count} de 5 colegas (${refundDisplay}%)`;
        }
      }

      if (progressBar) progressBar.style.width = `${Math.min(100, (count / 5) * 100)}%`;
      if (savedAmount) savedAmount.textContent = formatARS(courseRefund);
      if (finalAmount) finalAmount.textContent = formatARS(totalPayout);

      const noticeText = document.getElementById('calc-notice-text');
      if (notice100) {
        if (count > 5) {
          notice100.classList.remove('hidden');
          if (noticeText) noticeText.innerHTML = `★ <strong>¡Nivel Superior!</strong> Recuperas el 100% de tu curso (${formatARS(basePrice)}) <strong>MÁS ${formatARS(extraBonus)} de ganancia neta en dinero</strong> (+20% por cada colega por sobre los 5).`;
        } else if (count === 5) {
          notice100.classList.remove('hidden');
          if (noticeText) noticeText.innerHTML = `★ <strong>¡100% Bonificado!</strong> Con 5 colegas recuperas la totalidad de lo abonado (${formatARS(basePrice)}) una vez finalizado el cursado.`;
        } else {
          notice100.classList.add('hidden');
        }
      }
    });
  });
}

