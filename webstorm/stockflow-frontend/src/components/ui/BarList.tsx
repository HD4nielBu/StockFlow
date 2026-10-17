import type { Key, ReactNode } from 'react';
import { Link } from 'react-router';

export interface BarItem {
  id: Key;
  label: string;
  value: number;
  /** Texto del valor (por defecto, el número). */
  display?: ReactNode;
  /** Dato secundario bajo la etiqueta ("1 bajo mínimo"). */
  hint?: ReactNode;
  /** La fila lleva a otra vista (p. ej. productos de esa categoría). */
  to?: string;
}

type BarListProps = {
  items: BarItem[];
  /** Nombre accesible de la lista ("Productos por categoría"). */
  label: string;
};

/**
 * Barras horizontales de magnitud en un solo tono (sequential). Cada fila es TEXTO real
 * (etiqueta + valor), así que la lista ya es su propia "vista de tabla": la barra es decorativa.
 */
export function BarList({ items, label }: BarListProps) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="bar-list" aria-label={label}>
      {items.map((item) => {
        const content = (
          <>
            <span className="bar-list__head">
              <span className="bar-list__label">{item.label}</span>
              <span className="bar-list__value">{item.display ?? item.value}</span>
            </span>
            <span className="bar-list__track" aria-hidden="true">
              <span className="bar-list__bar" style={{ width: `${(item.value / max) * 100}%` }} />
            </span>
            {item.hint && <span className="bar-list__hint">{item.hint}</span>}
          </>
        );
        return (
          <li key={item.id}>
            {item.to ? (
              <Link to={item.to} className="bar-list__row bar-list__row--link">
                {content}
              </Link>
            ) : (
              <div className="bar-list__row">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
