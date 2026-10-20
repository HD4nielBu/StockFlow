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

  it('con guardChanges, cerrar un formulario modificado pide confirmar antes de descartar', async () => {
    const onClose = vi.fn();
    render(
      <Modal open guardChanges title="Nuevo producto" onClose={onClose}>
        <input aria-label="Nombre" />
      </Modal>,
    );
    await userEvent.type(screen.getByRole('textbox', { name: 'Nombre' }), 'Tóner');
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Descartar' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('con guardChanges y sin cambios, cierra directamente', async () => {
    const onClose = vi.fn();
    render(
      <Modal open guardChanges title="Nuevo producto" onClose={onClose}>
        <input aria-label="Nombre" />
      </Modal>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
