import { afterEach, describe, expect, it, vi } from 'vitest';
import { inventarioService } from './inventarioService';

afterEach(() => {
  vi.unstubAllGlobals();
});

// Nivel services: el contrato con el backend (ruta, query y señal) sin levantar Spring Boot.
describe('inventarioService', () => {
  it('pide el kardex paginado con pagina y tamano en la query y pasa la señal a fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ contenido: [] }), { status: 200 })));
    const controller = new AbortController();

    await inventarioService.kardex(7, 2, 10, controller.signal);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/inventario/kardex/7?pagina=2&tamano=10',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('pide sólo las existencias bajo el mínimo para las alertas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]', { status: 200 })));

    await inventarioService.stockBajoMinimo();

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/inventario/stock?soloBajoMinimo=true', expect.anything());
  });
});
