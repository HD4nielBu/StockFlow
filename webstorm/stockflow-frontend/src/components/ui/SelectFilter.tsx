import { Select } from './Field';

export type Option = { value: string; label: string };

type SelectFilterProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  hideLabel?: boolean;
};

export function SelectFilter({ label, value, options, onChange, hideLabel = false }: SelectFilterProps) {
  return (
    <label className="field">
      <span className={hideLabel ? 'sr-only' : 'field__label'}>{label}</span>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
