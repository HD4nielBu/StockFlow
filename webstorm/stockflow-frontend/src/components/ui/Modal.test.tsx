import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('cada modal se nombra por su propio título aunque haya varios montados', () => {
    render(
      <>
        <Modal open title="Nueva categoría" onClose={() => {}}>
          uno
        </Modal>
        <Modal open title="Eliminar categoría" onClose={() => {}}>
          dos
        </Modal>
      </>,
    );
    expect(screen.getByRole('dialog', { name: 'Nueva categoría' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Eliminar categoría' })).toBeInTheDocument();
  });

  it('el botón Cerrar avisa a la Page', async () => {
    const onClose = vi.fn();
    render(
      <Modal open title="Detalle" onClose={onClose}>
        contenido
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
