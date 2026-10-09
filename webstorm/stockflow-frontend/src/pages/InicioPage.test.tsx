import { screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../api/apiClient';
import { categoriasMock } from '../features/categorias/data/categorias.mock';
import { categoriaService } from '../features/categorias/services/categoriaService';
import type { Existencia } from '../features/inventario/models/Existencia';
import { inventarioService } from '../features/inventario/services/inventarioService';
import { productosMock } from '../features/productos/data/productos.mock';
import { productoService } from '../features/productos/services/productoService';
import { renderWithProviders } from '../test/renderWithProviders';
import DashboardPage from './DashboardPage';
import InicioPage from './InicioPage';

vi.mock('../features/categorias/services/categoriaService');
vi.mock('../features/productos/services/productoService');
vi.mock('../features/inventario/services/inventarioService');

const existencias: Existencia[] = [
  { stockId: 1, productoId: 2, codigoProducto: 'PRD-OFI-002', producto: 'Bolígrafo azul', ubicacionId: 2, codigoUbicacion: 'UB-N', ubicacion: 'Depósito Norte', cantidad: 25, stockMinimo: 100, bajoMinimo: true },
  { stockId: 2, productoId: 1, codigoProducto: 'PRD-OFI-001', producto: 'Resma papel bond A4 75g', ubicacionId: 1, codigoUbicacion: 'UB-C', ubicacion: 'Almacén central', cantidad: 200, stockMinimo: 20, bajoMinimo: false },
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(categoriaService.listar).mockResolvedValue(categoriasMock);
  vi.mocked(productoService.listar).mockResolvedValue(productosMock);
  vi.mocked(inventarioService.listarExistencias).mockResolvedValue(existencias);
});

describe('InicioPage', () => {
  it('resume el inventario real: totales, alertas y últimos productos', async () => {
    renderWithProviders(<InicioPage />);
    const indicadores = await screen.findByRole('region', { name: 'Indicadores' });
    expect(await within(indicadores).findByText('3 activos')).toBeInTheDocument(); // 3 productos en el mock
    expect(within(indicadores).getByText('3 activas')).toBeInTheDocument(); // 3 de 4 categorías activas
    expect(screen.getByRole('img', { name: '25 % del stock mínimo' })).toBeInTheDocument();
    expect(screen.getByText('Detergente líquido 5L')).toBeInTheDocument(); // último registrado (id 3)
  });

  it('ofrece los accesos rápidos de creación', async () => {
    renderWithProviders(<InicioPage />);
    const accesos = screen.getByRole('navigation', { name: 'Accesos rápidos' });
    expect(within(accesos).getByRole('link', { name: /Nuevo producto/ })).toHaveAttribute('href', '/productos');
    expect(within(accesos).getByRole('link', { name: /Nueva categoría/ })).toHaveAttribute('href', '/categorias');
  });

  it('avisa si una de las fuentes falla en lugar de mostrar ceros como si fueran reales', async () => {
    vi.mocked(inventarioService.listarExistencias).mockRejectedValue(new ApiError(500, 'Error interno'));
    renderWithProviders(<InicioPage />);
    expect(await screen.findByText('Parte de la información no se pudo cargar')).toBeInTheDocument();
  });
});

describe('DashboardPage', () => {
  it('calcula los indicadores y los gráficos a partir de los datos', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('50 % de las existencias')).toBeInTheDocument(); // 1 de 2 bajo mínimo
    const porCategoria = screen.getByRole('list', { name: 'Productos por categoría' });
    expect(within(porCategoria).getByRole('link', { name: /Material de oficina/ })).toHaveAttribute('href', '/productos?categoria=1');
    expect(screen.getByRole('img', { name: /2 existencias: 1 bajo el mínimo/ })).toBeInTheDocument();
  });
});
