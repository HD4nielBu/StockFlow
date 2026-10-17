/**
 * Contrato de CategoriaResponse del backend (GET /api/categorias).
 * No es la entidad JPA: es lo que la API decide exponer (sin createdAt ni updatedAt).
 */
export interface Categoria {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}
