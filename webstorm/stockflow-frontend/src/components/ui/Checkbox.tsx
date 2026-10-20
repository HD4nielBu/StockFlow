import { Check } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

// ComponentProps y no InputHTMLAttributes: incluye ref (en React 19 es una prop más) para indeterminate
type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & { label: ReactNode };

/** Checkbox nativo (teclado y formularios gratis) con apariencia propia. */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={['checkbox', className].filter(Boolean).join(' ')}>
      <input type="checkbox" className="checkbox__input" {...props} />
      <span className="checkbox__box" aria-hidden="true">
        <Check size={12} strokeWidth={3} />
      </span>
      <span className="checkbox__label">{label}</span>
    </label>
  );
}
