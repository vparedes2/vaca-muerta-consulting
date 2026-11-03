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
  // Geometría tomada del isotipo oficial (cartel y certificado): dos pernos, brazos de la V,
  // franja celeste partida y vértice inferior trunco.
  const bodyColor = variant === 'light' ? '#1F3347' : '#FFFFFF';
  const band = '#74ACDF';

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 610 530" fill="none" xmlns="http://www.w3.org/2000/svg" class="${className} shrink-0" role="img" aria-label="Isotipo Vaca Muerta Consulting">
      <ellipse cx="55" cy="125" rx="46" ry="22" transform="rotate(-8 55 125)" fill="${bodyColor}" />
      <polygon points="90,148 212,148 253,243 128,243" fill="${bodyColor}" />
      <polygon points="422,47 540,47 455,243 335,243" fill="${bodyColor}" />
      <ellipse cx="550" cy="32" rx="46" ry="22" transform="rotate(14 550 32)" fill="${bodyColor}" />
      <polygon points="137,262 258,262 286,325 160,325" fill="${band}" />
      <polygon points="308,262 440,262 415,325 295,325" fill="${band}" />
      <polygon points="170,343 408,343 352,513 240,513" fill="${bodyColor}" />
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
