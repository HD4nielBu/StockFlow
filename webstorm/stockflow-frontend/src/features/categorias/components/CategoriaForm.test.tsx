import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import CategoriaForm from './CategoriaForm';

const renderForm = () => render(<CategoriaForm categoria={null} onSaved={() => {}} onCancel={() => {}} />);

describe('CategoriaForm · validación al salir del campo', () => {
  it('marca el error al salir de un campo con un valor inválido, sin esperar a enviar', async () => {
    renderForm();
    await userEvent.type(screen.getByRole('textbox', { name: /Código/ }), 'CAT OFI');
    await userEvent.tab();
    expect(screen.getByRole('textbox', { name: /Código/ })).toHaveAccessibleDescription('Sólo letras, números y guiones');
  });

  it('no marca como obligatorio un campo vacío que sólo se recorrió con Tab', async () => {
    renderForm();
    await userEvent.click(screen.getByRole('textbox', { name: /Código/ }));
    await userEvent.tab();
    expect(screen.queryByText('El código es obligatorio')).not.toBeInTheDocument();
  });
});
