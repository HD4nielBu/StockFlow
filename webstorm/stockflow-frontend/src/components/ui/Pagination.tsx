import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Con totalItems y pageSize se muestra "1–10 de 42". */
  totalItems?: number;
  pageSize?: number;
};

/** Páginas a mostrar: siempre la primera, la última y las vecinas de la actual; el resto, "…". */
function paginasVisibles(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? (['…', p] as const) : [p]));
}

/** G09: sólo emite la página pedida; no hace HTTP. Sirve igual para paginación cliente o servidor. */
export function Pagination({ page, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  const desde = totalItems && pageSize ? (page - 1) * pageSize + 1 : 0;
  const hasta = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : 0;
  return (
    <nav className="pagination" aria-label="Paginación">
      {totalItems !== undefined && pageSize !== undefined ? (
        <p className="pagination__summary">
          {totalItems === 0 ? 'Sin resultados' : `${desde}–${hasta} de ${totalItems}`}
        </p>
      ) : (
        <p className="pagination__summary">
          Página {page} de {totalPages}
        </p>
      )}
      <div className="pagination__pages">
        <button
          type="button"
          className="pagination__button"
          aria-label="Anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        {paginasVisibles(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="pagination__gap" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className="pagination__button"
              aria-label={`Página ${p}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => p !== page && onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="pagination__button"
          aria-label="Siguiente"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
