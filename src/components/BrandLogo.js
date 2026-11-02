/**
 * Vaca Muerta Consulting - Componente de Identidad Visual Oficial
 * Basado en Manual de Marca V09 (V Sólida y Franja) y Paleta C (Grafito Técnico):
 * - Grafito: #24282C (60% fondos y textos)
 * - Blanco: #FFFFFF (25% franja patria y contrastes)
 * - Celeste: #74ACDF (10% franja patria y acentos)
 * - Acero Claro: #DADDDA (apoyo y papelería)
 * - Ámbar Seguridad: #FFB000 (solo señalética y advertencias)
 * 
 * Dirección Técnica: Lic. Víctor Javier Paredes · Mat. Profesional PA 446 · victorparedes.ar
 */

/**
 * Renderiza el Isologo "V Sólida y Franja" como SVG vectorial escalable
 * @param {Object} options
 * @param {number} options.size - Tamaño en píxeles (ancho/alto)
 * @param {string} options.variant - 'dark' (para fondos oscuros), 'light' (para fondos claros), 'monochrome'
 */
export function renderIsologoV({ size = 40, variant = 'dark', className = '' } = {}) {
  const bodyColor = variant === 'light' ? '#24282C' : '#FFFFFF';
  const bandCeleste = '#74ACDF';
  const bandWhite = '#FFFFFF';

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className} shrink-0">
      <!-- Orejeta / Perno Izquierdo Superior -->
      <ellipse cx="23" cy="22" rx="6" ry="4" transform="rotate(-30 23 22)" fill="${bodyColor}" />
      
      <!-- Orejeta / Perno Derecho Superior -->
      <ellipse cx="85" cy="18" rx="6" ry="4" transform="rotate(30 85 18)" fill="${bodyColor}" />

      <!-- Cuerpo Superior de la V (Brazo Izquierdo) -->
      <polygon points="23,20 41,20 49,43 32,43" fill="${bodyColor}" />
      
      <!-- Cuerpo Superior de la V (Brazo Derecho) -->
      <polygon points="85,16 67,16 57,43 74,43" fill="${bodyColor}" />

      <!-- Franja Patria Intermedia (Celeste / Blanco / Celeste) a través de la V -->
      <!-- Franja Celeste Superior -->
      <polygon points="32,43 49,43 51,48 30,48" fill="${bandCeleste}" />
      <polygon points="74,43 57,43 55,48 76,48" fill="${bandCeleste}" />

      <!-- Franja Blanca Central -->
      <polygon points="30,48 51,48 53,53 28,53" fill="${bandWhite}" />
      <polygon points="76,48 55,48 53,53 78,53" fill="${bandWhite}" />

      <!-- Franja Celeste Inferior -->
      <polygon points="28,53 53,53 55,58 26,58" fill="${bandCeleste}" />
      <polygon points="78,53 53,53 51,58 80,58" fill="${bandCeleste}" />

      <!-- Vértice Inferior Sólido de la V -->
      <polygon points="26,58 80,58 53,88" fill="${bodyColor}" />
    </svg>
  `;
}

/**
 * Renderiza el Logo Completo (Isologo + Tipografía "Vaca Muerta consulting" + Franja Patria)
 * @param {Object} options
 * @param {'horizontal' | 'vertical' | 'compact'} options.layout
 * @param {'sm' | 'md' | 'lg'} options.size
 * @param {boolean} options.withDirector - Si incluye la firma del Lic. Víctor Paredes PA 446
 */
export function renderBrandLogo({
  layout = 'horizontal',
  size = 'md',
  withDirector = true,
  className = ''
} = {}) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconPx = isSm ? 28 : (isLg ? 52 : 38);
  const titleTextSize = isSm ? 'text-sm' : (isLg ? 'text-2xl' : 'text-base sm:text-lg');
  const subtitleSize = isSm ? 'text-[8px] tracking-[0.25em]' : (isLg ? 'text-xs tracking-[0.3em]' : 'text-[10px] tracking-[0.28em]');

  if (layout === 'vertical') {
    return `
      <div class="flex flex-col items-center text-center ${className}">
        ${renderIsologoV({ size: isLg ? 64 : 48, variant: 'dark' })}
        <div class="mt-2 flex flex-col items-center">
          <span class="font-black text-white font-display tracking-tight leading-none ${titleTextSize}">Vaca Muerta</span>
          <span class="font-normal text-slate-300 uppercase ${subtitleSize} mt-0.5">c o n s u l t i n g</span>
          <div class="w-12 h-1 flex flex-col justify-between mt-1.5">
            <div class="h-[1.5px] bg-[#74ACDF] w-full rounded-full"></div>
            <div class="h-[1px] bg-white w-full"></div>
            <div class="h-[1.5px] bg-[#74ACDF] w-full rounded-full"></div>
          </div>
        </div>
        ${withDirector ? `
          <div class="mt-2 text-[11px] text-slate-400 font-mono">
            Lic. Víctor Javier Paredes · Mat. PA 446
          </div>
        ` : ''}
      </div>
    `;
  }

  // Layout Horizontal (Estilo "Negativo · horizontal" del Manual V09)
  return `
    <div class="flex items-center gap-3 ${className} group">
      <div class="transition-transform group-hover:scale-105">
        ${renderIsologoV({ size: iconPx, variant: 'dark' })}
      </div>
      <div class="flex flex-col">
        <span class="font-black text-white font-display tracking-tight leading-tight ${titleTextSize}">Vaca Muerta</span>
        <span class="font-medium text-slate-300 uppercase ${subtitleSize} leading-none">consulting</span>
        
        <!-- Franja Patria Oficial (Celeste / Blanco / Celeste) -->
        <div class="w-14 sm:w-16 h-1 flex flex-col justify-between mt-1">
          <div class="h-[1.5px] bg-[#74ACDF] w-full rounded-full"></div>
          <div class="h-[1px] bg-white w-full opacity-90"></div>
          <div class="h-[1.5px] bg-[#74ACDF] w-full rounded-full"></div>
        </div>

        ${withDirector ? `
          <span class="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-wide mt-1">
            Lic. Víctor Paredes · Mat. PA 446 · victorparedes.ar
          </span>
        ` : ''}
      </div>
    </div>
  `;
}
