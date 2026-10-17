import type { CSSProperties } from 'react';

/** Bloque gris que ocupa el lugar del contenido mientras carga. Decorativo. */
export function Skeleton({ width, height = 14, radius, className }: { width?: CSSProperties['width']; height?: CSSProperties['height']; radius?: number; className?: string }) {
  return (
    <span
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

/** Tabla fantasma: mismo ritmo de filas que la real, para que el contenido no "salte" al llegar. */
export function TableSkeleton({ rows = 6, columns = 5, label = 'Cargando datos' }: { rows?: number; columns?: number; label?: string }) {
  return (
    <div className="table-card" role="status" aria-busy="true">
      <span className="sr-only">{label}...</span>
      <div className="skeleton-table" style={{ '--columns': columns } as CSSProperties}>
        <div className="skeleton-table__head">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton key={i} width="55%" height={10} />
          ))}
        </div>
        {Array.from({ length: rows }, (_, r) => (
          <div className="skeleton-table__row" key={r}>
            {Array.from({ length: columns }, (_, c) => (
              <Skeleton key={c} width={c === 0 ? '70%' : `${45 + ((r * 7 + c * 13) % 40)}%`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mientras se descarga el código de una página: título + bloque de contenido, sin saltos al llegar. */
export function PageSkeleton() {
  return (
    <div className="page-stack" role="status" aria-busy="true">
      <span className="sr-only">Cargando página...</span>
      <div className="page-skeleton__header">
        <Skeleton width={180} height={26} />
        <Skeleton width={320} height={14} />
      </div>
      <Skeleton height={44} radius={12} />
      <Skeleton height={280} radius={12} />
    </div>
  );
}
