import { afterEach, describe, expect, it, vi } from 'vitest';
import { inventarioService } from './inventarioService';

afterEach(() => {
  vi.unstubAllGlobals();
});

const stubFetch = () => vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ contenido: [] }), { status: 200 })));
const urlPedida = () => new URL(vi.mocked(fetch).mock.calls[0][0] as string);

// Nivel services: el contrato con el backend (ruta, query y señal) sin levantar Spring Boot.
describe('inventarioService', () => {
  it('pide el kardex paginado con pagina y tamano en la query y pasa la señal a fetch', async () => {
    stubFetch();
    const controller = new AbortController();

    await inventarioService.kardex(7, 2, 10, {}, controller.signal);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/inventario/kardex/7?pagina=2&tamano=10',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('envía el rango como instantes: desde la medianoche local, hasta el inicio del día SIGUIENTE (exclusive)', async () => {
    stubFetch();

    await inventarioService.kardex(7, 0, 10, { desde: '2026-10-01', hasta: '2026-10-20' });

    expect(urlPedida().searchParams.get('desde')).toBe(new Date(2026, 9, 1).toISOString());
    expect(urlPedida().searchParams.get('hasta')).toBe(new Date(2026, 9, 21).toISOString());
  });

  it('pide sólo las existencias bajo el mínimo para las alertas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('[]', { status: 200 })));

    await inventarioService.stockBajoMinimo();

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/inventario/stock?soloBajoMinimo=true', expect.anything());
  });
});
