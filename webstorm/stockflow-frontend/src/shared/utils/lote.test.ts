import { describe, expect, it, vi } from 'vitest';
import { avisarLote, enLote } from './lote';

describe('enLote', () => {
  it('separa éxitos y fallos sin que un rechazo corte a los demás', async () => {
    const r = await enLote([1, 2, 3], (n) => (n === 2 ? Promise.reject(new Error('409')) : Promise.resolve(n * 10)));
    expect(r.exitos).toEqual([{ item: 1, valor: 10 }, { item: 3, valor: 30 }]);
    expect(r.fallos.map((f) => f.item)).toEqual([2]);
  });
});

describe('avisarLote', () => {
  it('avisa la cantidad hecha y lista los que fallaron', () => {
    const toast = { success: vi.fn(), error: vi.fn(), info: vi.fn() };
    avisarLote(
      toast,
      { exitos: [{ item: 'A', valor: null }], fallos: [{ item: 'B', error: new Error('Tiene stock') }] },
      { hecho: (n) => `${n} eliminados`, accion: 'eliminar' },
      (x) => x,
    );
    expect(toast.success).toHaveBeenCalledWith('1 eliminados');
    expect(toast.error).toHaveBeenCalledWith({ title: 'No se pudo eliminar: 1 de 2', description: expect.stringContaining('B.') });
  });
});
