import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Categoria } from '../../categorias/models/Categoria';
import type { Producto } from '../models/Producto';

interface ProductoTableProps {
  productos: Producto[];
  /** G07: mapa id -> Categoria construido UNA vez por la Page. Sin un GET por fila (sin N+1 desde la UI). */
  categoriasPorId: Map<number, Categoria>;
  onEdit: (id: number) => void;
  onDelete: (producto: Producto) => void;
  deletingId?: number | null;
}

const formatoPrecio = new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ProductoTable({ productos, categoriasPorId, onEdit, onDelete, deletingId }: ProductoTableProps) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Stock mín.</th>
              <th>Precio ref.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const categoria = categoriasPorId.get(producto.categoriaId);
              return (
                <tr key={producto.id}>
                  <td className="code-cell">{producto.codigo}</td>
                  <td>{producto.nombre}</td>
                  <td>{categoria ? `${categoria.codigo} · ${categoria.nombre}` : `Categoría #${producto.categoriaId}`}</td>
                  <td>{producto.unidadMedida}</td>
                  <td>{producto.stockMinimoDefault}</td>
                  <td>{producto.precioReferencial === null ? '—' : formatoPrecio.format(producto.precioReferencial)}</td>
                  <td>
                    <StatusBadge active={producto.activo} />
                  </td>
                  <td className="actions-cell">
                    <Button variant="secondary" onClick={() => onEdit(producto.id)} aria-label={`Editar ${producto.codigo}`}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(producto)}
                      loading={deletingId === producto.id}
                      loadingText="Eliminando..."
                      aria-label={`Eliminar ${producto.codigo}`}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
