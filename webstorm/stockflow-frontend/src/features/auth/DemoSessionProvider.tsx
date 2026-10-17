import { useMemo, useState, type ReactNode } from 'react';
import { borrarPreferencia, guardarPreferencia, leerPreferencia } from '../../shared/utils/storage';
import { DEMO_SESSION_KEY, DemoSessionContext } from './demoSessionContext';
import type { DemoSession } from './models/DemoSession';

/** Lo guardado puede estar corrupto o haber sido editado a mano: se valida la forma antes de usarlo. */
function leerGuardada(): DemoSession | null {
  for (const area of ['local', 'session'] as const) {
    const texto = leerPreferencia(DEMO_SESSION_KEY, area);
    if (!texto) continue;
    try {
      const data = JSON.parse(texto) as Partial<DemoSession>;
      if (typeof data.nombre === 'string' && typeof data.correo === 'string' && data.nombre.trim()) {
        return { nombre: data.nombre.slice(0, 80), correo: data.correo.slice(0, 120), recordar: area === 'local' };
      }
    } catch {
      // JSON inválido: se ignora y se trata como invitado
    }
  }
  return null;
}

function persistir(session: DemoSession | null) {
  borrarPreferencia(DEMO_SESSION_KEY, 'local');
  borrarPreferencia(DEMO_SESSION_KEY, 'session');
  if (!session) return;
  // Sólo nombre y correo: NUNCA la contraseña (ni siquiera llega a este provider)
  const valor = JSON.stringify({ nombre: session.nombre, correo: session.correo });
  guardarPreferencia(DEMO_SESSION_KEY, valor, session.recordar ? 'local' : 'session');
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(leerGuardada);

  const value = useMemo(
    () => ({
      session,
      iniciar: (nueva: DemoSession) => {
        persistir(nueva);
        setSession(nueva);
      },
      actualizar: (cambios: Pick<DemoSession, 'nombre' | 'correo'>) => {
        if (!session) return;
        const actualizada = { ...session, ...cambios };
        persistir(actualizada);
        setSession(actualizada);
      },
      cerrar: () => {
        persistir(null);
        setSession(null);
      },
    }),
    [session],
  );

  return <DemoSessionContext value={value}>{children}</DemoSessionContext>;
}
