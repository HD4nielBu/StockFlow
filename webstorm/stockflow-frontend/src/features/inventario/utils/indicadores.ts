import type { Categoria } from '../../categorias/models/Categoria';
import type { Producto } from '../../productos/models/Producto';
import type { Existencia } from '../models/Existencia';

/**
 * Indicadores del Dashboard. TODOS son datos derivados de las respuestas reales de la API
 * (categorías, productos, existencias): no se inventa ninguna cifra. Con mucho volumen deberían
 * calcularse en el backend con un endpoint agregado en lugar de descargar todo.
 */

/** Umbral de la franja "cerca del mínimo": hasta 1,5 veces el stock mínimo. Es una regla de la UI, no del backend. */
export const FACTOR_CERCA_MINIMO = 1.5;

export type EstadoExistencia = 'bajo' | 'cerca' | 'ok';

/** Estado de una existencia: "bajo" lo decide el backend (bajoMinimo); "cerca" es la franja de la UI. */
export function estadoExistencia(e: Existencia): EstadoExistencia {
  if (e.bajoMinimo) return 'bajo';
  return e.cantidad <= e.stockMinimo * FACTOR_CERCA_MINIMO ? 'cerca' : 'ok';
}

export interface SaludStock {
  bajo: number;
  cerca: number;
  ok: number;
  total: number;
}

export function saludStock(existencias: Existencia[]): SaludStock {
  let bajo = 0;
  let cerca = 0;
  for (const e of existencias) {
    const estado = estadoExistencia(e);
    if (estado === 'bajo') bajo++;
    else if (estado === 'cerca') cerca++;
  }
  return { bajo, cerca, ok: existencias.length - bajo - cerca, total: existencias.length };
}

export interface ConteoCategoria {
  id: number;
  nombre: string;
  total: number;
}

/** Productos por categoría, de mayor a menor. Incluye las categorías sin productos. */
export function productosPorCategoria(productos: Producto[], categorias: Categoria[]): ConteoCategoria[] {
  const conteo = new Map<number, number>();
  productos.forEach((p) => conteo.set(p.categoriaId, (conteo.get(p.categoriaId) ?? 0) + 1));
  return categorias
    .map((c) => ({ id: c.id, nombre: c.nombre, total: conteo.get(c.id) ?? 0 }))
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre));
}

export interface ResumenUbicacion {
  ubicacionId: number;
  ubicacion: string;
  /** Productos distintos con existencia registrada en la ubicación. */
  productos: number;
  bajoMinimo: number;
}

/**
 * Existencias por ubicación. Se cuentan PRODUCTOS, no se suman cantidades: sumar cajas con litros
 * daría un número sin sentido.
 */
export function existenciasPorUbicacion(existencias: Existencia[]): ResumenUbicacion[] {
  const resumen = new Map<number, ResumenUbicacion>();
  for (const e of existencias) {
    const actual = resumen.get(e.ubicacionId) ?? { ubicacionId: e.ubicacionId, ubicacion: e.ubicacion, productos: 0, bajoMinimo: 0 };
    actual.productos++;
    if (e.bajoMinimo) actual.bajoMinimo++;
    resumen.set(e.ubicacionId, actual);
  }
  return [...resumen.values()].sort((a, b) => b.productos - a.productos || a.ubicacion.localeCompare(b.ubicacion));
}

export interface Cobertura {
  existencia: Existencia;
  /** cantidad / stockMinimo: 1 = justo en el mínimo. */
  ratio: number;
}

/** Existencias con menor cobertura de su mínimo (las más urgentes primero). Ignora mínimos en 0. */
export function menorCobertura(existencias: Existencia[], limite = 5): Cobertura[] {
  return existencias
    .filter((e) => e.stockMinimo > 0)
    .map((e) => ({ existencia: e, ratio: e.cantidad / e.stockMinimo }))
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, limite);
}

export interface ValorInventario {
  valor: number;
  /** Existencias de productos sin precio referencial: no suman al valor. */
  sinPrecio: number;
}

/** Σ cantidad × precio referencial. Es una estimación: el backend no informa moneda ni costo real. */
export function valorReferencial(existencias: Existencia[], productos: Producto[]): ValorInventario {
  const precios = new Map(productos.map((p) => [p.id, p.precioReferencial]));
  let valor = 0;
  let sinPrecio = 0;
  for (const e of existencias) {
    const precio = precios.get(e.productoId);
    if (precio === null || precio === undefined) sinPrecio++;
    else valor += e.cantidad * precio;
  }
  return { valor, sinPrecio };
}

/** Últimos productos registrados. No hay fecha de alta en la API: se aproxima por el id (secuencia de PostgreSQL). */
export function ultimosRegistrados(productos: Producto[], limite = 5): Producto[] {
  return [...productos].sort((a, b) => b.id - a.id).slice(0, limite);
}
