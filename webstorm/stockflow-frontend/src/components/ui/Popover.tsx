import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type Ref } from 'react';
import type { Placement } from '../../shared/hooks/useAnchoredPosition';
import { FloatingLayer } from './FloatingLayer';

export type TriggerProps = {
  ref: Ref<HTMLButtonElement>;
  onClick: () => void;
  'aria-expanded': boolean;
  'aria-controls': string | undefined;
  'aria-haspopup': 'menu' | 'dialog';
};

type PopoverProps = {
  /** Botón que abre el panel. Debe esparcir las props recibidas en un <button>. */
  trigger: (props: TriggerProps) => ReactNode;
  /** Nombre accesible del panel. */
  label: string;
  placement?: Placement;
  className?: string;
  children: ReactNode;
};

/**
 * Panel flotante no modal con contenido libre (notificaciones, información).
 * Al abrir, el foco entra al panel; Escape lo cierra y devuelve el foco al botón; un enlace interno lo cierra.
 */
export function Popover({ trigger, label, placement = 'bottom-end', className, children }: PopoverProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  return (
    <>
      {trigger({
        ref: triggerRef,
        onClick: () => setOpen((v) => !v),
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        'aria-haspopup': 'dialog',
      })}
      <FloatingLayer
        id={id}
        open={open}
        anchorRef={triggerRef}
        panelRef={panelRef}
        placement={placement}
        role="dialog"
        label={label}
        onClose={close}
        className={['popover', className].filter(Boolean).join(' ')}
      >
        {/* Seguir un enlace del panel (p. ej. "Ver existencias") lo cierra: el usuario ya eligió destino */}
        <div onClick={(e) => (e.target as HTMLElement).closest('a[href]') && close(false)}>{children}</div>
      </FloatingLayer>
    </>
  );
}
