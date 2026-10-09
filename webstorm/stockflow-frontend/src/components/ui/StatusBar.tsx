import type { LucideIcon } from 'lucide-react';

export type StatusTone = 'good' | 'warning' | 'critical';

export interface StatusSegment {
  key: string;
  label: string;
  value: number;
  tone: StatusTone;
  icon: LucideIcon;
  /** Explicación corta del criterio ("≤ 1,5 × mínimo"). */
  hint?: string;
}

type StatusBarProps = {
  segments: StatusSegment[];
  /** Resumen para lectores de pantalla de la barra (la leyenda ya es texto). */
  label: string;
};

const porcentaje = (value: number, total: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

/**
 * Parte de un todo con colores de ESTADO (reservados: bien / atención / crítico).
 * El color nunca va solo: cada segmento tiene icono, etiqueta, cantidad y porcentaje en la leyenda,
 * y los segmentos se separan con 2 px de superficie (validado para daltonismo).
 */
export function StatusBar({ segments, label }: StatusBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div className="status-bar">
      <div className="status-bar__track" role="img" aria-label={label}>
        {total === 0 ? (
          <span className="status-bar__empty" />
        ) : (
          segments
            .filter((s) => s.value > 0)
            .map((s) => <span key={s.key} className={`status-bar__segment status-bar__segment--${s.tone}`} style={{ flexGrow: s.value }} />)
        )}
      </div>
      <ul className="status-bar__legend">
        {segments.map((s) => (
          <li key={s.key} className="status-bar__item">
            <s.icon size={16} aria-hidden="true" className={`status-bar__icon status-bar__icon--${s.tone}`} />
            <span className="status-bar__text">
              <span className="status-bar__label">{s.label}</span>
              {s.hint && <span className="status-bar__hint">{s.hint}</span>}
            </span>
            <span className="status-bar__value">
              <strong>{s.value}</strong>
              <span className="status-bar__pct">{porcentaje(s.value, total)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
