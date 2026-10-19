/** G08: abortar una petición (al desmontar o cambiar de pantalla) no es un error del sistema. */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
