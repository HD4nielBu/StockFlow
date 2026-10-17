import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

function Disparador() {
  const toast = useToast();
  return (
    <>
      <button onClick={() => toast.success('Categoría creada')}>ok</button>
      <button onClick={() => toast.error({ title: 'No se pudo guardar', description: 'El código ya existe' })}>error</button>
    </>
  );
}

afterEach(() => vi.useRealTimers());

describe('ToastProvider', () => {
  it('muestra el mensaje y lo retira solo pasado su tiempo', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(
      <ToastProvider>
        <Disparador />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'ok' }));
    expect(screen.getByRole('status')).toHaveTextContent('Categoría creada');

    await act(() => vi.advanceTimersByTimeAsync(4500));
    expect(screen.queryByText('Categoría creada')).not.toBeInTheDocument();
  });

  it('los errores se anuncian como alerta y se pueden cerrar', async () => {
    render(
      <ToastProvider>
        <Disparador />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'error' }));
    expect(screen.getByRole('alert')).toHaveTextContent('El código ya existe');
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar notificación' }));
    await screen.findByText('ok'); // deja pasar la animación de salida
    await vi.waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });
});
