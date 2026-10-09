import { useContext } from 'react';
import { DemoSessionContext } from './demoSessionContext';
import { iniciales } from './models/DemoSession';

const INVITADO = { nombre: 'Invitado', correo: 'Sin sesión de demostración', iniciales: 'IN' };

/** Sesión demo + la identidad a mostrar (con sesión o como invitado). */
export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) throw new Error('useDemoSession debe usarse dentro de <DemoSessionProvider>');
  const { session } = context;
  const identidad = session ? { nombre: session.nombre, correo: session.correo, iniciales: iniciales(session.nombre) } : INVITADO;
  return { ...context, identidad };
}
