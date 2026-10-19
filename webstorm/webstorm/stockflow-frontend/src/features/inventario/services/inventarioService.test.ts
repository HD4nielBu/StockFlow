import { describe, expect, it } from 'vitest';
import { queryStock } from './inventarioService';

describe('queryStock', () => {
  it('no agrega parámetros cuando no hay filtros', () => {
    expect(queryStock({})).toBe('');
  });

  it('incluye sólo los filtros con valor', () => {
    expect(queryStock({ productoId: 3, soloBajoMinimo: true })).toBe('?productoId=3&soloBajoMinimo=true');
    expect(queryStock({ ubicacionId: 2, soloBajoMinimo: false })).toBe('?ubicacionId=2');
  });
});
