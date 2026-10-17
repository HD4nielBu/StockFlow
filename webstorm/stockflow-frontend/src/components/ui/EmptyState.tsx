import { Inbox, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Acción que resuelve el vacío ("Nueva categoría", "Limpiar filtros"). */
  action?: ReactNode;
};

export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <section className="empty-state" role="status">
      <span className="empty-state__icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <strong className="empty-state__title">{title}</strong>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </section>
  );
}
