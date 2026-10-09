import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from './Breadcrumbs';
import HeaderSearch from './HeaderSearch';

function Ubicacion() {
  return <p data-testid="ruta">{useLocation().pathname}</p>;
}

function renderEn(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <HeaderSearch />
      <Breadcrumbs />
      <Routes>
        <Route path="*" element={<Ubicacion />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('HeaderSearch y Breadcrumbs', () => {
  it('los breadcrumbs muestran sección y página actual', () => {
    renderEn('/productos');
    const ruta = screen.getByRole('navigation', { name: 'Ruta de navegación' });
    expect(within(ruta).getByText('Inventario')).toBeInTheDocument();
    expect(within(ruta).getByText('Productos')).toHaveAttribute('aria-current', 'page');
  });

  it('filtra secciones sin tildes y navega con Enter', async () => {
    renderEn('/');
    const input = screen.getByRole('combobox', { name: 'Ir a una sección' });
    await userEvent.type(input, 'categoria');
    expect(screen.getByRole('option', { name: /Categorías/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByTestId('ruta')).toHaveTextContent('/categorias');
  });

  it('avisa cuando ninguna sección coincide', async () => {
    renderEn('/');
    await userEvent.type(screen.getByRole('combobox', { name: 'Ir a una sección' }), 'zzz');
    expect(screen.getByText('Ninguna sección coincide con «zzz»')).toBeInTheDocument();
  });
});
