/** Contrato PaginaResponse<T> del backend. La página empieza en 0. */
export interface Pagina<T> {
  contenido: T[];
  pagina: number;
  tamano: number;
  totalElementos: number;
  totalPaginas: number;
}
