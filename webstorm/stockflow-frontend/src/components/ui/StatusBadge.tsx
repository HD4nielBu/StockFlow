import { Badge } from './Badge';

/** G09: el estado se comunica con texto además del color (accesibilidad). */
export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge tone={active ? 'success' : 'neutral'} dot className={active ? 'badge--active' : 'badge--inactive'}>
      {active ? 'Activo' : 'Inactivo'}
    </Badge>
  );
}
