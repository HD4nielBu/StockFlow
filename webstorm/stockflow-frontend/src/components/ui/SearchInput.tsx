import { Search, X } from 'lucide-react';
import { useRef } from 'react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  /** La etiqueta sigue existiendo para lectores de pantalla, pero no se ve (barras de filtros). */
  hideLabel?: boolean;
};

/** G09: input controlado; emite el texto y la Page decide cómo filtrar. */
export function SearchInput({ value, onChange, label = 'Búsqueda', placeholder = 'Buscar...', hideLabel = false }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <label className="field">
      <span className={hideLabel ? 'sr-only' : 'field__label'}>{label}</span>
      <span className="search-input">
        <Search size={16} aria-hidden="true" className="search-input__icon" />
        <input
          ref={inputRef}
          type="search"
          className="control search-input__control"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="icon-button search-input__clear"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </span>
    </label>
  );
}
