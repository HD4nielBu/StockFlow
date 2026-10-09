import { createContext } from 'react';
import type { DemoSession } from './models/DemoSession';

export interface DemoSessionValue {
  /** null = nadie entró en modo demo (se muestra "Invitado"). */
  session: DemoSession | null;
  iniciar: (session: DemoSession) => void;
  /** Cambia nombre/correo mostrados (perfil). Sólo afecta a este navegador. */
  actualizar: (cambios: Pick<DemoSession, 'nombre' | 'correo'>) => void;
  cerrar: () => void;
}

export const DEMO_SESSION_KEY = 'stockflow.demoSession';

export const DemoSessionContext = createContext<DemoSessionValue | null>(null);
