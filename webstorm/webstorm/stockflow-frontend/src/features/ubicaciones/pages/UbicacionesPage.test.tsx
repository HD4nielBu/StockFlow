import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
import { inventarioService } from '../../inventario/services/inventarioService';
import { ubicacionesMock } from '../data/ubicaciones.mock';
import { ubicacionService } from '../services/ubicacionService';
import UbicacionesPage from './UbicacionesPage';

vi.mock('../services/ubicacionService');
vi.mock('../../inventario/services/inventarioService');

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(ubicacionService.listar).mockResolvedValue(ubicacionesMock);
  vi.mocked(inventarioService.listarStock).mockResolvedValue([]);
});

describe('UbicacionesPage', () => {
  it('lista las ubicaciones del backend', async () => {
    render(<UbicacionesPage />);
    expect(await screen.findByText('UB-CENTRAL')).toBeInTheDocument();
    expect(screen.getByText('Depósito Norte')).toBeInTheDocument();
  });

  it('pide al backend el tipo elegido en el filtro', async () => {
    render(<UbicacionesPage />);
    await screen.findByText('UB-CENTRAL');
    await userEvent.selectOptions(screen.getByLabelText('Tipo', { selector: 'select:not([name])' }), 'DEPOSITO');
    expect(ubicacionService.listar).toHaveBeenLastCalledWith(expect.any(AbortSignal), 'DEPOSITO');
  });

  it('agrega la ubicación que devuelve el backend al registrarla', async () => {
    vi.mocked(ubicacionService.crear).mockResolvedValue({
      id: 9, codigo: 'UB-DEP-ESTE', nombre: 'Depósito Este', tipo: 'DEPOSITO', direccion: null, activo: true,
    });
    render(<UbicacionesPage />);
    await screen.findByText('UB-CENTRAL');
    const form = screen.getByRole('form', { name: 'Formulario de ubicación' });
    await userEvent.type(within(form).getByLabelText('Código'), 'ub-dep-este');
    await userEvent.type(within(form).getByLabelText('Nombre'), 'Depósito Este');
    await userEvent.click(within(form).getByRole('button', { name: 'Registrar ubicación' }));

    expect(ubicacionService.crear).toHaveBeenCalledWith({ codigo: 'UB-DEP-ESTE', nombre: 'Depósito Este', tipo: 'DEPOSITO', direccion: null });
    expect(await screen.findByText('UB-DEP-ESTE')).toBeInTheDocument();
  });

  it('muestra el 409 del backend cuando ya existe un almacén central', async () => {
    vi.mocked(ubicacionService.crear).mockRejectedValue(new ApiError(409, 'Ya existe un almacén central activo'));
    render(<UbicacionesPage />);
    await screen.findByText('UB-CENTRAL');
    const form = screen.getByRole('form', { name: 'Formulario de ubicación' });
    await userEvent.type(within(form).getByLabelText('Código'), 'UB-CENTRAL-2');
    await userEvent.type(within(form).getByLabelText('Nombre'), 'Otro central');
    await userEvent.selectOptions(within(form).getByLabelText('Tipo'), 'ALMACEN_CENTRAL');
    await userEvent.click(within(form).getByRole('button', { name: 'Registrar ubicación' }));

    expect(await screen.findByText('Ya existe un almacén central activo')).toBeInTheDocument();
  });
});
