import type { Existencia } from '../models/Existencia';

export interface StockProducto {
  /** Suma de las cantidades en todas las ubicaciones. */
  total: number;
  ubicaciones: number;
  /** Alguna ubicación está en o bajo su mínimo (RF-20). */
  bajoMinimo: boolean;
}

/** Agrupa las existencias (una por producto y ubicación) en el stock total de cada producto. */
export function stockPorProducto(existencias: Existencia[]): Map<number, StockProducto> {
  const resumen = new Map<number, StockProducto>();
  for (const e of existencias) {
    const actual = resumen.get(e.productoId) ?? { total: 0, ubicaciones: 0, bajoMinimo: false };
    resumen.set(e.productoId, {
      total: actual.total + e.cantidad,
      ubicaciones: actual.ubicaciones + 1,
      bajoMinimo: actual.bajoMinimo || e.bajoMinimo,
    });
  }
  return resumen;
}
