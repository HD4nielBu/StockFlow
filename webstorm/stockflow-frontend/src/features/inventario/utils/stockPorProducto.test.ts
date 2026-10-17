import { describe, expect, it } from 'vitest';
import type { Existencia } from '../models/Existencia';
import { stockPorProducto } from './stockPorProducto';

const existencia = (productoId: number, cantidad: number, bajoMinimo = false): Existencia => ({
  stockId: Math.random(),
  productoId,
  codigoProducto: `P-${productoId}`,
  producto: `Producto ${productoId}`,
  ubicacionId: 1,
  codigoUbicacion: 'UB',
  ubicacion: 'Almacén',
  cantidad,
  stockMinimo: 10,
  bajoMinimo,
});

describe('stockPorProducto', () => {
  it('suma las ubicaciones de cada producto y marca si alguna está bajo el mínimo', () => {
    const resumen = stockPorProducto([existencia(1, 120), existencia(1, 5, true), existencia(2, 40)]);
    expect(resumen.get(1)).toEqual({ total: 125, ubicaciones: 2, bajoMinimo: true });
    expect(resumen.get(2)).toEqual({ total: 40, ubicaciones: 1, bajoMinimo: false });
    expect(resumen.has(3)).toBe(false);
  });
});
