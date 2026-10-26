import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { categoriasMock } from '../../categorias/data/categorias.mock';
import { categoriaService } from '../../categorias/services/categoriaService';
import type { Existencia } from '../../inventario/models/Existencia';
import { inventarioService } from '../../inventario/services/inventarioService';
import { productosMock } from '../data/productos.mock';
import { productoService } from '../services/productoService';
import ProductosPage from './ProductosPage';

vi.mock('../services/productoService');
vi.mock('../../categorias/services/categoriaService');
vi.mock('../../inventario/services/inventarioService');

const existencias: Existencia[] = [
  { stockId: 1, productoId: 2, codigoProducto: 'PRD-OFI-002', producto: 'Bolígrafo azul', ubicacionId: 1, codigoUbicacion: 'UB-1', ubicacion: 'Central', cantidad: 25, stockMinimo: 100, bajoMinimo: true },
  { stockId: 2, productoId: 2, codigoProducto: 'PRD-OFI-002', producto: 'Bolígrafo azul', ubicacionId: 2, codigoUbicacion: 'UB-2', ubicacion: 'Norte', cantidad: 10, stockMinimo: 5, bajoMinimo: false },
];

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(productoService.listar).mockResolvedValue(productosMock);
  vi.mocked(categoriaService.listar).mockResolvedValue(categoriasMock);
  vi.mocked(inventarioService.listarExistencias).mockResolvedValue(existencias);
});

describe('ProductosPage', () => {
  it('muestra la categoría, el stock real sumado por ubicación y la alerta de mínimo', async () => {
    renderWithProviders(<ProductosPage />);
    const fila = (await screen.findByText('Bolígrafo azul')).closest('tr')!;
    expect(within(fila).getByText('Material de oficina')).toBeInTheDocument();
    expect(await within(fila).findByText('35')).toBeInTheDocument(); // 25 + 10
    expect(within(fila).getByText('Bajo mínimo')).toBeInTheDocument();

    const sinStock = screen.getByText('Detergente líquido 5L').closest('tr')!;
    expect(within(sinStock).getByText('Sin stock')).toBeInTheDocument();
  });

  it('aplica el filtro de categoría que llega en la URL (?categoria=ID)', async () => {
    renderWithProviders(<ProductosPage />, { route: '/productos?categoria=2' });
    expect(await screen.findByText('Detergente líquido 5L')).toBeInTheDocument();
    expect(screen.queryByText('Bolígrafo azul')).not.toBeInTheDocument();
  });

  it('si el stock no carga, la página funciona y lo avisa sin inventar cifras', async () => {
    vi.mocked(inventarioService.listarExistencias).mockRejectedValue(new ApiError(500, 'Error interno'));
    renderWithProviders(<ProductosPage />);
    expect(await screen.findByText('El stock no está disponible')).toBeInTheDocument();
    const fila = screen.getByText('Bolígrafo azul').closest('tr')!;
    expect(within(fila).queryByText('35')).not.toBeInTheDocument();
  });

  it('muestra la regla de negocio cuando el backend responde 422 al guardar', async () => {
    vi.mocked(productoService.obtenerPorId).mockResolvedValue(productosMock[0]);
    vi.mocked(productoService.actualizar).mockRejectedValue(
      new ApiError(422, 'La categoría 4 está inactiva y no admite productos nuevos'),
    );
    renderWithProviders(<ProductosPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'Acciones de Resma papel bond A4 75g' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));
    const dialogo = await screen.findByRole('dialog', { name: 'Editar Resma papel bond A4 75g' });
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Guardar cambios' }));

    expect(await within(dialogo).findByText('La operación no cumple una regla del inventario')).toBeInTheDocument();
    expect(within(dialogo).getByText('La categoría 4 está inactiva y no admite productos nuevos')).toBeInTheDocument();
  });

  it('elimina en lote: quita los que el backend aceptó y deja seleccionado el que rechazó con 409', async () => {
    vi.mocked(productoService.eliminar).mockImplementation((id) =>
      id === 2 ? Promise.reject(new ApiError(409, 'El producto tiene stock')) : Promise.resolve(),
    );
    renderWithProviders(<ProductosPage />);
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Seleccionar Bolígrafo azul' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Seleccionar Detergente líquido 5L' }));
    expect(screen.getByText('productos seleccionados')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    const dialogo = screen.getByRole('dialog', { name: 'Eliminar 2 productos' });
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }));

    expect(await screen.findByText('1 producto eliminado')).toBeInTheDocument();
    expect(screen.getByText('No se pudo eliminar: 1 de 2')).toBeInTheDocument();
    expect(screen.queryByText('Detergente líquido 5L')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Seleccionar Bolígrafo azul' })).toBeChecked();
  });

  it('desactiva en lote enviando el producto completo con activo=false', async () => {
    vi.mocked(productoService.actualizar).mockImplementation((id, data) => Promise.resolve({ id, ...data }));
    renderWithProviders(<ProductosPage />);
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Seleccionar Bolígrafo azul' }));
    await userEvent.click(screen.getByRole('button', { name: /Desactivar/ }));

    expect(productoService.actualizar).toHaveBeenCalledWith(2, expect.objectContaining({ codigo: 'PRD-OFI-002', activo: false }));
    expect(await screen.findByText('1 producto desactivado')).toBeInTheDocument();
  });
});
