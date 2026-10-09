import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown, DropdownItem } from './Dropdown';

function Menu({ onEdit = () => {}, onDelete = () => {} }) {
  return (
    <Dropdown label="Acciones" trigger={(props) => <button {...props}>Acciones</button>}>
      <DropdownItem onSelect={onEdit}>Editar</DropdownItem>
      <DropdownItem onSelect={onDelete} tone="danger">
        Eliminar
      </DropdownItem>
    </Dropdown>
  );
}

describe('Dropdown', () => {
  it('abre con el botón, enfoca la primera opción y anuncia aria-expanded', async () => {
    render(<Menu />);
    const trigger = screen.getByRole('button', { name: 'Acciones' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Editar' })).toHaveFocus();
  });

  it('se recorre con flechas y ejecuta la opción con Enter, devolviendo el foco al botón', async () => {
    const onDelete = vi.fn();
    render(<Menu onDelete={onDelete} />);
    await userEvent.click(screen.getByRole('button', { name: 'Acciones' }));
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Eliminar' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Acciones' })).toHaveFocus();
  });

  it('se cierra con Escape sin ejecutar nada', async () => {
    const onEdit = vi.fn();
    render(<Menu onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Acciones' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(onEdit).not.toHaveBeenCalled();
  });
});
