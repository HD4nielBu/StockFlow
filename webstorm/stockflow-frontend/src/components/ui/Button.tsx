import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icono a la izquierda del texto. */
  icon?: LucideIcon;
  /** Botón sólo con icono: exige aria-label para tener nombre accesible. */
  iconOnly?: boolean;
  /** Mientras es true, el botón se deshabilita y muestra un spinner: evita doble envío. */
  loading?: boolean;
  /** Texto que anuncia el lector de pantalla mientras carga. */
  loadingText?: string;
};

/**
 * G09: botón genérico. No conoce categorías ni productos; la acción llega por onClick.
 * Al cargar, el contenido se oculta con visibility (no se quita) para que el botón no cambie de ancho.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconOnly = false,
  loading = false,
  loadingText = 'Procesando...',
  disabled,
  children,
  type = 'button',
  className,
  ...props
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, iconOnly && 'btn--icon', loading && 'btn--loading', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      <span className="btn__content">
        {Icon && <Icon size={size === 'sm' ? 15 : 16} aria-hidden="true" strokeWidth={2} />}
        {children}
      </span>
      {loading && (
        <span className="btn__spinner">
          <Spinner size={size === 'sm' ? 14 : 16} />
          <span className="sr-only">{loadingText}</span>
        </span>
      )}
    </button>
  );
}
