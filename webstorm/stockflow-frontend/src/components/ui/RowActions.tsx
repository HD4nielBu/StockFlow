import { Ellipsis } from 'lucide-react';
import type { ReactNode } from 'react';
import { Dropdown } from './Dropdown';
import { Spinner } from './Spinner';

type RowActionsProps = {
  /** Nombre del registro: el botón se anuncia como "Acciones de <name>". */
  name: string;
  /** Una operación de esta fila está en curso (cargando detalle, eliminando...). */
  busy?: boolean;
  /** DropdownItem con las acciones. */
  children: ReactNode;
};

/** Menú "⋯" por fila: agrupa editar/eliminar sin llenar la tabla de botones de colores. */
export function RowActions({ name, busy = false, children }: RowActionsProps) {
  return (
    <Dropdown
      label={`Acciones de ${name}`}
      trigger={(props) => (
        <button
          {...props}
          type="button"
          className="icon-button row-actions"
          aria-label={`Acciones de ${name}`}
          aria-busy={busy || undefined}
          disabled={busy}
        >
          {busy ? <Spinner size={15} /> : <Ellipsis size={18} aria-hidden="true" />}
        </button>
      )}
    >
      {children}
    </Dropdown>
  );
}
