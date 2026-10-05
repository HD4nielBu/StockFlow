import type { UnidadMedida } from '../models/Producto';

/** CrearProductoRequest del backend: sin id ni activo. */
export interface ProductoCreateRequest {
  categoriaId: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  unidadMedida: UnidadMedida;
  stockMinimoDefault: number;
  precioReferencial: number | null;
}

/** ActualizarProductoRequest: reemplazo completo; activo es obligatorio. */
export interface ProductoUpdateRequest extends ProductoCreateRequest {
  activo: boolean;
}
