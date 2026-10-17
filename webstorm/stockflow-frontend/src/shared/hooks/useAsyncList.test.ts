import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAsyncList } from './useAsyncList';

// G08/G10: nivel hooks. Se prueba la mecánica (data/loading/error, cleanup y reload) con loaders simulados.
describe('useAsyncList', () => {
  it('pasa de loading a data cuando el loader responde', async () => {
    const loader = vi.fn().mockResolvedValue([{ id: 1 }]);
    const { result } = renderHook(() => useAsyncList(loader));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual([{ id: 1 }]);
    expect(result.current.error).toBe('');
  });

  it('aborta la petición en el cleanup al desmontar', () => {
    let senal: AbortSignal | undefined;
    const loader = vi.fn((signal: AbortSignal) => {
      senal = signal;
      return new Promise<never>(() => {});
    });
    const { unmount } = renderHook(() => useAsyncList(loader));

    expect(senal?.aborted).toBe(false);
    unmount();
    expect(senal?.aborted).toBe(true);
  });

  it('no muestra un AbortError como error del sistema', async () => {
    const loader = vi.fn().mockRejectedValue(new DOMException('cancelada', 'AbortError'));
    const { result } = renderHook(() => useAsyncList(loader));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('');
  });

  it('guarda el mensaje cuando el loader falla de verdad', async () => {
    const loader = vi.fn().mockRejectedValue(new Error('El servidor tuvo un problema'));
    const { result } = renderHook(() => useAsyncList(loader));

    await waitFor(() => expect(result.current.error).toBe('El servidor tuvo un problema'));
    expect(result.current.data).toEqual([]);
  });

  it('reload() vuelve a ejecutar el Effect y aborta la carga anterior', async () => {
    const senales: AbortSignal[] = [];
    const loader = vi.fn((signal: AbortSignal) => {
      senales.push(signal);
      return Promise.resolve([{ id: senales.length }]);
    });
    const { result } = renderHook(() => useAsyncList(loader));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.reload());

    await waitFor(() => expect(result.current.data).toEqual([{ id: 2 }]));
    expect(loader).toHaveBeenCalledTimes(2);
    expect(senales[0].aborted).toBe(true);
  });

  it('una respuesta vieja que llega tarde no pisa a la nueva (race condition)', async () => {
    const resolvers: ((v: { id: number }[]) => void)[] = [];
    const loader = vi.fn(() => new Promise<{ id: number }[]>((r) => resolvers.push(r)));
    const { result } = renderHook(() => useAsyncList(loader));

    act(() => result.current.reload());
    await act(async () => resolvers[1]([{ id: 2 }]));
    await act(async () => resolvers[0]([{ id: 1 }]));

    expect(result.current.data).toEqual([{ id: 2 }]);
    expect(result.current.loading).toBe(false);
  });
});
