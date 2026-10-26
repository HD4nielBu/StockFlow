import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MovimientosSemanales } from './MovimientosSemanales';

describe('MovimientosSemanales', () => {
  it('cada semana anuncia sus dos valores y la leyenda suma el período', () => {
    render(
      <MovimientosSemanales
        semanas={[
          { semana: '2026-10-12', entradas: 4, salidas: 1 },
          { semana: '2026-10-19', entradas: 0, salidas: 3 },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: /12 oct.*4 entradas y 1 salidas/ })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /19 oct.*0 entradas y 3 salidas/ })).toBeInTheDocument();
    expect(screen.getByText('Entradas · 4')).toBeInTheDocument();
    expect(screen.getByText('Salidas · 4')).toBeInTheDocument();
  });
});
