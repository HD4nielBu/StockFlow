import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { productosMock } from '../../productos/data/productos.mock';
import { productoService } from '../../productos/services/productoService';
import { categoriasMock } from '../data/categorias.mock';
import { categoriaService } from '../services/categoriaService';
import CategoriasPage from './CategoriasPage';

// G10: se reemplazan los services; la prueba no depende de que el backend esté encendido
vi.mock('../services/categoriaService');
vi.mock('../../productos/services/productoService');

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(categoriaService.listar).mockResolvedValue(categoriasMock);
  vi.mocked(productoService.listar).mockResolvedValue(productosMock);
});

/** Abre el menú "⋯" de la fila y elige una acción. */
async function accion(nombre: string, opcion: 'Editar' | 'Eliminar') {
  await userEvent.click(await screen.findByRole('button', { name: `Acciones de ${nombre}` }));
  await userEvent.click(screen.getByRole('menuitem', { name: opcion }));
}

describe('CategoriasPage', () => {
  it('muestra las categorías y cuántos productos tiene cada una', async () => {
    renderWithProviders(<CategoriasPage />);
    const fila = (await screen.findByText('Material de oficina')).closest('tr')!;
    expect(within(fila).getByText('CAT-OFI')).toBeInTheDocument();
    expect(within(fila).getByText('2')).toBeInTheDocument(); // 2 productos en el mock
  });

  it('filtra por texto sin distinguir tildes', async () => {
    renderWithProviders(<CategoriasPage />);
    await screen.findByText('Material de oficina');
    await userEvent.type(screen.getByLabelText('Buscar categoría'), 'categoria retirada');
    expect(screen.getByText('CAT-OLD')).toBeInTheDocument();
    expect(screen.queryByText('CAT-OFI')).not.toBeInTheDocument();
  });

  it('filtra por estado con el control segmentado', async () => {
    renderWithProviders(<CategoriasPage />);
    await screen.findByText('Material de oficina');
    await userEvent.click(screen.getByRole('button', { name: /Inactivas/ }));
    expect(screen.getByText('CAT-OLD')).toBeInTheDocument();
    expect(screen.queryByText('CAT-OFI')).not.toBeInTheDocument();
  });

  it('conserva la fila y muestra el mensaje del backend cuando DELETE responde 409', async () => {
    vi.mocked(categoriaService.eliminar).mockRejectedValue(
      new ApiError(409, 'La categoría tiene productos asociados y no puede eliminarse'),
    );
    renderWithProviders(<CategoriasPage />);
    await accion('Material de oficina', 'Eliminar');
    const dialogo = screen.getByRole('dialog', { name: 'Eliminar categoría' });
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }));

    expect(await screen.findByText('La categoría tiene productos asociados y no puede eliminarse')).toBeInTheDocument();
    expect(screen.getByText('CAT-OFI')).toBeInTheDocument();
  });

  it('quita la fila sólo después de que el backend confirma el DELETE', async () => {
    vi.mocked(categoriaService.eliminar).mockResolvedValue(undefined);
    renderWithProviders(<CategoriasPage />);
    await accion('Seguridad industrial', 'Eliminar');
    await userEvent.click(within(screen.getByRole('dialog', { name: 'Eliminar categoría' })).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(screen.queryByText('CAT-EPP')).not.toBeInTheDocument());
    expect(categoriaService.eliminar).toHaveBeenCalledWith(3);
    expect(screen.getByText('Categoría CAT-EPP eliminada')).toBeInTheDocument();
  });

  it('crea una categoría desde el modal con POST y la agrega a la tabla', async () => {
    vi.mocked(categoriaService.crear).mockResolvedValue({
      id: 9, codigo: 'CAT-NEW', nombre: 'Herramientas', descripcion: null, activo: true,
    });
    renderWithProviders(<CategoriasPage />);
    await screen.findByText('Material de oficina');
    await userEvent.click(screen.getByRole('button', { name: 'Nueva categoría' }));
    const dialogo = screen.getByRole('dialog', { name: 'Nueva categoría' });
    await userEvent.type(within(dialogo).getByLabelText(/Código/), 'CAT-NEW');
    await userEvent.type(within(dialogo).getByLabelText(/Nombre/), 'Herramientas');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Crear categoría' }));

    expect(categoriaService.crear).toHaveBeenCalledWith({ codigo: 'CAT-NEW', nombre: 'Herramientas', descripcion: null });
    expect(await screen.findByText('Categoría CAT-NEW creada')).toBeInTheDocument();
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
  });

  it('no envía el formulario si falta un campo obligatorio y marca el campo', async () => {
    renderWithProviders(<CategoriasPage />);
    await screen.findByText('Material de oficina');
    await userEvent.click(screen.getByRole('button', { name: 'Nueva categoría' }));
    const dialogo = screen.getByRole('dialog', { name: 'Nueva categoría' });
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Crear categoría' }));

    expect(within(dialogo).getByText('El código es obligatorio')).toBeInTheDocument();
    expect(within(dialogo).getByLabelText(/Código/)).toHaveAttribute('aria-invalid', 'true');
    expect(categoriaService.crear).not.toHaveBeenCalled();
  });

  it('muestra en el modal el conflicto 409 del backend al crear', async () => {
    vi.mocked(categoriaService.crear).mockRejectedValue(new ApiError(409, 'Ya existe una categoría con el código CAT-OFI'));
    renderWithProviders(<CategoriasPage />);
    await screen.findByText('Material de oficina');
    await userEvent.click(screen.getByRole('button', { name: 'Nueva categoría' }));
    const dialogo = screen.getByRole('dialog', { name: 'Nueva categoría' });
    await userEvent.type(within(dialogo).getByLabelText(/Código/), 'CAT-OFI');
    await userEvent.type(within(dialogo).getByLabelText(/Nombre/), 'Duplicada');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Crear categoría' }));

    expect(await within(dialogo).findByText('Ya existe una categoría con el código CAT-OFI')).toBeInTheDocument();
  });

  it('edita con los datos actuales del servidor (GET /{id}) y guarda con PUT', async () => {
    const actual = { ...categoriasMock[1], nombre: 'Limpieza e higiene' };
    vi.mocked(categoriaService.obtenerPorId).mockResolvedValue(actual);
    vi.mocked(categoriaService.actualizar).mockResolvedValue({ ...actual, nombre: 'Limpieza general' });
    renderWithProviders(<CategoriasPage />);
    await accion('Limpieza', 'Editar');

    const dialogo = await screen.findByRole('dialog', { name: 'Editar Limpieza e higiene' });
    const nombre = within(dialogo).getByLabelText(/Nombre/);
    expect(nombre).toHaveValue('Limpieza e higiene');
    await userEvent.clear(nombre);
    await userEvent.type(nombre, 'Limpieza general');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Guardar cambios' }));

    expect(categoriaService.actualizar).toHaveBeenCalledWith(2, expect.objectContaining({ nombre: 'Limpieza general', activo: true }));
    expect(await screen.findByText('Categoría CAT-LIM actualizada')).toBeInTheDocument();
  });
});
