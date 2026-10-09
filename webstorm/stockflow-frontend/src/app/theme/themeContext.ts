import { createContext } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  /** Lo que eligió el usuario. */
  preference: ThemePreference;
  /** Lo que se está pintando ("system" ya resuelto). */
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

/** Misma clave que lee el script de index.html para aplicar el tema antes del primer pintado. */
export const THEME_STORAGE_KEY = 'stockflow.theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);
