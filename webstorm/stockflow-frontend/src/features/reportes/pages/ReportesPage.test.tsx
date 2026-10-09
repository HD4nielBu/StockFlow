import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { existenciasMock } from '../../../test/fixtures';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { categoriasMock } from '../../categorias/data/categorias.mock';
import { categoriaService } from '../../categorias/services/categoriaService';
import { inventarioService } from '../../inventario/services/inventarioService';
import { productosMock } from '../../productos/data/productos.mock';
import { productoService } from '../../productos/services/productoService';
import * as csv from '../utils/csv';
import ReportesPage from './ReportesPage';

vi.mock('../../categorias/services/categoriaService');
vi.mock('../../productos/services/productoService');
vi.mock('../../inventario/services/inventarioService');

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(categoriaService.listar).mockResolvedValue(categoriasMock);
  vi.mocked(productoService.listar).mockResolvedValue(productosMock);
  vi.mocked(inventarioService.listarExistencias).mockResolvedValue(existenciasMock);
});

describe('ReportesPage', () => {
  it('descarga el CSV de stock bajo con los datos reales', async () => {
    const descargar = vi.spyOn(csv, 'descargarCsv').mockImplementation(() => {});
    renderWithProviders(<ReportesPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'Descargar Stock bajo el mínimo en CSV' }));

    const [nombre, contenido] = descargar.mock.calls[0];
    expect(nombre).toMatch(/^stockflow-stock-bajo-\d{4}-\d{2}-\d{2}\.csv$/);
    expect(contenido.split('\r\n')).toEqual([
      'Código producto;Producto;Código ubicación;Ubicación;Cantidad;Stock mínimo;Estado',
      'PRD-OFI-002;Bolígrafo azul;UB-DEP-NOR;Depósito Norte;25;100;Bajo el mínimo',
    ]);
    expect(await screen.findByText('Stock bajo el mínimo descargado')).toBeInTheDocument();
  });

  it('marca como no disponibles los reportes que necesitan backend', async () => {
    renderWithProviders(<ReportesPage />);
    const pendientes = screen.getByRole('list', { name: 'Reportes no disponibles' });
    expect(pendientes.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getAllByText('No disponible')).toHaveLength(3);
  });
});
