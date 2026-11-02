/**
 * Vaca Muerta Formación · Script Principal (v3.0 Multi-Servicio)
 * Funcionalidades: Tests Evaluativos Interactivos, Lightbox de Inspección, Video Player, Menú Móvil, Barra de Progreso
 */

function initAll() {
  try { initNavbar(); } catch (e) { console.error('Error in initNavbar:', e); }
  try { initProgressBar(); } catch (e) { console.error('Error in initProgressBar:', e); }
  try { initLightbox(); } catch (e) { console.error('Error in initLightbox:', e); }
  try { initVideoModals(); } catch (e) { console.error('Error in initVideoModals:', e); }
  try { initSmoothScroll(); } catch (e) { console.error('Error in initSmoothScroll:', e); }
  try { initInteractiveQuizzes(); } catch (e) { console.error('Error in initInteractiveQuizzes:', e); }
  try { initGalleryFilter(); } catch (e) { console.error('Error in initGalleryFilter:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* 1. NAVEGACIÓN MÓVIL Y CABECERA */
function initNavbar() {
  const toggle = document.querySelector('.cabecera__toggle');
  const nav = document.querySelector('.cabecera__nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('activo');
      toggle.setAttribute('aria-expanded', nav.classList.contains('activo'));
    });
  }

  // Marcar enlace activo según el scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.cabecera__nav a');

  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('activo');
        if (link.getAttribute('href').includes(`#${current}`)) {
          link.classList.add('activo');
        }
      });
    }, { passive: true });
  }
}

/* 2. BARRA DE PROGRESO DE LECTURA (CURSO) */
function initProgressBar() {
  const progressBar = document.getElementById('progreso-lectura');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* 3. LIGHTBOX INTERACTIVO PARA IMÁGENES Y DIAGRAMAS TÉCNICOS */
function initLightbox() {
  let lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox-modal';
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__contenido">
        <button class="lightbox__cerrar" title="Cerrar (Esc)">&times;</button>
        <button class="lightbox__nav lightbox__nav--prev" title="Anterior (←)">&#10094;</button>
        <button class="lightbox__nav lightbox__nav--next" title="Siguiente (→)">&#10095;</button>
        <div class="lightbox__imagen-wrap">
          <img class="lightbox__imagen" src="" alt="Inspección técnica">
        </div>
        <div class="lightbox__info">
          <span class="lightbox__etiqueta">Inspección Operativa en HD</span>
          <h4 class="lightbox__titulo"></h4>
          <p class="lightbox__descripcion"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const overlay = lightbox.querySelector('.lightbox__overlay');
  const cerrarBtn = lightbox.querySelector('.lightbox__cerrar');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  const imgEl = lightbox.querySelector('.lightbox__imagen');
  const tituloEl = lightbox.querySelector('.lightbox__titulo');
  const descEl = lightbox.querySelector('.lightbox__descripcion');

  let galeriaActual = [];
  let indiceActual = 0;

  function abrirLightbox(items, index) {
    if (!items || !items.length) return;
    galeriaActual = items;
    indiceActual = Math.max(0, Math.min(index, items.length - 1));
    mostrarItem(indiceActual);
    lightbox.classList.add('activo');
    lightbox.style.display = 'flex';
    lightbox.style.visibility = 'visible';
    lightbox.style.opacity = '1';
    lightbox.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  function cerrarLightbox() {
    lightbox.classList.remove('activo');
    lightbox.style.visibility = 'hidden';
    lightbox.style.opacity = '0';
    lightbox.style.pointerEvents = 'none';
    document.body.style.overflow = '';
  }

  function mostrarItem(idx) {
    if (idx < 0) idx = galeriaActual.length - 1;
    if (idx >= galeriaActual.length) idx = 0;
    indiceActual = idx;

    const item = galeriaActual[indiceActual];
    if (!item) return;

    imgEl.src = item.src;
    imgEl.alt = item.titulo || 'Detalle operativo';
    tituloEl.textContent = item.titulo || 'Inspección de Campo';
    descEl.textContent = item.desc || '';

    if (galeriaActual.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  function extraerItems(cards) {
    return Array.from(cards).map(el => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      const caption = el.querySelector('figcaption') || el.querySelector('.tarjeta-foto__caption');
      const h4 = caption ? (caption.querySelector('h4') || caption.querySelector('strong')) : null;
      const p = caption ? caption.querySelector('p') : null;
      return {
        element: el,
        src: img ? (img.getAttribute('data-full') || img.src || img.getAttribute('src')) : (el.getAttribute('href') || ''),
        titulo: h4 ? h4.textContent.trim() : (img ? (img.alt || 'Registro de campo') : 'Inspección técnica'),
        desc: p ? p.textContent.trim() : ''
      };
    });
  }

  function abrirDesdeElemento(el) {
    const card = el.closest('.tarjeta-foto') || el;
    const grid = el.closest('.galeria-grid');
    let listaCards = [];
    if (grid) {
      listaCards = Array.from(grid.querySelectorAll('.tarjeta-foto')).filter(c => {
        return window.getComputedStyle(c).display !== 'none';
      });
    } else {
      listaCards = Array.from(document.querySelectorAll('.tarjeta-foto, .figura-ampliable'));
    }
    const items = extraerItems(listaCards);
    const idx = listaCards.indexOf(card);
    abrirLightbox(items, idx >= 0 ? idx : 0);
  }

  // 1. Asignar listener directo a cada tarjeta de foto y figura ampliable
  const triggers = document.querySelectorAll('.tarjeta-foto, .figura-ampliable, [data-zoom]');
  triggers.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      abrirDesdeElemento(el);
    });
  });

  // 2. Delegación de eventos en la grilla de galería para máxima robustez
  const galeriaGrid = document.querySelector('.galeria-grid');
  if (galeriaGrid) {
    galeriaGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.tarjeta-foto');
      if (!card) return;
      e.preventDefault();
      abrirDesdeElemento(card);
    });
  }

  overlay.addEventListener('click', cerrarLightbox);
  cerrarBtn.addEventListener('click', cerrarLightbox);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); mostrarItem(indiceActual - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); mostrarItem(indiceActual + 1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('activo')) return;
    if (e.key === 'Escape') cerrarLightbox();
    if (e.key === 'ArrowLeft') mostrarItem(indiceActual - 1);
    if (e.key === 'ArrowRight') mostrarItem(indiceActual + 1);
  });
}

