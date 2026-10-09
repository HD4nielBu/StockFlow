import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../../app/theme/ThemeProvider';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { DEMO_SESSION_KEY } from '../demoSessionContext';
import PerfilPage from './PerfilPage';

const montar = () =>
  renderWithProviders(
    <ThemeProvider>
      <PerfilPage />
    </ThemeProvider>,
  );

afterEach(() => sessionStorage.clear());

describe('PerfilPage', () => {
  it('sin sesión invita a entrar en modo demo', () => {
    montar();
    expect(screen.getByText('No has entrado en modo demostración')).toBeInTheDocument();
  });

  it('edita el nombre mostrado y lo guarda sólo en el navegador', async () => {
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ nombre: 'Maria Lopez', correo: 'maria@uni.edu' }));
    montar();
    const nombre = screen.getByLabelText(/Nombre para mostrar/);
    await userEvent.clear(nombre);
    await userEvent.type(nombre, 'María López');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    expect(await screen.findByText('Perfil actualizado')).toBeInTheDocument();
    expect(JSON.parse(sessionStorage.getItem(DEMO_SESSION_KEY)!).nombre).toBe('María López');
  });

  it('las acciones de seguridad aparecen como no disponibles, sin aparentar que funcionan', async () => {
    montar();
    await userEvent.click(screen.getByRole('tab', { name: 'Seguridad' }));
    const botones = screen.getAllByRole('button', { name: 'No disponible' });
    expect(botones).toHaveLength(2);
    botones.forEach((b) => expect(b).toBeDisabled());
  });
});
