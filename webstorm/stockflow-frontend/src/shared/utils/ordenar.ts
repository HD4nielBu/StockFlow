/** Orden de una tabla: columna y sentido. null = el orden natural que decide la Page. */
export interface Orden {
  key: string;
  dir: 'asc' | 'desc';
}

export type ValoresOrden<T> = Record<string, (fila: T) => string | number | null | undefined>;

/** Clic en un encabezado: ascendente → descendente → sin orden. Otra columna empieza en ascendente. */
export function siguienteOrden(actual: Orden | null, key: string): Orden | null {
  if (actual?.key !== key) return { key, dir: 'asc' };
  return actual.dir === 'asc' ? { key, dir: 'desc' } : null;
}

const texto = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

/**
 * G09: ordenamiento en el cliente. Se aplica DESPUÉS de filtrar y ANTES de paginar (si no, sólo se
 * ordenaría la página visible). Los vacíos van siempre al final. Es estable: los empates conservan el orden previo.
 */
export function ordenar<T>(datos: T[], orden: Orden | null, valores: ValoresOrden<T>): T[] {
  const valor = orden && valores[orden.key];
  if (!orden || !valor) return datos;
  const signo = orden.dir === 'asc' ? 1 : -1;
  return datos.toSorted((a, b) => {
    const va = valor(a);
    const vb = valor(b);
    if (va == null || va === '') return vb == null || vb === '' ? 0 : 1;
    if (vb == null || vb === '') return -1;
    const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : texto.compare(String(va), String(vb));
    return cmp * signo;
  });
}
