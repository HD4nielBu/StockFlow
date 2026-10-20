import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { Key, ReactNode } from 'react';
import { siguienteOrden, type Orden } from '../../shared/utils/ordenar';
import { Checkbox } from './Checkbox';

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

export type DataTableProps<T> = {
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
  /** Casillas para acciones masivas (primera columna). La Page guarda qué filas están seleccionadas. */
  selection?: {
    isSelected: (row: T) => boolean;
    /** Filas que cambian y su nuevo estado (la casilla del encabezado manda todas las visibles). */
    onToggle: (rows: T[], selected: boolean) => void;
    /** Nombre de la fila para la casilla: "Seleccionar <label>". */
    label: (row: T) => string;
  };
};

/**
 * Tabla de datos. En pantallas pequeñas la MISMA tabla se reorganiza con CSS como lista de
 * tarjetas (data-label pone el nombre de la columna junto a cada valor): no se duplica el DOM.
 */
export function DataTable<T>({ rows, columns, rowKey, caption, actions, footer, sort = null, onSortChange, selection }: DataTableProps<T>) {
  const marcadas = selection ? rows.filter(selection.isSelected).length : 0;
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table data-table--stack">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {selection && (
                <th scope="col" className="data-table__select">
                  <Checkbox
                    label={<span className="sr-only">Seleccionar todas las filas visibles</span>}
                    checked={rows.length > 0 && marcadas === rows.length}
                    // indeterminate sólo existe como propiedad del DOM, no como atributo HTML
                    ref={(el) => {
                      if (el) el.indeterminate = marcadas > 0 && marcadas < rows.length;
                    }}
                    onChange={(e) => selection.onToggle(rows, e.target.checked)}
                  />
                </th>
              )}
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
              <tr key={rowKey(row)} data-selected={selection?.isSelected(row) || undefined}>
                {selection && (
                  <td className="data-table__select" data-label="Seleccionar">
                    <Checkbox
                      label={<span className="sr-only">Seleccionar {selection.label(row)}</span>}
                      checked={selection.isSelected(row)}
                      onChange={(e) => selection.onToggle([row], e.target.checked)}
                    />
                  </td>
                )}
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