/* 4. MOTOR DE TESTS EVALUATIVOS INTERACTIVOS (QUIZZES) */
function initInteractiveQuizzes() {
  // Manejo de tabs de selector de especialidad
  const selectorBtns = document.querySelectorAll('.selector-especialidad__btn');
  const gruposServicio = document.querySelectorAll('.grupo-preguntas-servicio');

  if (selectorBtns.length && gruposServicio.length) {
    // Asegurar estado inicial explícito en el DOM
    gruposServicio.forEach(g => {
      if (g.classList.contains('activo')) {
        g.style.display = 'block';
      } else {
        g.style.display = 'none';
      }
    });

    selectorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-servicio');
        if (!targetId) return;

        // Actualizar estado de los botones
        selectorBtns.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');

        // Mostrar únicamente el grupo seleccionado
        let targetGrupo = null;
        gruposServicio.forEach(g => {
          if (g.id === targetId) {
            g.classList.add('activo');
            g.style.display = 'block';
            targetGrupo = g;
          } else {
            g.classList.remove('activo');
            g.style.display = 'none';
          }
        });

        // Desplazamiento suave para enfocar el cuestionario seleccionado
        if (targetGrupo) {
          const encabezado = targetGrupo.querySelector('.test-interactivo__encabezado') || targetGrupo;
          encabezado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  // Inicializar todas las preguntas interactivas
  const todasLasPreguntas = document.querySelectorAll('.pregunta-test');
  todasLasPreguntas.forEach(pregunta => {
    const opciones = pregunta.querySelectorAll('.opcion-test');
    const opcionCorrecta = parseInt(pregunta.getAttribute('data-correcta'), 10);
    const feedback = pregunta.querySelector('.pregunta-test__feedback');
    const scopeContainer = pregunta.closest('.grupo-preguntas-servicio') || pregunta.closest('.test-interactivo');

    opciones.forEach(btn => {
      btn.addEventListener('click', () => {
        if (pregunta.classList.contains('respondida')) return;

        pregunta.classList.add('respondida');
        const elegida = parseInt(btn.getAttribute('data-opcion'), 10);

        if (elegida === opcionCorrecta) {
          btn.classList.add('correcta');
          feedback.innerHTML = `<span class="feedback--ok">✓ ¡Respuesta Correcta!</span> ${feedback.getAttribute('data-explicacion') || ''}`;
          pregunta.setAttribute('data-estado', 'correcta');
        } else {
          btn.classList.add('incorrecta');
          opciones.forEach(b => {
            if (parseInt(b.getAttribute('data-opcion'), 10) === opcionCorrecta) {
              b.classList.add('correcta-resaltada');
            }
          });
          feedback.innerHTML = `<span class="feedback--err">✗ Respuesta Incorrecta.</span> ${feedback.getAttribute('data-explicacion') || ''}`;
          pregunta.setAttribute('data-estado', 'incorrecta');
        }

        feedback.style.display = 'block';

        // Verificar si todas las preguntas del ámbito están respondidas para habilitar el botón
        if (scopeContainer) {
          const btnCalcular = scopeContainer.querySelector('.btn-calcular-test');
          const preguntasAmbito = scopeContainer.querySelectorAll('.pregunta-test');
          const respondidasAmbito = scopeContainer.querySelectorAll('.pregunta-test.respondida');

          if (btnCalcular && respondidasAmbito.length === preguntasAmbito.length) {
            btnCalcular.removeAttribute('disabled');
            btnCalcular.classList.add('listo');
          }
        }
      });
    });
  });

  // Inicializar botones de calcular y resultados por ámbito (grupo o test general)
  const calcButtons = document.querySelectorAll('.btn-calcular-test');
  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const scopeContainer = btn.closest('.grupo-preguntas-servicio') || btn.closest('.test-interactivo');
      if (!scopeContainer) return;

      const resultadoBox = scopeContainer.querySelector('.resultado-test');
      if (!resultadoBox) return;

      const preguntas = scopeContainer.querySelectorAll('.pregunta-test');
      const correctas = scopeContainer.querySelectorAll('.pregunta-test[data-estado="correcta"]').length;
      const total = preguntas.length;
      const porcentaje = Math.round((correctas / total) * 100);
      const nombreEspecialidad = scopeContainer.getAttribute('data-nombre-servicio') || 'Evaluación Operativa';

      let mensaje = '';
      let claseBadge = 'badge--ok';
      if (porcentaje >= 80) {
        mensaje = `¡Excelente! Cumple con los estándares de competencia técnica para la supervisión de ${nombreEspecialidad} en Vaca Muerta.`;
        claseBadge = 'badge--ok';
      } else if (porcentaje >= 60) {
        mensaje = `Aprobado con observaciones. Se recomienda repasar los procedimientos críticos de ${nombreEspecialidad} antes de asumir guardia.`;
        claseBadge = 'badge--alerta';
      } else {
        mensaje = `No aprobado en ${nombreEspecialidad}. Requiere refuerzo normativo y procedimental en seguridad antes de la certificación.`;
        claseBadge = 'badge--critico';
      }

      resultadoBox.innerHTML = `
        <div class="resultado-test__card">
          <span class="badge ${claseBadge}">CALIFICACIÓN: ${porcentaje}%</span>
          <h4>Resultado en ${nombreEspecialidad}: ${correctas} de ${total} correctas</h4>
          <p>${mensaje}</p>
          <button class="btn-reiniciar-test boton boton--secundario" style="margin-top:1.2rem;">Reintentar Esta Especialidad</button>
        </div>
      `;
      resultadoBox.style.display = 'block';
      resultadoBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

      resultadoBox.querySelector('.btn-reiniciar-test').addEventListener('click', () => {
        preguntas.forEach(p => {
          p.classList.remove('respondida');
          p.removeAttribute('data-estado');
          p.querySelectorAll('.opcion-test').forEach(o => {
            o.classList.remove('correcta', 'incorrecta', 'correcta-resaltada');
          });
          const fb = p.querySelector('.pregunta-test__feedback');
          if (fb) {
            fb.style.display = 'none';
            fb.innerHTML = '';
          }
        });
        resultadoBox.style.display = 'none';
        btn.setAttribute('disabled', 'true');
        btn.classList.remove('listo');
        scopeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });
}

/* 5. FILTROS EN GALERÍA TÉCNICA */
function initGalleryFilter() {
  const filterButtons = document.querySelectorAll('.galeria-filtros button');
  const items = document.querySelectorAll('.galeria-grid .tarjeta-foto');

  if (!filterButtons.length || !items.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      const categoria = btn.getAttribute('data-filtro');

      items.forEach(item => {
        if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* 6. MODAL DE VIDEOS OPERACIONALES */
function initVideoModals() {
  const videoCards = document.querySelectorAll('[data-video-src]');
  if (!videoCards.length) return;

  let modalVideo = document.getElementById('modal-video');
  if (!modalVideo) {
    modalVideo = document.createElement('div');
    modalVideo.id = 'modal-video';
    modalVideo.className = 'lightbox lightbox--video';
    modalVideo.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__contenido lightbox__contenido--video">
        <button class="lightbox__cerrar">&times;</button>
        <div class="video-container">
          <video controls autoplay class="lightbox__video">
            <source src="" type="video/mp4">
            Tu navegador no soporta reproducción de video HTML5.
          </video>
        </div>
        <div class="lightbox__info">
          <h4 class="lightbox__titulo"></h4>
          <p class="lightbox__descripcion"></p>
        </div>
      </div>
    `;
    document.body.appendChild(modalVideo);
  }

  const overlay = modalVideo.querySelector('.lightbox__overlay');
  const cerrarBtn = modalVideo.querySelector('.lightbox__cerrar');
  const videoEl = modalVideo.querySelector('.lightbox__video');
  const tituloEl = modalVideo.querySelector('.lightbox__titulo');
  const descEl = modalVideo.querySelector('.lightbox__descripcion');

  function cerrarVideo() {
    videoEl.pause();
    videoEl.querySelector('source').src = '';
    videoEl.load();
    modalVideo.classList.remove('activo');
    document.body.style.overflow = '';
  }

  videoCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const src = card.getAttribute('data-video-src');
      const titulo = card.getAttribute('data-video-title') || 'Video Operativo';
      const desc = card.getAttribute('data-video-desc') || '';

      videoEl.querySelector('source').src = src;
      videoEl.load();
      videoEl.play();
      tituloEl.textContent = titulo;
      descEl.textContent = desc;

      modalVideo.classList.add('activo');
      document.body.style.overflow = 'hidden';
    });
  });

  overlay.addEventListener('click', cerrarVideo);
  cerrarBtn.addEventListener('click', cerrarVideo);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalVideo.classList.contains('activo')) {
      cerrarVideo();
    }
  });
}

/* 7. SCROLL SUAVE */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
