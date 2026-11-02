/**
 * Vaca Muerta Consulting - LMS Player (Reproductor Modular Frappe LMS)
 * Inspirado en la arquitectura pedagógica de Frappe LMS:
 * - Navegación lateral por módulos y lecciones
 * - Control de avance porcentual y lecciones completadas
 * - Reproductor de video y apuntes técnicos de yacimiento
 * - Checklists interactivos de campo y evaluación con feedback
 */

import { courseService } from '../services/courseService.js';
import { authService } from '../services/authService.js';
import { showToast } from '../utils/formatters.js';

export function renderLMSPlayer(courseId, initialLessonId = null) {
  const user = authService.getCurrentUser();
  const course = courseService.getById(courseId) || courseService.getAll()[0];

  if (!course) {
    return `<div class="p-12 text-center text-slate-400">Curso no encontrado.</div>`;
  }

  const userId = user ? user.id : 'user-alumno01';
  const progress = courseService.getUserProgress(userId, course.id);
  const completedSet = new Set(progress.completedLessons || []);

  // Determinar lección activa
  let activeLesson = null;
  let activeModuleIndex = 0;
  let allLessonsList = [];

  (course.modules || []).forEach((m, mIdx) => {
    (m.lessons || []).forEach(l => {
      allLessonsList.push({ ...l, moduleId: m.id, moduleTitle: m.title });
      if (initialLessonId && l.id === initialLessonId) {
        activeLesson = l;
        activeModuleIndex = mIdx;
      }
    });
  });

  if (!activeLesson && allLessonsList.length > 0) {
    activeLesson = allLessonsList[0];
  }

  const isCompleted = activeLesson ? completedSet.has(activeLesson.id) : false;

  return `
    <div class="min-h-screen bg-[#24282C] text-slate-100 flex flex-col">
      
      <!-- BARRA SUPERIOR DEL REPRODUCTOR LMS -->
      <div class="bg-[#1B1F23] border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div class="flex items-center gap-3">
          <a href="#/campus" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Volver al Campus">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </a>
          <div>
            <span class="text-[10px] font-mono text-[#74ACDF] font-bold uppercase tracking-wider block leading-none">
              ${course.code} · Reproductor Modular LMS
            </span>
            <h1 class="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-md">
              ${course.title}
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex flex-col text-right">
            <span class="text-xs font-mono font-bold text-emerald-400" id="lms-progress-text">${progress.percent}% Completado</span>
            <span class="text-[10px] text-slate-400 font-mono">${progress.completedLessons ? progress.completedLessons.length : 0} de ${allLessonsList.length} lecciones</span>
          </div>

          <div class="w-24 sm:w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div id="lms-progress-bar" class="bg-gradient-to-r from-[#74ACDF] to-emerald-400 h-full rounded-full transition-all duration-300" style="width: ${progress.percent}%"></div>
          </div>
        </div>
      </div>

      <!-- CONTENEDOR PRINCIPAL: SIDEBAR + ÁREA DE CONTENIDO -->
      <div class="flex-1 flex flex-col lg:flex-row">
        
        <!-- SIDEBAR DE NAVEGACIÓN PEDAGÓGICA (ESTILO FRAPPE LMS) -->
        <aside class="w-full lg:w-80 bg-[#1B1F23] border-r border-slate-800 p-4 space-y-4 shrink-0 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <span class="text-xs font-mono font-bold uppercase text-slate-400">Contenido Curricular</span>
            <span class="text-[11px] font-mono text-[#74ACDF]">${course.modules ? course.modules.length : 0} Módulos</span>
          </div>

          <div class="space-y-4" id="lms-modules-container">
            ${(course.modules || []).map((mod, mIdx) => `
              <div class="bg-[#24282C] border border-slate-800/80 rounded-xl overflow-hidden">
                <div class="p-3 bg-slate-800/40 text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>${mod.title}</span>
                </div>
                <div class="p-1 space-y-1">
                  ${(mod.lessons || []).map(lesson => {
                    const done = completedSet.has(lesson.id);
                    const isCurrent = activeLesson && activeLesson.id === lesson.id;
                    return `
                      <button type="button" data-lesson-id="${lesson.id}" class="btn-select-lesson w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${isCurrent ? 'bg-[#74ACDF]/20 text-[#74ACDF] font-bold border border-[#74ACDF]/40' : 'text-slate-300 hover:bg-slate-800'}">
                        <div class="flex items-center gap-2 truncate pr-2">
                          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${done ? 'bg-emerald-500 text-slate-950 font-bold' : 'border border-slate-600 text-slate-400'}">
                            ${done ? '✓' : '•'}
                          </span>
                          <span class="truncate">${lesson.title}</span>
                        </div>
                        <span class="text-[10px] font-mono text-slate-500 shrink-0">${lesson.duration}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </aside>

        <!-- ÁREA CENTRAL DE APRENDIZAJE -->
        <main class="flex-1 p-4 sm:p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
          
          ${activeLesson ? `
            <!-- Encabezado de la Lección Activa -->
            <div class="space-y-2 border-b border-slate-800 pb-4">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#74ACDF]/20 text-[#74ACDF] border border-[#74ACDF]/30">
                  Lección Activa
                </span>
                <span class="text-xs font-mono text-slate-400">Duración estimada: ${activeLesson.duration}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-white" id="lms-lesson-title">
                ${activeLesson.title}
              </h2>
              <p class="text-xs text-slate-400">${activeLesson.summary || ''}</p>
            </div>

            <!-- Visor Multimedia / Video Operacional -->
            <div class="bg-black rounded-2xl overflow-hidden aspect-video relative border border-slate-800 shadow-2xl flex items-center justify-center">
              <div class="text-center p-6 space-y-3">
                <div class="w-16 h-16 rounded-2xl bg-[#74ACDF]/20 border border-[#74ACDF]/40 text-[#74ACDF] flex items-center justify-center mx-auto">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 class="text-base font-bold text-white">Registro Audiovisual de Operación de Campo</h3>
                <p class="text-xs text-slate-400 max-w-md mx-auto font-mono">
                  Transmisión sincronizada de cabina de bombeo y maniobras en Cuenca Neuquina (Capacitación Oficial).
                </p>
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-[#FFB000]">
                  <span>HD 1080p</span> · <span>Audio Técnico</span> · <span>Telemetría SCADA</span>
                </div>
              </div>
            </div>

            <!-- Pestañas de Aprendizaje Técnico -->
            <div class="bg-[#1B1F23] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div class="border-b border-slate-800 pb-3 flex flex-wrap gap-2" id="lms-lesson-tabs">
                <button type="button" data-lms-tab="tab-theory" class="lms-tab-btn px-4 py-2 bg-[#74ACDF] text-slate-950 font-bold text-xs rounded-xl transition-all">
                  1. Procedimiento &amp; Marco Operativo
                </button>
                <button type="button" data-lms-tab="tab-checklist" class="lms-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                  2. Checklist de Campo &amp; PTS
                </button>
                <button type="button" data-lms-tab="tab-quiz" class="lms-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all">
                  3. Test Evaluativo Interactivo
                </button>
              </div>

              <!-- PESTAÑA 1: TEORÍA -->
              <div id="tab-theory" class="lms-tab-content space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                <div class="prose prose-invert max-w-none">
                  ${activeLesson.content ? activeLesson.content.replace(/\n/g, '<br>') : '<p>Contenido técnico en carga por Dirección Académica.</p>'}
                </div>
              </div>

              <!-- PESTAÑA 2: CHECKLIST -->
              <div id="tab-checklist" class="lms-tab-content space-y-4 hidden">
                <h4 class="text-sm font-bold text-white">Lista de Verificación Obligatoria para Supervisores en Pozo</h4>
                <div class="space-y-2">
                  ${(activeLesson.checklist || [
                    "Verificar firmas conjuntas en Permiso de Trabajo Seguro (PTS)",
                    "Comprobar aislamiento LOTO con candado y tarjeta personal",
                    "Constatar disponibilidad de botiquín de trauma y plan MEDEVAC activo"
                  ]).map((chk, i) => `
                    <label class="flex items-start gap-3 p-3 bg-[#24282C] border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                      <input type="checkbox" class="mt-0.5 rounded bg-slate-900 border-slate-700 text-[#74ACDF] focus:ring-0">
                      <span class="text-xs text-slate-200 font-medium">${chk}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- PESTAÑA 3: TEST EVALUATIVO -->
              <div id="tab-quiz" class="lms-tab-content space-y-4 hidden">
                <div class="bg-[#24282C] p-5 rounded-2xl border border-slate-800 space-y-4">
                  <span class="text-xs font-mono font-bold text-[#FFB000] uppercase">Pregunta de Validación Operacional</span>
                  <p class="text-sm font-bold text-white">
                    ¿Cuál es el valor máximo tolerado de concentración de Sulfhídrico (H2S) antes de ordenar la evacuación inmediata y activación de Stop Work Authority (SWA)?
                  </p>
                  
                  <div class="space-y-2 text-xs">
                    <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input type="radio" name="quiz-opt" value="a" class="text-[#74ACDF]">
                      <span>A) 50 ppm en promedio de 8 horas</span>
                    </label>
                    <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input type="radio" name="quiz-opt" value="b" class="text-[#74ACDF]">
                      <span>B) TLV-TWA de 1 ppm; evacuación y parada preventiva al superar 10 ppm en detector personal</span>
                    </label>
                    <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer hover:border-slate-500">
                      <input type="radio" name="quiz-opt" value="c" class="text-[#74ACDF]">
                      <span>C) 100 ppm siempre que haya viento a favor</span>
                    </label>
                  </div>

                  <div id="quiz-feedback" class="hidden p-3 rounded-xl text-xs font-mono"></div>

                  <button type="button" id="btn-submit-quiz" class="px-4 py-2 bg-[#74ACDF] hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors">
                    Calificar Respuesta
                  </button>
                </div>
              </div>

            </div>

            <!-- BARRA DE ACCIÓN INFERIOR: COMPLETAR / SIGUIENTE -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-800">
              <button type="button" id="btn-toggle-complete-lesson" data-course-id="${course.id}" data-lesson-id="${activeLesson.id}" class="px-5 py-3 ${isCompleted ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'} font-bold text-xs rounded-xl transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>${isCompleted ? 'Lección Completada ✓' : 'Marcar como Completada'}</span>
              </button>

              <a href="#/campus" class="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1">
                <span>Guardar y volver a Mi Campus</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </a>
            </div>

          ` : `
            <div class="p-12 text-center text-slate-400">Seleccione una lección del menú lateral.</div>
          `}

        </main>

      </div>

    </div>
  `;
}

export function initLMSEvents(courseId, onLessonChange) {
  const user = authService.getCurrentUser();
  const userId = user ? user.id : 'user-alumno01';

  // Selección de lección desde sidebar
  document.querySelectorAll('.btn-select-lesson').forEach(btn => {
    btn.addEventListener('click', () => {
      const lessonId = btn.getAttribute('data-lesson-id');
      if (onLessonChange) {
        onLessonChange(courseId, lessonId);
      }
    });
  });

  // Pestañas internas de la lección
  const tabButtons = document.querySelectorAll('.lms-tab-btn');
  const tabContents = document.querySelectorAll('.lms-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-lms-tab');

      tabButtons.forEach(b => {
        b.className = 'lms-tab-btn px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all';
      });
      btn.className = 'lms-tab-btn px-4 py-2 bg-[#74ACDF] text-slate-950 font-bold text-xs rounded-xl transition-all';

      tabContents.forEach(c => {
        if (c.id === targetId) {
          c.classList.remove('hidden');
        } else {
          c.classList.add('hidden');
        }
      });
    });
  });

  // Botón marcar como completada
  const btnToggle = document.getElementById('btn-toggle-complete-lesson');
  btnToggle?.addEventListener('click', () => {
    const cId = btnToggle.getAttribute('data-course-id');
    const lId = btnToggle.getAttribute('data-lesson-id');

    const updatedProg = courseService.toggleLesson(userId, cId, lId);
    if (updatedProg) {
      showToast(`Progreso actualizado: ${updatedProg.percent}% completado`, 'success');
      if (onLessonChange) {
        onLessonChange(cId, lId);
      }
    }
  });

  // Test Quiz
  const btnSubmitQuiz = document.getElementById('btn-submit-quiz');
  btnSubmitQuiz?.addEventListener('click', () => {
    const selected = document.querySelector('input[name="quiz-opt"]:checked');
    const feedback = document.getElementById('quiz-feedback');
    if (!feedback) return;

    if (!selected) {
      feedback.className = 'p-3 rounded-xl text-xs font-mono bg-rose-950/80 border border-rose-800 text-rose-300';
      feedback.textContent = 'Por favor seleccione una opción antes de calificar.';
      feedback.classList.remove('hidden');
      return;
    }

    if (selected.value === 'b') {
      feedback.className = 'p-3 rounded-xl text-xs font-mono bg-emerald-950/80 border border-emerald-800 text-emerald-300';
      feedback.innerHTML = '<strong>¡Correcto!</strong> En Vaca Muerta el límite de exposición permissible (TLV-TWA) es 1 ppm y a 10 ppm se procede a la detención preventiva con activación de SWA.';
      feedback.classList.remove('hidden');
    } else {
      feedback.className = 'p-3 rounded-xl text-xs font-mono bg-amber-950/80 border border-amber-800 text-amber-300';
      feedback.innerHTML = '<strong>Incorrecto.</strong> El sulfhídrico tiene efectos letales a concentraciones elevadas; la respuesta adecuada es la B (1 ppm TLV-TWA y alarma a 10 ppm).';
      feedback.classList.remove('hidden');
    }
  });
}
