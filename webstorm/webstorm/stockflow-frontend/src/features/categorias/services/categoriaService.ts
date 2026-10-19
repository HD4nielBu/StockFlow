import { apiFetch } from '../../../api/apiClient';
import type { Categoria } from '../models/Categoria';
import type { CategoriaCreateRequest, CategoriaUpdateRequest } from '../types/CategoriaRequests';

/**
 * G06: el único lugar que conoce las rutas de categorías. Los componentes expresan intenciones
 * (listar, actualizar...) y no construyen URLs ni headers.
 */
export const categoriaService = {
  listar(signal?: AbortSignal): Promise<Categoria[]> {
    return apiFetch<Categoria[]>('/categorias', { signal });
  },
  obtenerPorId(id: number, signal?: AbortSignal): Promise<Categoria> {
    return apiFetch<Categoria>(`/categorias/${id}`, { signal });
  },
  crear(data: CategoriaCreateRequest): Promise<Categoria> {
    return apiFetch<Categoria>('/categorias', { method: 'POST', body: JSON.stringify(data) });
  },
  actualizar(id: number, data: CategoriaUpdateRequest): Promise<Categoria> {
    return apiFetch<Categoria>(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  /** 204 si se eliminó; 409 si la categoría tiene productos (FK sin CASCADE en PostgreSQL). */
  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/categorias/${id}`, { method: 'DELETE' });
  },
};
