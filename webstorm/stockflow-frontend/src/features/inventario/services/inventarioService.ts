import { apiFetch } from '../../../api/apiClient';
import type { PaginaResponse } from '../../../api/PaginaResponse';
import type { Existencia } from '../models/Existencia';
import type { MovimientoKardex } from '../models/MovimientoKardex';

export const inventarioService = {
  /** Todas las existencias por producto y ubicación (GET /api/inventario/stock). */
  listarExistencias(signal?: AbortSignal): Promise<Existencia[]> {
    return apiFetch<Existencia[]>('/inventario/stock', { signal });
  },
  /** RF-20: existencias en o bajo su stock mínimo, por producto y ubicación. */
  stockBajoMinimo(signal?: AbortSignal): Promise<Existencia[]> {
    return apiFetch<Existencia[]>('/inventario/stock?soloBajoMinimo=true', { signal });
  },
  /**
   * RF-19: kardex paginado de un producto. pagina empieza en 0; tamano entre 1 y 100 (si no, 422).
   * 404 si el producto no existe.
   */
  kardex(productoId: number, pagina: number, tamano: number, signal?: AbortSignal): Promise<PaginaResponse<MovimientoKardex>> {
    const query = new URLSearchParams({ pagina: String(pagina), tamano: String(tamano) });
    return apiFetch<PaginaResponse<MovimientoKardex>>(`/inventario/kardex/${productoId}?${query}`, { signal });
  },
};
