/** Contrato de paginación del backend (PaginaResponse). pagina empieza en 0. */
export interface PaginaResponse<T> {
  contenido: T[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
}
