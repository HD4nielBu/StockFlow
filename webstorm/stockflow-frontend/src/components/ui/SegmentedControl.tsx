export interface Segment {
  value: string;
  label: string;
  /** Cuántos registros hay en ese segmento (se muestra junto al texto). */
  count?: number;
}

type SegmentedControlProps = {
  label: string;
  value: string;
  options: Segment[];
  onChange: (value: string) => void;
};

/** Filtro de opción única siempre visible (Todas / Activas / Inactivas). */
export function SegmentedControl({ label, value, options, onChange }: SegmentedControlProps) {
  return (
    <div role="group" aria-label={label} className="segmented">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          className="segmented__option"
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined && <span className="segmented__count">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}
