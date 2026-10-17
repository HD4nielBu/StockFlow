/**
 * Sesión de DEMOSTRACIÓN. StockFlow todavía no tiene autenticación en el backend, así que esto
 * NO es seguridad: no hay contraseña, token ni permisos. Sólo guarda cómo mostrar al usuario.
 * Cuando exista un endpoint de login, esta pieza se reemplaza por la sesión real (no se "mejora").
 */
export interface DemoSession {
  nombre: string;
  correo: string;
  /** true: se guarda en localStorage (sobrevive al cerrar el navegador); false: sessionStorage. */
  recordar: boolean;
}

/** "maria.lopez@uni.edu" o "maria_lopez" → "Maria Lopez". */
export function nombreDesdeIdentificador(identificador: string): string {
  const base = identificador.trim().split('@')[0];
  const palabras = base.split(/[._\-\s]+/).filter(Boolean);
  if (palabras.length === 0) return 'Usuario demo';
  return palabras.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
}

export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = partes.length === 1 ? partes[0].slice(0, 2) : partes[0][0] + partes[partes.length - 1][0];
  return (letras || 'UD').toUpperCase();
}

/** Primer nombre para saludos ("Buenos días, María"). */
export function primerNombre(nombre: string): string {
  return nombre.trim().split(/\s+/)[0] ?? nombre;
}
