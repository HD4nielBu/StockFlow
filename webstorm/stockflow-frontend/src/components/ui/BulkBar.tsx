import type { ReactNode } from 'react';
import { Button } from './Button';

type BulkBarProps = {
  count: number;
  /** Texto tras la cantidad, en singular y plural (concuerda en género: "categoría seleccionada"). */
  noun: [singular: string, plural: string];
  /** Botones de las acciones masivas. */
  children: ReactNode;
  onClear: () => void;
};

/** Barra de acciones sobre las filas seleccionadas. La cantidad se anuncia (aria-live) al cambiar. */
export function BulkBar({ count, noun, children, onClear }: BulkBarProps) {
  return (
    <div className="bulk-bar" role="region" aria-label="Acciones sobre la selección">
      <p className="bulk-bar__count" aria-live="polite">
        <strong className="num">{count}</strong> {count === 1 ? noun[0] : noun[1]}
      </p>
      <div className="bulk-bar__actions">{children}</div>
      <Button variant="ghost" size="sm" className="bulk-bar__clear" onClick={onClear}>
        Quitar selección
      </Button>
    </div>
  );
}
