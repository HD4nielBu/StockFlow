type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
};

/** G09: input controlado; emite el texto y la Page decide cómo filtrar. */
export function SearchInput({ value, onChange, label = 'Búsqueda', placeholder = 'Buscar...' }: SearchInputProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
