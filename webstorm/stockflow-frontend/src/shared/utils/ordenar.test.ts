import { describe, expect, it } from 'vitest';
import { ordenar, siguienteOrden } from './ordenar';

const filas = [
  { nombre: 'Ñandú', precio: 10 },
  { nombre: 'árbol', precio: null },
  { nombre: 'Item 10', precio: 2 },
  { nombre: 'Item 9', precio: 30 },
];
const valores = { nombre: (f: (typeof filas)[number]) => f.nombre, precio: (f: (typeof filas)[number]) => f.precio };

describe('ordenar', () => {
  it('ordena texto sin distinguir tildes ni mayúsculas y con números naturales', () => {
    expect(ordenar(filas, { key: 'nombre', dir: 'asc' }, valores).map((f) => f.nombre)).toEqual(['árbol', 'Item 9', 'Item 10', 'Ñandú']);
  });

  it('ordena números y deja los vacíos al final en ambos sentidos', () => {
    expect(ordenar(filas, { key: 'precio', dir: 'asc' }, valores).map((f) => f.precio)).toEqual([2, 10, 30, null]);
    expect(ordenar(filas, { key: 'precio', dir: 'desc' }, valores).map((f) => f.precio)).toEqual([30, 10, 2, null]);
  });

  it('sin orden (o columna desconocida) devuelve los datos tal cual', () => {
    expect(ordenar(filas, null, valores)).toBe(filas);
    expect(ordenar(filas, { key: 'otra', dir: 'asc' }, valores)).toBe(filas);
  });
});

describe('siguienteOrden', () => {
  it('cicla ascendente → descendente → sin orden, y otra columna reinicia', () => {
    expect(siguienteOrden(null, 'a')).toEqual({ key: 'a', dir: 'asc' });
    expect(siguienteOrden({ key: 'a', dir: 'asc' }, 'a')).toEqual({ key: 'a', dir: 'desc' });
    expect(siguienteOrden({ key: 'a', dir: 'desc' }, 'a')).toBeNull();
    expect(siguienteOrden({ key: 'a', dir: 'desc' }, 'b')).toEqual({ key: 'b', dir: 'asc' });
  });
});
