import { FlaskConical } from 'lucide-react';
import { Badge } from './Badge';

/**
 * Marca visible para todo lo que NO viene del backend. Regla del proyecto: ningún dato inventado
 * se muestra como real; si es demostrativo, lleva esta etiqueta.
 */
export function DemoBadge({ label = 'Demo' }: { label?: string }) {
  return (
    <Badge tone="demo" className="demo-badge">
      <FlaskConical size={12} aria-hidden="true" />
      {label}
    </Badge>
  );
}
