import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { Categoria } from '../models/Categoria';

interface CategoriaTableProps {
  categorias: Categoria[];
  /** Cantidad de productos por categoría (dato derivado que calcula la Page). */
  productosPorCategoria?: Map<number, number>;
  onEdit: (id: number) => void;
  onDelete: (categoria: Categoria) => void;
  deletingId?: number | null;
}

/**
 * G03/G06: muestra filas y EMITE intenciones (onEdit, onDelete) hacia la Page.
 * No importa categoriaService: la tabla no decide cómo se habla con el backend.
 */
export default function CategoriaTable({ categorias, productosPorCategoria, onEdit, onDelete, deletingId }: CategoriaTableProps) {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.id}</td>
                <td className="code-cell">{categoria.codigo}</td>
                <td>{categoria.nombre}</td>
                <td className="muted-cell">{categoria.descripcion ?? '—'}</td>
                <td>{productosPorCategoria?.get(categoria.id) ?? 0}</td>
                <td>
                  <StatusBadge active={categoria.activo} />
                </td>
                <td className="actions-cell">
                  <Button variant="secondary" onClick={() => onEdit(categoria.id)} aria-label={`Editar ${categoria.nombre}`}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(categoria)}
                    loading={deletingId === categoria.id}
                    loadingText="Eliminando..."
                    aria-label={`Eliminar ${categoria.nombre}`}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
