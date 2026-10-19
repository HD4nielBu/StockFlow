/** CrearCategoriaRequest del backend: no lleva id (lo genera PostgreSQL) ni activo (nace activa). */
export interface CategoriaCreateRequest {
  codigo: string;
  nombre: string;
  descripcion: string | null;
}

/** ActualizarCategoriaRequest: reemplazo completo (PUT). El id viaja en la URL; activo es obligatorio. */
export interface CategoriaUpdateRequest extends CategoriaCreateRequest {
  activo: boolean;
}
