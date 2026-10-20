import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PaginaResponse } from '../../../api/PaginaResponse';
import type { MovimientoKardex } from '../models/MovimientoKardex';
import { inventarioService } from '../services/inventarioService';
import { useKardex } from './useKardex';

vi.mock('../services/inventarioService');

type Pagina = PaginaResponse<MovimientoKardex>;

/** Promesa que el test resuelve cuando quiere: simula una respuesta del servidor que llega tarde. */
function diferida() {
  let resolver!: (valor: Pagina) => void;
  const promesa = new Promise<Pagina>((r) => (resolver = r));
  return { promesa, resolver };
}

const pagina = (numero: number) => ({ contenido: [], pagina: numero }) as unknown as Pagina;

beforeEach(() => {
  vi.mocked(inventarioService.kardex).mockReset();
});

// G08 (pregunta 39): una respuesta vieja nunca debe pisar a la actual.
describe('useKardex', () => {
  it('descarta la respuesta de la página anterior aunque llegue después', async () => {
    const p0 = diferida();
    const p1 = diferida();
    vi.mocked(inventarioService.kardex).mockReturnValueOnce(p0.promesa).mockReturnValueOnce(p1.promesa);

    const { result, rerender } = renderHook(({ pag }) => useKardex(7, pag, 10), { initialProps: { pag: 0 } });
    rerender({ pag: 1 });

    // La página 0 se pidió con una señal que el cleanup abortó al cambiar a la página 1
    const senalPagina0 = vi.mocked(inventarioService.kardex).mock.calls[0][4];
    expect(senalPagina0?.aborted).toBe(true);

    // Llega primero la página 1 y DESPUÉS la página 0 (el servidor ya había respondido)
    await act(async () => p1.resolver(pagina(1)));
    await act(async () => p0.resolver(pagina(0)));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(pagina(1));
  });

  it('no pide nada mientras no hay producto elegido', () => {
    const { result } = renderHook(() => useKardex(null, 0, 10));

    expect(result.current).toMatchObject({ data: null, loading: false, error: null });
    expect(inventarioService.kardex).not.toHaveBeenCalled();
  });

  it('devuelve el error crudo para que la Page lo traduzca', async () => {
    const error = new Error('No existe el producto');
    vi.mocked(inventarioService.kardex).mockRejectedValue(error);

    const { result } = renderHook(() => useKardex(99, 0, 10));

    await waitFor(() => expect(result.current.error).toBe(error));
    expect(result.current.data).toBeNull();
  });
});
