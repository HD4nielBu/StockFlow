import { describe, expect, it } from 'vitest';
import { categoriasMock } from '../../categorias/data/categorias.mock';
import { productosMock } from '../../productos/data/productos.mock';
import type { Existencia } from '../models/Existencia';
import {
  existenciasPorUbicacion,
  menorCobertura,
  productosPorCategoria,
  saludStock,
  ultimosRegistrados,
  valorReferencial,
} from './indicadores';

const e = (over: Partial<Existencia>): Existencia => ({
  stockId: 1, productoId: 1, codigoProducto: 'P', producto: 'P', ubicacionId: 1, codigoUbicacion: 'U',
  ubicacion: 'Central', cantidad: 100, stockMinimo: 10, bajoMinimo: false, ...over,
});

describe('indicadores del dashboard', () => {
  it('clasifica las existencias en bajo mínimo, cerca del mínimo y saludables', () => {
    const salud = saludStock([e({ cantidad: 5, bajoMinimo: true }), e({ cantidad: 15 }), e({ cantidad: 16 }), e({ cantidad: 100 })]);
    expect(salud).toEqual({ bajo: 1, cerca: 1, ok: 2, total: 4 }); // 15 = 1,5 × 10 entra en "cerca"
  });

  it('cuenta productos por categoría incluyendo las vacías, de mayor a menor', () => {
    const conteo = productosPorCategoria(productosMock, categoriasMock);
    expect(conteo[0]).toEqual({ id: 1, nombre: 'Material de oficina', total: 2 });
    expect(conteo.find((c) => c.id === 3)?.total).toBe(0);
  });

  it('agrupa por ubicación contando productos, no sumando cantidades', () => {
    const res = existenciasPorUbicacion([
      e({ ubicacionId: 1, cantidad: 500 }),
      e({ ubicacionId: 1, productoId: 2, bajoMinimo: true }),
      e({ ubicacionId: 2, ubicacion: 'Norte' }),
    ]);
    expect(res).toEqual([
      { ubicacionId: 1, ubicacion: 'Central', productos: 2, bajoMinimo: 1 },
      { ubicacionId: 2, ubicacion: 'Norte', productos: 1, bajoMinimo: 0 },
    ]);
  });

  it('ordena por cobertura del mínimo e ignora mínimos en cero', () => {
    const res = menorCobertura([e({ stockId: 1, cantidad: 50 }), e({ stockId: 2, cantidad: 5 }), e({ stockId: 3, stockMinimo: 0 })]);
    expect(res.map((c) => c.existencia.stockId)).toEqual([2, 1]);
    expect(res[0].ratio).toBe(0.5);
  });

  it('estima el valor con el precio referencial y cuenta lo que no tiene precio', () => {
    const productos = [{ ...productosMock[0], id: 1, precioReferencial: 2.5 }, { ...productosMock[1], id: 2, precioReferencial: null }];
    expect(valorReferencial([e({ productoId: 1, cantidad: 10 }), e({ productoId: 2 })], productos)).toEqual({ valor: 25, sinPrecio: 1 });
  });

  it('devuelve los últimos registrados por id descendente', () => {
    expect(ultimosRegistrados(productosMock, 2).map((p) => p.id)).toEqual([3, 2]);
  });
});
