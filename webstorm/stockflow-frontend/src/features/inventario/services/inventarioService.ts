import { apiFetch } from '../../../api/apiClient';
import type { PaginaResponse } from '../../../api/PaginaResponse';
import type { Existencia } from '../models/Existencia';
import type { MovimientoKardex } from '../models/MovimientoKardex';
import type { MovimientosSemana } from '../models/MovimientosSemana';

/** Rango de fechas del kardex tal como lo da <input type="date"> (AAAA-MM-DD), ambos días inclusive. */
export interface RangoFechas {
  desde?: string;
  hasta?: string;
}

/** Medianoche LOCAL del día (más `dias`) como instante ISO: el día empieza en la zona de quien consulta. */
function inicioDelDia(fecha: string, dias = 0): string {
  const d = new Date(`${fecha}T00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString();
}

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
   * 404 si el producto no existe; 400 si el rango de fechas está invertido.
   */
  kardex(productoId: number, pagina: number, tamano: number, rango: RangoFechas, signal?: AbortSignal): Promise<PaginaResponse<MovimientoKardex>> {
    const query = new URLSearchParams({ pagina: String(pagina), tamano: String(tamano) });
    // La API filtra con desde inclusive y hasta EXCLUSIVE: "hasta el 20" se envía como el inicio del 21
    if (rango.desde) query.set('desde', inicioDelDia(rango.desde));
    if (rango.hasta) query.set('hasta', inicioDelDia(rango.hasta, 1));
    return apiFetch<PaginaResponse<MovimientoKardex>>(`/inventario/kardex/${productoId}?${query}`, { signal });
  },
  /** Entradas y salidas de las últimas 8 semanas. Las semanas empiezan el lunes en la zona horaria del navegador. */
  movimientosSemanales(signal?: AbortSignal): Promise<MovimientosSemana[]> {
    const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return apiFetch<MovimientosSemana[]>(`/inventario/movimientos/semanal?semanas=8&zona=${encodeURIComponent(zona)}`, { signal });
  },
};
