import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { Key, ReactNode } from 'react';
import { siguienteOrden, type Orden } from '../../shared/utils/ordenar';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Números a la derecha para comparar cifras de un vistazo. */
  align?: 'start' | 'end';
  /** En móvil cada fila es una tarjeta: 'primary' es su título (sin etiqueta) y 'hide' no se muestra. */
  mobile?: 'primary' | 'hide';
  /** El encabezado ordena la tabla (la Page define con qué valor, ver shared/utils/ordenar). */
  sortable?: boolean;
}

type DataTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => Key;
  /** Descripción de la tabla para lectores de pantalla. */
  caption: string;
  /** Menú de acciones de cada fila (última columna). */
  actions?: (row: T) => ReactNode;
  /** Pie dentro de la tarjeta (paginación). */
  footer?: ReactNode;
  /** Orden actual. La tabla sólo lo muestra: la Page ordena TODAS las filas antes de paginar. */
  sort?: Orden | null;
  onSortChange?: (sort: Orden | null) => void;
};

/**
 * Tabla de datos. En pantallas pequeñas la MISMA tabla se reorganiza con CSS como lista de
 * tarjetas (data-label pone el nombre de la columna junto a cada valor): no se duplica el DOM.
 */
export function DataTable<T>({ rows, columns, rowKey, caption, actions, footer, sort = null, onSortChange }: DataTableProps<T>) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table data-table--stack">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => {
                const dir = sort?.key === col.key ? sort.dir : null;
                const Icon = dir === 'asc' ? ArrowUp : dir === 'desc' ? ArrowDown : ChevronsUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={col.align === 'end' ? 'align-end' : undefined}
                    aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}
                  >
                    {col.sortable && onSortChange ? (
                      <button type="button" className="data-table__sort" onClick={() => onSortChange(siguienteOrden(sort, col.key))}>
                        {col.header}
                        <Icon size={14} aria-hidden="true" className="data-table__sort-icon" />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
              {actions && (
                <th scope="col" className="data-table__actions">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    data-label={col.header}
                    data-mobile={col.mobile}
                    className={col.align === 'end' ? 'align-end' : undefined}
                  >
                    {col.cell(row)}
                  </td>
                ))}
                {actions && <td className="data-table__actions">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer && <div className="table-card__footer">{footer}</div>}
    </div>
  );
}
