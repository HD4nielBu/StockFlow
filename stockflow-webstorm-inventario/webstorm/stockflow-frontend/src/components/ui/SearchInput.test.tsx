import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('emite cada cambio de texto hacia la Page', async () => {
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} label="Buscar categoría" />);
    await userEvent.type(screen.getByLabelText('Buscar categoría'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });
});
