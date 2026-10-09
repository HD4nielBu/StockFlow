import { Check, type LucideIcon } from 'lucide-react';
import {
  createContext,
  use,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { Placement } from '../../shared/hooks/useAnchoredPosition';
import { FloatingLayer } from './FloatingLayer';
import type { TriggerProps } from './Popover';

const DropdownContext = createContext<(() => void) | null>(null);

type DropdownProps = {
  trigger: (props: TriggerProps) => ReactNode;
  /** Nombre accesible del menú. */
  label: string;
  placement?: Placement;
  className?: string;
  children: ReactNode;
};

const itemsDe = (panel: HTMLElement | null) =>
  Array.from(panel?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([aria-disabled="true"])') ?? []);

/**
 * Menú de acciones (patrón WAI-ARIA "menu button"): flechas para moverse, Home/End,
 * Escape o Tab para salir. Al elegir una opción el menú se cierra y el foco vuelve al botón.
 */
export function Dropdown({ trigger, label, placement = 'bottom-end', className, children }: DropdownProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [focusLast, setFocusLast] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const items = itemsDe(panelRef.current);
    (focusLast ? items.at(-1) : items[0])?.focus();
  }, [open, focusLast]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusLast(e.key === 'ArrowUp');
      setOpen(true);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = itemsDe(panelRef.current);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') move(index + 1);
    else if (e.key === 'ArrowUp') move(index - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(items.length - 1);
    else if (e.key === 'Tab') close(false);
  };

  const triggerProps: TriggerProps = {
    ref: triggerRef,
    onClick: () => {
      setFocusLast(false);
      setOpen((v) => !v);
    },
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    'aria-haspopup': 'menu',
  };

  return (
    <DropdownContext value={() => close()}>
      <span onKeyDown={onTriggerKeyDown} className="dropdown-trigger">
        {trigger(triggerProps)}
      </span>
      <FloatingLayer
        id={id}
        open={open}
        anchorRef={triggerRef}
        panelRef={panelRef}
        placement={placement}
        role="menu"
        label={label}
        onClose={close}
        onKeyDown={onMenuKeyDown}
        className={['menu', className].filter(Boolean).join(' ')}
      >
        {children}
      </FloatingLayer>
    </DropdownContext>
  );
}

type DropdownItemProps = {
  icon?: LucideIcon;
  onSelect: () => void;
  /** Opción de selección única (tema, orden...): se anuncia como menuitemradio. */
  checked?: boolean;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  /** Texto secundario a la derecha (atajo, "Demo"...). */
  hint?: ReactNode;
  children: ReactNode;
};

export function DropdownItem({ icon: Icon, onSelect, checked, tone = 'default', disabled = false, hint, children }: DropdownItemProps) {
  const close = use(DropdownContext);
  const isRadio = checked !== undefined;
  return (
    <button
      type="button"
      role={isRadio ? 'menuitemradio' : 'menuitem'}
      aria-checked={isRadio ? checked : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      className={`menu__item menu__item--${tone}`}
      onClick={() => {
        if (disabled) return;
        close?.();
        onSelect();
      }}
    >
      {Icon && <Icon size={16} aria-hidden="true" className="menu__icon" />}
      <span className="menu__label">{children}</span>
      {hint && <span className="menu__hint">{hint}</span>}
      {isRadio && <Check size={15} aria-hidden="true" className="menu__check" style={{ opacity: checked ? 1 : 0 }} />}
    </button>
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="menu__separator" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <div role="presentation" className="menu__group-label">
      {children}
    </div>
  );
}
