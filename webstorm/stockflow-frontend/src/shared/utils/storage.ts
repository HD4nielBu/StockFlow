/**
 * localStorage / sessionStorage pueden fallar (modo privado, cuota llena, sitio bloqueado). Sólo se
 * usan para preferencias de interfaz y la identidad de la demo: si fallan, la app sigue con valores
 * por defecto.
 */
type Area = 'local' | 'session';

const almacen = (area: Area) => (area === 'local' ? window.localStorage : window.sessionStorage);

export function leerPreferencia(clave: string, area: Area = 'local'): string | null {
  try {
    return almacen(area).getItem(clave);
  } catch {
    return null;
  }
}

export function guardarPreferencia(clave: string, valor: string, area: Area = 'local'): void {
  try {
    almacen(area).setItem(clave, valor);
  } catch {
    // Sin almacenamiento la preferencia dura sólo esta sesión: no es un error para el usuario
  }
}

export function borrarPreferencia(clave: string, area: Area = 'local'): void {
  try {
    almacen(area).removeItem(clave);
  } catch {
    // Nada que borrar si el almacenamiento no está disponible
  }
}
