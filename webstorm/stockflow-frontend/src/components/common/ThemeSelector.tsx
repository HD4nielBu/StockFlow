import { Monitor, Moon, Sun } from 'lucide-react';
import type { ThemePreference } from '../../app/theme/themeContext';
import { useTheme } from '../../app/theme/useTheme';

const TEMAS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Según el sistema', icon: Monitor },
];

/** Selector de tema con vista previa (radios nativos: flechas del teclado incluidas). */
export default function ThemeSelector() {
  const { preference, setPreference } = useTheme();
  return (
    <div role="radiogroup" aria-label="Tema" className="theme-options">
      {TEMAS.map((t) => (
        <label key={t.value} className="theme-option">
          <input
            type="radio"
            name="tema"
            value={t.value}
            checked={preference === t.value}
            onChange={() => setPreference(t.value)}
            className="theme-option__input"
          />
          <span className={`theme-option__preview theme-option__preview--${t.value}`} aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="theme-option__label">
            <t.icon size={16} aria-hidden="true" />
            {t.label}
          </span>
        </label>
      ))}
    </div>
  );
}
