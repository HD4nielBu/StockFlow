import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
import { existenciasMock, ubicacionesMock } from '../../../test/fixtures';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { productosMock } from '../../productos/data/productos.mock';
import { productoService } from '../../productos/services/productoService';
import { ubicacionService } from '../../ubicaciones/services/ubicacionService';
import { inventarioService } from '../services/inventarioService';
import ExistenciasPage from './ExistenciasPage';
import MovimientosPage from './MovimientosPage';

vi.mock('../services/inventarioService');
vi.mock('../../productos/services/productoService');
vi.mock('../../ubicaciones/services/ubicacionService');

const movimiento = (id: number) => ({
  movimientoId: id, ocurridoAt: '2026-10-09T04:58:48Z', ubicacion: 'UB-CENTRAL', tipo: 'ENTRADA', entrada: 120, salida: 0,
  saldoResultante: 120, referenciaTipo: 'MANUAL', registradoPor: 'almacen1', motivo: 'Carga inicial',
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(inventarioService.listarExistencias).mockResolvedValue(existenciasMock);
  vi.mocked(productoService.listar).mockResolvedValue(productosMock);
  vi.mocked(ubicacionService.listar).mockResolvedValue(ubicacionesMock);
});

describe('ExistenciasPage', () => {
  it('ordena por urgencia y clasifica cada existencia', async () => {
    renderWithProviders(<ExistenciasPage />);
    const filas = await screen.findAllByRole('row');
    expect(within(filas[1]).getByText('Bolígrafo azul')).toBeInTheDocument(); // 25 % del mínimo: primero
    expect(within(filas[1]).getByText('Bajo el mínimo')).toBeInTheDocument();
    expect(within(filas[2]).getByText('Cerca del mínimo')).toBeInTheDocument(); // 25 / 20 = 125 %
  });

  it('aplica el filtro de estado que llega en la URL', async () => {
    renderWithProviders(<ExistenciasPage />, { route: '/existencias?estado=bajo' });
    expect(await screen.findByText('Bolígrafo azul')).toBeInTheDocument();
    expect(screen.queryByText('Detergente líquido 5L')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bajo mínimo/ })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('MovimientosPage', () => {
  it('pide elegir un producto antes de consultar el kardex', async () => {
    renderWithProviders(<MovimientosPage />);
    expect(screen.getByText('Elige un producto')).toBeInTheDocument();
    expect(inventarioService.kardex).not.toHaveBeenCalled();
  });

  it('carga el kardex paginado en el servidor y traduce el código de ubicación', async () => {
    vi.mocked(inventarioService.kardex).mockResolvedValue({
      contenido: [movimiento(1)], pagina: 0, tamano: 10, totalElementos: 11, totalPaginas: 2,
    });
    renderWithProviders(<MovimientosPage />, { route: '/movimientos?producto=1' });
    expect(await screen.findByText('Carga inicial')).toBeInTheDocument();
    expect(inventarioService.kardex).toHaveBeenCalledWith(1, 0, 10, expect.any(AbortSignal)); // página 1 de la UI = 0 en la API
    expect(await screen.findByText('Almacén central')).toBeInTheDocument();
    expect(screen.getByText('+120')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(inventarioService.kardex).toHaveBeenLastCalledWith(1, 1, 10, expect.any(AbortSignal));
  });

  it('muestra el 404 del backend si el producto ya no existe', async () => {
    vi.mocked(inventarioService.kardex).mockRejectedValue(new ApiError(404, 'No existe el producto con id: 99'));
    renderWithProviders(<MovimientosPage />, { route: '/movimientos?producto=99' });
    expect(await screen.findByText('El registro ya no existe')).toBeInTheDocument();
    expect(screen.getByText(/No existe el producto con id: 99/)).toBeInTheDocument();
  });
});
