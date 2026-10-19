import { describe, expect, it } from 'vitest';
import { normalizar, paginar } from './paginar';

const numeros = Array.from({ length: 12 }, (_, i) => i + 1);

describe('paginar', () => {
  it('devuelve los elementos de la página pedida', () => {
    const r = paginar(numeros, 2, 5);
    expect(r.items).toEqual([6, 7, 8, 9, 10]);
    expect(r.totalPaginas).toBe(3);
    expect(r.totalItems).toBe(12);
  });

  it('ajusta una página fuera de rango a la última válida', () => {
    expect(paginar(numeros, 9, 5).pagina).toBe(3);
  });

  it('una lista vacía tiene una sola página', () => {
    expect(paginar([], 1, 10)).toEqual({ items: [], pagina: 1, totalPaginas: 1, totalItems: 0 });
  });
});

describe('normalizar', () => {
  it('ignora tildes y mayúsculas', () => {
    expect(normalizar('  Categoría ')).toBe('categoria');
    expect(normalizar(null)).toBe('');
  });
});
