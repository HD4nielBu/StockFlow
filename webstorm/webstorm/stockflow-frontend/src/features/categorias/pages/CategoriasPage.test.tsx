import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
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

describe('CategoriasPage', () => {
  it('muestra las categorías y cuántos productos tiene cada una', async () => {
    render(<CategoriasPage />);
    const fila = (await screen.findByText('Material de oficina')).closest('tr')!;
    expect(within(fila).getByText('CAT-OFI')).toBeInTheDocument();
    expect(within(fila).getByText('2')).toBeInTheDocument(); // 2 productos en el mock
  });

  it('filtra por texto sin distinguir tildes', async () => {
    render(<CategoriasPage />);
    await screen.findByText('Material de oficina');
    await userEvent.type(screen.getByLabelText('Buscar categoría'), 'categoria retirada');
    expect(screen.getByText('CAT-OLD')).toBeInTheDocument();
    expect(screen.queryByText('CAT-OFI')).not.toBeInTheDocument();
  });

  it('conserva la fila y muestra el mensaje del backend cuando DELETE responde 409', async () => {
    vi.mocked(categoriaService.eliminar).mockRejectedValue(
      new ApiError(409, 'La categoría tiene productos asociados y no puede eliminarse'),
    );
    render(<CategoriasPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'Eliminar Material de oficina' }));
    const dialogo = screen.getByRole('dialog');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }));

    expect(await screen.findByText('La categoría tiene productos asociados y no puede eliminarse')).toBeInTheDocument();
    expect(screen.getByText('CAT-OFI')).toBeInTheDocument();
  });

  it('quita la fila sólo después de que el backend confirma el DELETE', async () => {
    vi.mocked(categoriaService.eliminar).mockResolvedValue(undefined);
    render(<CategoriasPage />);
    await userEvent.click(await screen.findByRole('button', { name: 'Eliminar Seguridad industrial' }));
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }));

    await waitFor(() => expect(screen.queryByText('CAT-EPP')).not.toBeInTheDocument());
    expect(categoriaService.eliminar).toHaveBeenCalledWith(3);
    expect(screen.getByText('Categoría CAT-EPP eliminada')).toBeInTheDocument();
  });
});
