import type { StatusTone } from './StatusBar';

type MeterProps = {
  /** 0..1 (se recorta a esos límites para dibujar). */
  value: number;
  tone: StatusTone;
  /** Texto equivalente para lectores de pantalla ("25 % del mínimo"). */
  label: string;
};

/** Medidor de una sola proporción. El riel es un paso más claro del mismo color: el estado se lee en toda la barra. */
export function Meter({ value, tone, label }: MeterProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <span className={`meter meter--${tone}`} role="img" aria-label={label}>
      <span className="meter__fill" style={{ width: `${pct}%` }} />
    </span>
  );
}
