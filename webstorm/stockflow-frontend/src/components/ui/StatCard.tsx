import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { DemoBadge } from './DemoBadge';
import { Skeleton } from './LoadingSkeleton';

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  /** Línea de contexto bajo la cifra ("4 activas"). */
  helper?: ReactNode;
  tone?: 'default' | 'warning' | 'danger' | 'success';
  loading?: boolean;
  /** La cifra es demostrativa, no viene del backend. */
  demo?: boolean;
};

export function StatCard({ label, value, icon: Icon, helper, tone = 'default', loading = false, demo = false }: StatCardProps) {
  return (
    <article className={`stat-card stat-card--${tone}`} aria-busy={loading || undefined}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        {demo && <DemoBadge />}
        {Icon && (
          <span className="stat-card__icon" aria-hidden="true">
            <Icon size={16} />
          </span>
        )}
      </div>
      {loading ? (
        <>
          <Skeleton width={64} height={30} />
          <Skeleton width="60%" height={12} />
        </>
      ) : (
        <>
          <strong className="stat-card__value">{value}</strong>
          {helper && <span className="stat-card__helper">{helper}</span>}
        </>
      )}
    </article>
  );
}
