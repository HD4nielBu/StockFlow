import type { Key, ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Números a la derecha para comparar cifras de un vistazo. */
  align?: 'start' | 'end';
  /** En móvil cada fila es una tarjeta: 'primary' es su título (sin etiqueta) y 'hide' no se muestra. */
  mobile?: 'primary' | 'hide';
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
};

/**
 * Tabla de datos. En pantallas pequeñas la MISMA tabla se reorganiza con CSS como lista de
 * tarjetas (data-label pone el nombre de la columna junto a cada valor): no se duplica el DOM.
 */
export function DataTable<T>({ rows, columns, rowKey, caption, actions, footer }: DataTableProps<T>) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table data-table--stack">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={col.align === 'end' ? 'align-end' : undefined}>
                  {col.header}
                </th>
              ))}
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
