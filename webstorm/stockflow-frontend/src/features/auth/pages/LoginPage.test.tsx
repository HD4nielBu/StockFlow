import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../api/apiClient';
import { healthService } from '../../../api/healthService';
import { ToastProvider } from '../../../components/ui/toast/ToastProvider';
import UserMenu from '../../../components/common/UserMenu';
import { DEMO_SESSION_KEY } from '../demoSessionContext';
import { DemoSessionProvider } from '../DemoSessionProvider';
import LoginPage from './LoginPage';

vi.mock('../../../api/healthService');

function montar(ruta = '/login') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <DemoSessionProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<UserMenu variant="sidebar" />} />
          </Routes>
        </ToastProvider>
      </DemoSessionProvider>
    </MemoryRouter>,
  );
}

async function completar(identificador: string, password: string) {
  await userEvent.type(screen.getByLabelText(/Correo o usuario/), identificador);
  await userEvent.type(screen.getByLabelText(/^Contraseña/), password);
}

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  vi.mocked(healthService.comprobar).mockResolvedValue({ application: 'stockflow', status: 'OK', timestamp: '' });
});
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('LoginPage (modo demostración)', () => {
  it('se identifica como demostración y no como acceso real', () => {
    montar();
    expect(screen.getByText(/StockFlow aún no tiene inicio de sesión real/)).toBeInTheDocument();
  });

  it('valida el formato antes de entrar y no consulta al servidor', async () => {
    montar();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));
    expect(screen.getByText('Escribe tu correo o nombre de usuario')).toBeInTheDocument();
    expect(screen.getByText('Escribe una contraseña')).toBeInTheDocument();
    expect(healthService.comprobar).not.toHaveBeenCalled();
  });

  it('entra, guarda sólo nombre y correo (nunca la contraseña) y por defecto sólo en esta pestaña', async () => {
    montar();
    await completar('maria.lopez@uni.edu', 'secreto-123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));

    expect(await screen.findByRole('button', { name: 'Cuenta: Maria Lopez' })).toBeInTheDocument();
    const guardado = sessionStorage.getItem(DEMO_SESSION_KEY)!;
    expect(JSON.parse(guardado)).toEqual({ nombre: 'Maria Lopez', correo: 'maria.lopez@uni.edu' });
    expect(guardado).not.toContain('secreto');
    expect(localStorage.getItem(DEMO_SESSION_KEY)).toBeNull();
  });

  it('con "Recordarme" usa localStorage', async () => {
    montar();
    await completar('jperez', 'x');
    await userEvent.click(screen.getByLabelText('Recordarme en este navegador'));
    await userEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));
    await screen.findByRole('button', { name: 'Cuenta: Jperez' });
    expect(JSON.parse(localStorage.getItem(DEMO_SESSION_KEY)!)).toEqual({ nombre: 'Jperez', correo: 'jperez@demo.stockflow' });
  });

  it('si el backend no responde lo avisa y permite entrar igualmente', async () => {
    vi.mocked(healthService.comprobar).mockRejectedValue(new TypeError('Failed to fetch'));
    montar();
    await completar('ana@uni.edu', 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));
    expect(await screen.findByText('El servidor no responde')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Entrar sin conexión' }));
    expect(await screen.findByRole('button', { name: 'Cuenta: Ana' })).toBeInTheDocument();
  });

  it('un error HTTP del health también se informa', async () => {
    vi.mocked(healthService.comprobar).mockRejectedValue(new ApiError(503, 'Servicio no disponible'));
    montar();
    await completar('ana@uni.edu', 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar en modo demo' }));
    expect(await screen.findByText(/Servicio no disponible/)).toBeInTheDocument();
  });

  it('salir del modo demo borra los datos guardados y vuelve al acceso', async () => {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ nombre: 'Maria Lopez', correo: 'maria@uni.edu' }));
    montar('/');
    await userEvent.click(screen.getByRole('button', { name: 'Cuenta: Maria Lopez' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Salir del modo demo' }));

    expect(await screen.findByText(/Saliste del modo demostración/)).toBeInTheDocument();
    expect(localStorage.getItem(DEMO_SESSION_KEY)).toBeNull();
    expect(within(screen.getByRole('form')).getByLabelText(/Correo o usuario/)).toHaveValue('');
  });

  it('ignora datos guardados con formato inválido', () => {
    localStorage.setItem(DEMO_SESSION_KEY, '{"nombre": 42');
    montar('/');
    expect(screen.getByRole('button', { name: 'Cuenta: Invitado' })).toBeInTheDocument();
  });
});
