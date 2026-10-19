import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  /** Mientras es true, el botón se deshabilita y muestra loadingText: evita doble envío. */
  loading?: boolean;
  loadingText?: string;
};

/** G09: botón genérico. No conoce categorías ni productos; la acción llega por onClick. */
export function Button({
  variant = 'primary',
  loading = false,
  loadingText = 'Procesando...',
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant}`} disabled={disabled || loading} {...props}>
      {loading ? loadingText : children}
    </button>
  );
}
