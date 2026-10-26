/** Convierte un parámetro de ruta en un identificador entero positivo. */
export function leerIdPositivo(
  valor: string | string[] | undefined
): number | null {
  if (typeof valor !== 'string' || !/^[1-9]\d*$/.test(valor)) {
    return null;
  }
  const numero = Number(valor);
  return Number.isSafeInteger(numero) ? numero : null;
}
