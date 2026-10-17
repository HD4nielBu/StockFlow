import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { useToast } from './toast/useToast';

type UnavailableButtonProps = {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  /** Por qué no se puede usar (se anuncia al pulsar y como descripción accesible). */
  reason: string;
};

/**
 * Acción que existirá cuando haya backend. NO usa disabled nativo: un botón deshabilitado no recibe
 * foco ni clics, así que nadie sabría por qué no funciona. Se ve atenuado, anuncia aria-disabled y,
 * al pulsarlo, explica el motivo. Nunca aparenta guardar nada.
 */
export function UnavailableButton({ children, icon, variant = 'secondary', size = 'md', reason }: UnavailableButtonProps) {
  const toast = useToast();
  return (
    <Button
      variant={variant}
      size={size}
      icon={icon}
      aria-disabled="true"
      className="btn--unavailable"
      title={reason}
      onClick={() => toast.info({ title: 'No disponible en modo demostración', description: reason })}
    >
      {children}
    </Button>
  );
}
