import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';

export type Placement = 'bottom-start' | 'bottom-end' | 'top' | 'right';

const GAP = 6;
const MARGIN = 8; // distancia mínima al borde de la ventana

/**
 * Calcula la posición `fixed` de un elemento flotante (tooltip, menú) junto a su ancla.
 * Se usa position: fixed + portal para que ningún contenedor con overflow (tablas con scroll,
 * sidebar) lo recorte. Si abajo no cabe, se voltea hacia arriba. transform-origin apunta al ancla
 * para que la animación de entrada "salga" del botón que la abrió.
 */
export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  open: boolean,
  placement: Placement,
): CSSProperties {
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', top: 0, left: 0, visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const anchor = anchorRef.current;
      const floating = floatingRef.current;
      if (!anchor || !floating) return;
      const a = anchor.getBoundingClientRect();
      const f = floating.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const clampX = (x: number) => Math.min(Math.max(MARGIN, x), vw - f.width - MARGIN);

      let top: number;
      let left: number;
      let origin: string;
      if (placement === 'right') {
        top = a.top + a.height / 2 - f.height / 2;
        left = a.right + GAP + 2;
        origin = 'left center';
      } else if (placement === 'top') {
        top = a.top - f.height - GAP;
        left = clampX(a.left + a.width / 2 - f.width / 2);
        origin = 'bottom center';
      } else {
        const fitsBelow = a.bottom + GAP + f.height <= vh - MARGIN || a.top - GAP - f.height < MARGIN;
        top = fitsBelow ? a.bottom + GAP : a.top - GAP - f.height;
        left = clampX(placement === 'bottom-end' ? a.right - f.width : a.left);
        origin = `${fitsBelow ? 'top' : 'bottom'} ${placement === 'bottom-end' ? 'right' : 'left'}`;
      }
      setStyle({ position: 'fixed', top: Math.round(top), left: Math.round(left), transformOrigin: origin });
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true); // capture: también el scroll de contenedores internos
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef, floatingRef, open, placement]);

  return style;
}
