import type { InputHTMLAttributes, ReactNode } from 'react';

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role'> & {
  label: ReactNode;
  description?: ReactNode;
};

/** Interruptor encendido/apagado: un checkbox nativo con role="switch" (teclado y formularios gratis). */
export function Switch({ label, description, className, ...props }: SwitchProps) {
  return (
    <label className={['switch', className].filter(Boolean).join(' ')}>
      <input type="checkbox" role="switch" className="switch__input" {...props} />
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
      <span className="switch__text">
        <span className="switch__label">{label}</span>
        {description && <span className="switch__description">{description}</span>}
      </span>
    </label>
  );
}
