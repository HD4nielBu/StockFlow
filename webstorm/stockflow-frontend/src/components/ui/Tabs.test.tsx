import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from './Tabs';

const items = [
  { id: 'general', label: 'General', panel: <p>Panel general</p> },
  { id: 'avisos', label: 'Avisos', panel: <p>Panel avisos</p> },
];

describe('Tabs', () => {
  it('muestra sólo el panel activo y cambia con las flechas', async () => {
    render(<Tabs items={items} label="Ajustes" />);
    expect(screen.getByText('Panel general')).toBeVisible();
    expect(screen.queryByText('Panel avisos')).not.toBeVisible();

    await userEvent.click(screen.getByRole('tab', { name: 'General' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Avisos' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Avisos' })).toHaveFocus();
    expect(screen.getByText('Panel avisos')).toBeVisible();
  });
});
