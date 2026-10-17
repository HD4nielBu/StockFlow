import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { guardarPreferencia, leerPreferencia } from '../../shared/utils/storage';
import { THEME_STORAGE_KEY, ThemeContext, type ThemePreference } from './themeContext';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function preferenciaInicial(): ThemePreference {
  const guardada = leerPreferencia(THEME_STORAGE_KEY);
  return guardada === 'light' || guardada === 'dark' ? guardada : 'system';
}

// El tema del sistema es un sistema externo: useSyncExternalStore se re-suscribe si el usuario lo cambia
function suscribirSistema(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}
const sistemaEsOscuro = () => window.matchMedia(DARK_QUERY).matches;

/** Aplica data-theme en <html>; los tokens CSS hacen el resto. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(preferenciaInicial);
  const systemDark = useSyncExternalStore(suscribirSistema, sistemaEsOscuro, () => false);
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  const value = useMemo(
    () => ({
      preference,
      resolved,
      setPreference: (next: ThemePreference) => {
        setPreference(next);
        guardarPreferencia(THEME_STORAGE_KEY, next);
      },
    }),
    [preference, resolved],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
