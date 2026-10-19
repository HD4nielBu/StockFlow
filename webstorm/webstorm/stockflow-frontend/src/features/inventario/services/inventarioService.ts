import { apiFetch } from '../../../api/apiClient';
import type { Existencia } from '../models/Existencia';
import type { MovimientoKardex } from '../models/MovimientoKardex';
import type { Pagina } from '../models/Pagina';

/** Filtros opcionales de GET /api/inventario/stock. */
export interface FiltrosStock {
  productoId?: number;
  ubicacionId?: number;
  soloBajoMinimo?: boolean;
}

/** Arma "?productoId=1&soloBajoMinimo=true" sólo con los filtros que tienen valor. */
export function queryStock(filtros: FiltrosStock): string {
  const params = new URLSearchParams();
  if (filtros.productoId) params.set('productoId', String(filtros.productoId));
  if (filtros.ubicacionId) params.set('ubicacionId', String(filtros.ubicacionId));
  if (filtros.soloBajoMinimo) params.set('soloBajoMinimo', 'true');
  const texto = params.toString();
  return texto ? `?${texto}` : '';
}

/**
 * InventarioController es de SÓLO LECTURA: el stock no se edita directamente (RN-01),
 * cambia únicamente con movimientos. Por eso aquí no hay POST ni PUT.
 */
export const inventarioService = {
  /** Todas las existencias (producto x ubicación). */
  listarStock(signal?: AbortSignal): Promise<Existencia[]> {
    return apiFetch<Existencia[]>('/inventario/stock', { signal });
  },
  /** Existencias filtradas en el backend. 404 si el producto o la ubicación no existen. */
  consultarStock(filtros: FiltrosStock, signal?: AbortSignal): Promise<Existencia[]> {
    return apiFetch<Existencia[]>(`/inventario/stock${queryStock(filtros)}`, { signal });
  },
  /** RF-20: existencias en o bajo su stock mínimo, por producto y ubicación. */
  stockBajoMinimo(signal?: AbortSignal): Promise<Existencia[]> {
    return apiFetch<Existencia[]>('/inventario/stock?soloBajoMinimo=true', { signal });
  },
  /** RF-19: kardex paginado de un producto. pagina empieza en 0. */
  kardex(productoId: number, pagina: number, tamano: number, signal?: AbortSignal): Promise<Pagina<MovimientoKardex>> {
    return apiFetch<Pagina<MovimientoKardex>>(`/inventario/kardex/${productoId}?pagina=${pagina}&tamano=${tamano}`, { signal });
  },
};
