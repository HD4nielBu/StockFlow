import { ApiError, mensajeDeError } from './apiClient';

export interface ErrorLegible {
  title: string;
  description: string;
  status?: number;
}

/**
 * Traduce un error de la API a un título comprensible + el detalle que envía el backend.
 * El backend sigue siendo la fuente de verdad: su mensaje se muestra siempre como descripción.
 *  - 400: datos inválidos (los errores por campo se pintan junto a cada input).
 *  - 404: el registro ya no existe (otro usuario lo eliminó) → conviene recargar la lista.
 *  - 409: conflicto (código repetido, registro con dependencias).
 *  - 422: regla de negocio (p. ej. categoría inactiva).
 */
export function describirError(error: unknown, accion: string): ErrorLegible {
  const description = mensajeDeError(error);
  if (!(error instanceof ApiError)) {
    return { title: `No se pudo ${accion}`, description };
  }
  const titles: Record<number, string> = {
    400: 'Revisa los datos ingresados',
    404: 'El registro ya no existe',
    409: `No se pudo ${accion}`,
    422: 'La operación no cumple una regla del inventario',
  };
  return {
    title: titles[error.status] ?? (error.status >= 500 ? 'El servidor tuvo un problema' : `No se pudo ${accion}`),
    description: error.status === 404 ? `${description}. Se actualizó la lista.` : description,
    status: error.status,
  };
}
