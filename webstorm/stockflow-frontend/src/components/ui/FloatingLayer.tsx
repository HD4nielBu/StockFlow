import { useEffect, useRef, type KeyboardEventHandler, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredPosition, type Placement } from '../../shared/hooks/useAnchoredPosition';

type FloatingLayerProps = {
  id: string;
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  placement: Placement;
  role: 'menu' | 'dialog';
  label: string;
  /** Cierre por clic fuera (refocus=false) o por Escape (refocus=true: el foco vuelve al botón). */
  onClose: (refocus: boolean) => void;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  className?: string;
  children: ReactNode;
};

/**
 * Base de Dropdown y Popover: portal en <body>, posición fixed junto al ancla,
 * cierre con Escape o clic fuera. La entrada se anima en CSS (@starting-style); la salida es
 * inmediata a propósito: el usuario ya decidió y no debe esperar a que el panel desaparezca.
 */
export function FloatingLayer({
  id,
  open,
  anchorRef,
  panelRef,
  placement,
  role,
  label,
  onClose,
  onKeyDown,
  className,
  children,
}: FloatingLayerProps) {
  const style = useAnchoredPosition(anchorRef, panelRef, open, placement);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onCloseRef.current(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current(true);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef, panelRef]);

  if (!open) return null;
  return createPortal(
    <div
      ref={panelRef}
      id={id}
      role={role}
      aria-label={label}
      tabIndex={-1}
      className={['floating', className].filter(Boolean).join(' ')}
      style={style}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>,
    document.body,
  );
}
