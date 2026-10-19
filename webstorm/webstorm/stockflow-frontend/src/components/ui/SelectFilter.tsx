export type Option = { value: string; label: string };

type SelectFilterProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
