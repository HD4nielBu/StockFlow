import { Package, Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { DataTable, type Column } from '../../../components/ui/DataTable';
import { DropdownItem, DropdownSeparator } from '../../../components/ui/Dropdown';
import { RowActions } from '../../../components/ui/RowActions';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Categoria } from '../models/Categoria';

interface CategoriaTableProps {
  categorias: Categoria[];
  /** Cantidad de productos por categoría (dato derivado que calcula la Page). */
  productosPorCategoria?: Map<number, number>;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
  /** Fila con una operación en curso (cargando el detalle para editar). */
  busyId?: number | null;
  footer?: ReactNode;
}

/**
 * G03/G06: muestra filas y EMITE intenciones (onEdit, onDelete) hacia la Page.
 * No importa categoriaService: la tabla no decide cómo se habla con el backend.
 */
export default function CategoriaTable({ categorias, productosPorCategoria, onEdit, onDelete, busyId, footer }: CategoriaTableProps) {
  const navigate = useNavigate();

  const columns: Column<Categoria>[] = [
    {
      key: 'nombre',
      header: 'Categoría',
      mobile: 'primary',
      cell: (c) => (
        <span className="cell-stack">
          <span className="cell-title">{c.nombre}</span>
          {c.descripcion && <span className="cell-sub">{c.descripcion}</span>}
        </span>
      ),
    },
    { key: 'codigo', header: 'Código', cell: (c) => <span className="code-cell">{c.codigo}</span> },
    {
      key: 'productos',
      header: 'Productos',
      align: 'end',
      cell: (c) => {
        const total = productosPorCategoria?.get(c.id) ?? 0;
        return total === 0 ? (
          <span className="muted-cell num">0</span>
        ) : (
          <Link to={`/productos?categoria=${c.id}`} className="count-link" aria-label={`Ver ${total} ${total === 1 ? 'producto' : 'productos'} de ${c.nombre}`}>
            <span className="num">{total}</span>
          </Link>
        );
      },
    },
    { key: 'estado', header: 'Estado', cell: (c) => <StatusBadge active={c.activo} /> },
  ];

  return (
    <DataTable
      rows={categorias}
      columns={columns}
      rowKey={(c) => c.id}
      caption="Categorías del catálogo"
      footer={footer}
      actions={(c) => (
        <RowActions name={c.nombre} busy={busyId === c.id}>
          <DropdownItem icon={Pencil} onSelect={() => onEdit(c)}>
            Editar
          </DropdownItem>
          <DropdownItem icon={Package} onSelect={() => navigate(`/productos?categoria=${c.id}`)}>
            Ver productos
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={Trash2} tone="danger" onSelect={() => onDelete(c)}>
            Eliminar
          </DropdownItem>
        </RowActions>
      )}
    />
  );
}
