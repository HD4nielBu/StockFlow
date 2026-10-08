/** G09: paginación en el cliente. Se aplica DESPUÉS de buscar y filtrar. */
export interface ResultadoPagina<T> {
  items: T[];
  pagina: number;
  totalPaginas: number;
  totalItems: number;
}

export function paginar<T>(datos: T[], pagina: number, tamano: number): ResultadoPagina<T> {
  const totalPaginas = Math.max(1, Math.ceil(datos.length / tamano));
  // Si un filtro o un DELETE dejó la página fuera de rango, se ajusta a la última válida
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaValida - 1) * tamano;
  return {
    items: datos.slice(inicio, inicio + tamano),
    pagina: paginaValida,
    totalPaginas,
    totalItems: datos.length,
  };
}

/** Búsqueda sin distinguir mayúsculas ni tildes ("categoria" encuentra "Categoría"). */
export function normalizar(texto: string | null | undefined): string {
  return (texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}
