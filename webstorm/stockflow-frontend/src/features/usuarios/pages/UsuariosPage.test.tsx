import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../../test/renderWithProviders';
import UsuariosPage from './UsuariosPage';

describe('UsuariosPage (demo)', () => {
  it('se rotula como demostración y filtra por rol sobre los datos locales', async () => {
    renderWithProviders(<UsuariosPage />);
    expect(screen.getByText('Datos de demostración')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Rol'), 'SUPERVISOR');
    expect(screen.getByText('Ana Gutiérrez')).toBeInTheDocument();
    expect(screen.queryByText('Pablo Rojas')).not.toBeInTheDocument();
  });

  it('"Invitar usuario" explica que no está disponible en lugar de aparentar que funciona', async () => {
    renderWithProviders(<UsuariosPage />);
    const boton = screen.getByRole('button', { name: 'Invitar usuario' });
    expect(boton).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(boton);
    expect(await screen.findByText('No disponible en modo demostración')).toBeInTheDocument();
  });
});
