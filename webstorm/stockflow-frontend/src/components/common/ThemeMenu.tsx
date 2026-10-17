import { Monitor, Moon, Sun } from 'lucide-react';
import type { ThemePreference } from '../../app/theme/themeContext';
import { useTheme } from '../../app/theme/useTheme';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

const OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
];

export default function ThemeMenu() {
  const { preference, resolved, setPreference } = useTheme();
  const current = OPTIONS.find((o) => o.value === preference)!;
  const TriggerIcon = resolved === 'dark' ? Moon : Sun;

  return (
    <Dropdown
      label="Tema"
      trigger={(props) => (
        <button {...props} type="button" className="icon-button topbar__icon-button" aria-label={`Tema: ${current.label}`}>
          <TriggerIcon size={18} aria-hidden="true" />
        </button>
      )}
    >
      {OPTIONS.map((option) => (
        <DropdownItem key={option.value} icon={option.icon} checked={preference === option.value} onSelect={() => setPreference(option.value)}>
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
