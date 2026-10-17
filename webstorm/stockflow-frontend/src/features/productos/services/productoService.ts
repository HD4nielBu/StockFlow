import { apiFetch } from '../../../api/apiClient';
import type { Producto } from '../models/Producto';
import type { ProductoCreateRequest, ProductoUpdateRequest } from '../types/ProductoRequests';

/** G07: CRUD de la entidad hija. Para el selector de categorías se reutiliza categoriaService. */
export const productoService = {
  listar(signal?: AbortSignal): Promise<Producto[]> {
    return apiFetch<Producto[]>('/productos', { signal });
  },
  obtenerPorId(id: number, signal?: AbortSignal): Promise<Producto> {
    return apiFetch<Producto>(`/productos/${id}`, { signal });
  },
  crear(data: ProductoCreateRequest): Promise<Producto> {
    return apiFetch<Producto>('/productos', { method: 'POST', body: JSON.stringify(data) });
  },
  /** 422 si se intenta mover el producto a una categoría inactiva. */
  actualizar(id: number, data: ProductoUpdateRequest): Promise<Producto> {
    return apiFetch<Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  /** 204 si se eliminó; 409 si tiene stock o movimientos (RN-01: el kardex no se borra). */
  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/productos/${id}`, { method: 'DELETE' });
  },
};
