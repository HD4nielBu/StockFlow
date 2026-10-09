import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('muestra Activo con la clase de estado activo', () => {
    render(<StatusBadge active />);
    expect(screen.getByText('Activo')).toHaveClass('badge--active');
  });

  it('muestra Inactivo con la clase de estado inactivo', () => {
    render(<StatusBadge active={false} />);
    expect(screen.getByText('Inactivo')).toHaveClass('badge--inactive');
  });
});
