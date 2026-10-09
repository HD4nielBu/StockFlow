import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'demo';

type BadgeProps = {
  tone?: BadgeTone;
  /** Punto de color antes del texto (estados). */
  dot?: boolean;
  className?: string;
  children: ReactNode;
};

/** Etiqueta corta. El significado siempre va en el texto, no sólo en el color (accesibilidad). */
export function Badge({ tone = 'neutral', dot = false, className, children }: BadgeProps) {
  return (
    <span className={['badge', `badge--${tone}`, className].filter(Boolean).join(' ')}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
