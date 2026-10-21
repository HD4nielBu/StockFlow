import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { ordenar, type Orden } from '../../shared/utils/ordenar';
import { DataTable } from './DataTable';

const filas = [
  { id: 1, nombre: 'Tóner' },
  { id: 2, nombre: 'Archivador' },
];

function Tabla() {
  const [orden, setOrden] = useState<Orden | null>(null);
  return (
    <DataTable
      rows={ordenar(filas, orden, { nombre: (f) => f.nombre })}
      columns={[{ key: 'nombre', header: 'Nombre', sortable: true, cell: (f) => f.nombre }]}
      rowKey={(f) => f.id}
      caption="Prueba"
      sort={orden}
      onSortChange={setOrden}
    />
  );
}

const nombres = () => screen.getAllByRole('cell').map((c) => c.textContent);

describe('DataTable · orden', () => {
  it('el encabezado ordena y anuncia el sentido con aria-sort', async () => {
    render(<Tabla />);
    const header = screen.getByRole('columnheader', { name: /Nombre/ });
    expect(header).not.toHaveAttribute('aria-sort');

    await userEvent.click(screen.getByRole('button', { name: 'Nombre' }));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(nombres()).toEqual(['Archivador', 'Tóner']);

    await userEvent.click(screen.getByRole('button', { name: 'Nombre' }));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(nombres()).toEqual(['Tóner', 'Archivador']);
  });

  it('en móvil el selector "Ordenar por" aplica el mismo orden', async () => {
    render(<Tabla />);
    const selector = screen.getByRole('combobox', { name: 'Ordenar por' });
    await userEvent.selectOptions(selector, 'nombre:desc');
    expect(screen.getByRole('columnheader', { name: /Nombre/ })).toHaveAttribute('aria-sort', 'descending');
    expect(nombres()).toEqual(['Tóner', 'Archivador']);

    await userEvent.selectOptions(selector, '');
    expect(nombres()).toEqual(['Tóner', 'Archivador']); // sin orden vuelve al de origen
  });
});
