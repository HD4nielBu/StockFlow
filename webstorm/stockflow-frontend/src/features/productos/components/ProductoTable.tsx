import { Pencil, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/LoadingSkeleton';
import { DataTable, type Column } from '../../../components/ui/DataTable';
import { DropdownItem, DropdownSeparator } from '../../../components/ui/Dropdown';
import { RowActions } from '../../../components/ui/RowActions';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatoCantidad, formatoPrecio } from '../../../shared/utils/formato';
import type { Categoria } from '../../categorias/models/Categoria';
import type { StockProducto } from '../../inventario/utils/stockPorProducto';
import { UNIDAD_LABEL, type Producto } from '../models/Producto';

interface ProductoTableProps {
  productos: Producto[];
  /** G07: mapa id -> Categoria construido UNA vez por la Page. Sin un GET por fila (sin N+1 desde la UI). */
  categoriasPorId: Map<number, Categoria>;
  /** Stock real por producto (GET /api/inventario/stock). null = no se pudo cargar. */
  stock: Map<number, StockProducto> | null;
  stockLoading?: boolean;
  onEdit: (producto: Producto) => void;
  onDelete: (producto: Producto) => void;
  busyId?: number | null;
  footer?: ReactNode;
}

function StockCell({ stock, loading }: { stock: StockProducto | undefined | null; loading: boolean }) {
  if (loading) return <Skeleton width={40} className="skeleton--inline" />;
  if (stock === null) return <span className="muted-cell">—</span>;
  if (!stock) return <span className="muted-cell">Sin stock</span>;
  return (
    <span className="stock-cell">
      <span className="num">{formatoCantidad(stock.total)}</span>
      {stock.bajoMinimo && <Badge tone="warning">Bajo mínimo</Badge>}
    </span>
  );
}

export default function ProductoTable({ productos, categoriasPorId, stock, stockLoading = false, onEdit, onDelete, busyId, footer }: ProductoTableProps) {
  const columns: Column<Producto>[] = [
    {
      key: 'producto',
      header: 'Producto',
      mobile: 'primary',
      cell: (p) => (
        <span className="cell-stack">
          <span className="cell-title">{p.nombre}</span>
          <span className="cell-sub code-cell">{p.codigo}</span>
        </span>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoría',
      cell: (p) => {
        const categoria = categoriasPorId.get(p.categoriaId);
        if (!categoria) return <span className="muted-cell">Categoría #{p.categoriaId}</span>;
        return (
          <span>
            {categoria.nombre}
            {!categoria.activo && <span className="muted-cell"> (inactiva)</span>}
          </span>
        );
      },
    },
    { key: 'unidad', header: 'Unidad', cell: (p) => UNIDAD_LABEL[p.unidadMedida] },
    { key: 'stock', header: 'Stock', align: 'end', cell: (p) => <StockCell loading={stockLoading} stock={stock ? stock.get(p.id) : null} /> },
    { key: 'minimo', header: 'Mínimo', align: 'end', cell: (p) => <span className="num">{formatoCantidad(p.stockMinimoDefault)}</span> },
    {
      key: 'precio',
      header: 'Precio ref.',
      align: 'end',
      cell: (p) =>
        p.precioReferencial === null ? <span className="muted-cell">—</span> : <span className="num">{formatoPrecio(p.precioReferencial)}</span>,
    },
    { key: 'estado', header: 'Estado', cell: (p) => <StatusBadge active={p.activo} /> },
  ];

  return (
    <DataTable
      rows={productos}
      columns={columns}
      rowKey={(p) => p.id}
      caption="Productos del catálogo"
      footer={footer}
      actions={(p) => (
        <RowActions name={p.nombre} busy={busyId === p.id}>
          <DropdownItem icon={Pencil} onSelect={() => onEdit(p)}>
            Editar
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem icon={Trash2} tone="danger" onSelect={() => onDelete(p)}>
            Eliminar
          </DropdownItem>
        </RowActions>
      )}
    />
  );
}
