import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { healthService } from '../../../api/healthService';
import { ThemeProvider } from '../../../app/theme/ThemeProvider';
import { renderWithProviders } from '../../../test/renderWithProviders';
import ConfiguracionPage from './ConfiguracionPage';

vi.mock('../../../api/healthService');

const montar = () =>
  renderWithProviders(
    <ThemeProvider>
      <ConfiguracionPage />
    </ThemeProvider>,
  );

beforeEach(() => vi.resetAllMocks());

describe('ConfiguracionPage', () => {
  it('muestra el estado real de la API', async () => {
    vi.mocked(healthService.comprobar).mockResolvedValue({ application: 'stockflow-backend', status: 'OK', timestamp: '2026-10-09T05:00:00Z' });
    montar();
    await userEvent.click(screen.getByRole('tab', { name: 'Sistema' }));
    expect(await screen.findByText('Conectado')).toBeInTheDocument();
    expect(screen.getByText('http://localhost:8080/api')).toBeInTheDocument();
  });

  it('avisa si el backend no responde', async () => {
    vi.mocked(healthService.comprobar).mockRejectedValue(new TypeError('Failed to fetch'));
    montar();
    await userEvent.click(screen.getByRole('tab', { name: 'Sistema' }));
    expect(await screen.findByText('Sin conexión')).toBeInTheDocument();
  });

  it('los datos de la organización son demo y no se pueden editar', async () => {
    vi.mocked(healthService.comprobar).mockResolvedValue({ application: 'x', status: 'OK', timestamp: '' });
    montar();
    await userEvent.click(screen.getByRole('tab', { name: /Organización/ }));
    expect(screen.getByLabelText('Nombre de la organización')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Guardar' })).toHaveAttribute('aria-disabled', 'true');
  });
});
