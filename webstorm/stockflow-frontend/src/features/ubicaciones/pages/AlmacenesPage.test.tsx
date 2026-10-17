import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
import { existenciasMock, ubicacionesMock } from '../../../test/fixtures';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { inventarioService } from '../../inventario/services/inventarioService';
import { ubicacionService } from '../services/ubicacionService';
import AlmacenesPage from './AlmacenesPage';

vi.mock('../services/ubicacionService');
vi.mock('../../inventario/services/inventarioService');

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(ubicacionService.listar).mockResolvedValue(ubicacionesMock);
  vi.mocked(inventarioService.listarExistencias).mockResolvedValue(existenciasMock);
});

async function abrirFormulario() {
  await screen.findByText('Depósito Norte');
  await userEvent.click(screen.getByRole('button', { name: 'Nueva ubicación' }));
  return screen.getByRole('dialog', { name: 'Nueva ubicación' });
}

describe('AlmacenesPage', () => {
  it('muestra cada ubicación con sus cifras reales de stock y sin acciones que la API no tiene', async () => {
    renderWithProviders(<AlmacenesPage />);
    const central = (await screen.findByText('Almacén central', { selector: 'strong' })).closest('li')!;
    expect(within(central).getByText('2')).toBeInTheDocument(); // 2 productos con stock
    expect(screen.queryByRole('button', { name: /Eliminar|Editar/ })).not.toBeInTheDocument();
  });

  it('no deja elegir un segundo almacén central', async () => {
    renderWithProviders(<AlmacenesPage />);
    const dialogo = await abrirFormulario();
    expect(within(dialogo).getByRole('option', { name: 'Almacén central' })).toBeDisabled();
  });

  it('crea la ubicación con POST y la agrega a la lista', async () => {
    vi.mocked(ubicacionService.crear).mockResolvedValue({ id: 9, codigo: 'UB-DEP-ESTE', nombre: 'Depósito Este', tipo: 'DEPOSITO', direccion: null, activo: true });
    renderWithProviders(<AlmacenesPage />);
    const dialogo = await abrirFormulario();
    await userEvent.type(within(dialogo).getByLabelText(/Código/), 'UB-DEP-ESTE');
    await userEvent.type(within(dialogo).getByLabelText(/Nombre/), 'Depósito Este');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Crear ubicación' }));

    expect(ubicacionService.crear).toHaveBeenCalledWith({ codigo: 'UB-DEP-ESTE', nombre: 'Depósito Este', tipo: 'DEPOSITO', direccion: null });
    expect(await screen.findByText('Ubicación UB-DEP-ESTE creada')).toBeInTheDocument();
    expect(screen.getByText('Depósito Este', { selector: 'strong' })).toBeInTheDocument();
  });

  it('muestra el conflicto 409 del backend en el formulario', async () => {
    vi.mocked(ubicacionService.crear).mockRejectedValue(new ApiError(409, 'Ya existe una ubicación con el código UB-CENTRAL'));
    renderWithProviders(<AlmacenesPage />);
    const dialogo = await abrirFormulario();
    await userEvent.type(within(dialogo).getByLabelText(/Código/), 'UB-CENTRAL');
    await userEvent.type(within(dialogo).getByLabelText(/Nombre/), 'Repetida');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Crear ubicación' }));
    expect(await within(dialogo).findByText('Ya existe una ubicación con el código UB-CENTRAL')).toBeInTheDocument();
  });
});
