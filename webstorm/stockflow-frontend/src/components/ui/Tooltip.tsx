import { cloneElement, useEffect, useId, useRef, useState, type ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredPosition, type Placement } from '../../shared/hooks/useAnchoredPosition';

const OPEN_DELAY = 450;
const INSTANT_WINDOW = 300;
// Tras cerrar un tooltip, el siguiente aparece sin espera: recorrer una barra de iconos se siente inmediato
let lastClosedAt = 0;

type TooltipProps = {
  content: string;
  placement?: Placement;
  /** Un solo elemento enfocable (botón, enlace). Recibe aria-describedby. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** false = no se muestra (p. ej. la sidebar expandida ya enseña el texto). */
  enabled?: boolean;
  /** false cuando el tooltip repite el nombre accesible del elemento: así no se lee dos veces. */
  describe?: boolean;
};

/**
 * Texto auxiliar al pasar el puntero o enfocar con teclado. Se cierra con Escape (WCAG 1.4.13).
 * No debe contener información imprescindible: en táctil no hay hover.
 */
export function Tooltip({ content, placement = 'top', children, enabled = true, describe = true }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const floatingRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const style = useAnchoredPosition(anchorRef, floatingRef, open, placement);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = () => {
    if (!enabled) return;
    window.clearTimeout(timer.current);
    const skipDelay = Date.now() - lastClosedAt < INSTANT_WINDOW;
    setInstant(skipDelay);
    if (skipDelay) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    if (open) lastClosedAt = Date.now();
    setOpen(false);
  };

  const visible = open && enabled;

  return (
    <span
      ref={anchorRef}
      className="tooltip-anchor"
      onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === 'Escape' && visible && hide()}
    >
      {cloneElement(children, { 'aria-describedby': visible && describe ? id : undefined })}
      {visible &&
        createPortal(
          <span ref={floatingRef} id={id} role="tooltip" aria-hidden={!describe || undefined} className="tooltip" data-instant={instant || undefined} style={style}>
            {content}
          </span>,
          document.body,
        )}
    </span>
  );
}
