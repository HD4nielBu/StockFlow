import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch, mensajeDeError } from './apiClient';

afterEach(() => {
  vi.unstubAllGlobals();
});

function responder(status: number, body?: unknown) {
  const respuesta = new Response(body === undefined ? null : JSON.stringify(body), { status });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuesta));
}

describe('apiFetch', () => {
  it('devuelve el JSON cuando la respuesta es 2xx', async () => {
    responder(200, [{ id: 1 }]);
    await expect(apiFetch('/categorias')).resolves.toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/categorias', expect.anything());
  });

  it('devuelve undefined en un 204 (DELETE exitoso)', async () => {
    responder(204);
    await expect(apiFetch('/categorias/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('convierte el ApiErrorResponse del backend en ApiError con status y fieldErrors', async () => {
    responder(400, {
      status: 400,
      error: 'Bad Request',
      message: 'La solicitud contiene datos inválidos',
      path: '/api/categorias',
      fieldErrors: { codigo: 'El código es obligatorio' },
    });
    const error = await apiFetch('/categorias', { method: 'POST', body: '{}' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).fieldErrors.codigo).toBe('El código es obligatorio');
  });
});

describe('mensajeDeError', () => {
  it('explica que el backend no responde cuando fetch lanza TypeError', () => {
    expect(mensajeDeError(new TypeError('Failed to fetch'))).toMatch(/No se pudo conectar con el backend/);
  });
});
