import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRemoteData } from './useRemoteData';

describe('useRemoteData', () => {
  it('aborta la petición anterior cuando cambia la clave y muestra sólo la respuesta nueva', async () => {
    const señales: AbortSignal[] = [];
    const cargar = vi.fn((signal: AbortSignal) => {
      señales.push(signal);
      return new Promise<string>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('cancelado', 'AbortError')));
        if (señales.length > 1) resolve(`respuesta ${señales.length}`);
      });
    });

    const { result, rerender } = renderHook(({ clave }) => useRemoteData(cargar, '', clave), {
      initialProps: { clave: 'tipo=DEPOSITO' },
    });
    rerender({ clave: 'tipo=ALMACEN_CENTRAL' });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(señales[0].aborted).toBe(true); // la primera petición se canceló
    expect(result.current.data).toMatch(/^respuesta/);
    expect(result.current.error).toBe(''); // AbortError no es un error funcional
  });

  it('muestra el mensaje del backend cuando la carga falla', async () => {
    const cargar = vi.fn().mockRejectedValue(new Error('Producto 99 no encontrado'));
    const { result } = renderHook(() => useRemoteData(cargar, [], 'producto=99'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Producto 99 no encontrado');
  });
});
