import { useMemo, useState } from 'react';
import { mensajeDeError } from '../../../api/apiClient';
import { Alert } from '../../../components/ui/Alert';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { normalizar, paginar } from '../../../shared/utils/paginar';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import type { Categoria } from '../../categorias/models/Categoria';
import ProductoForm from '../components/ProductoForm';
import ProductoTable from '../components/ProductoTable';
import { useProductos } from '../hooks/useProductos';
import type { Producto } from '../models/Producto';
import { productoService } from '../services/productoService';

const ESTADOS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
];
const TAMANOS = [5, 10, 20].map((n) => ({ value: String(n), label: `${n} por página` }));

/** G07/G08/G09: CRUD de Producto + relación Categoría 1:N + búsqueda, filtros y paginación. */
export default function ProductosPage() {
  const productos = useProductos();
  const categorias = useCategorias();

  const [editing, setEditing] = useState<Producto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Producto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const mostrarExito = (mensaje: string) => {
    setSuccess(mensaje);
    window.setTimeout(() => setSuccess(''), 3000);
  };

  // G07: Map id -> Categoria para resolver nombres sin una petición por fila
  const categoriasPorId = useMemo(
    () => new Map<number, Categoria>(categorias.data.map((c) => [c.id, c])),
    [categorias.data],
  );

  const filtrados = productos.data.filter((p) => {
    const termino = normalizar(search);
    const categoria = categoriasPorId.get(p.categoriaId);
    const coincideTexto =
      !termino || [p.codigo, p.nombre, categoria?.nombre, categoria?.codigo].some((c) => normalizar(c).includes(termino));
    // El select entrega string: se convierte a number para comparar con categoriaId
    const coincideCategoria = categoriaFiltro === 'all' || p.categoriaId === Number(categoriaFiltro);
    const coincideEstado = status === 'all' || (status === 'active' ? p.activo : !p.activo);
    return coincideTexto && coincideCategoria && coincideEstado;
  });
  const pagina = paginar(filtrados, page, pageSize);

  const handleEdit = async (id: number) => {
    try {
      setLoadingDetail(true);
      setError('');
      setEditing(await productoService.obtenerPorId(id));
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo cargar el producto'));
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSaved = (saved: Producto, mode: 'create' | 'edit') => {
    productos.setData((prev) => (mode === 'create' ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p))));
    setEditing(null);
    mostrarExito(mode === 'create' ? `Producto ${saved.codigo} creado` : `Producto ${saved.codigo} actualizado`);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const producto = pendingDelete;
    try {
      setDeletingId(producto.id);
      setError('');
      await productoService.eliminar(producto.id);
      productos.setData((prev) => prev.filter((p) => p.id !== producto.id));
      if (editing?.id === producto.id) setEditing(null);
      mostrarExito(`Producto ${producto.codigo} eliminado`);
    } catch (err) {
      // 409: tiene stock o movimientos (RN-01). La fila se conserva.
      setError(mensajeDeError(err, 'No se pudo eliminar el producto'));
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  if (productos.loading || categorias.loading) return <div className="state-card">Cargando productos...</div>;
  const errorCarga = productos.error || categorias.error;

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Entidad hija · Categoría 1:N Producto · RF-05</p>
        <h1>Productos</h1>
        <p>CRUD completo conectado con Spring Boot (/api/productos).</p>
      </div>

      {errorCarga && <Alert kind="error">{errorCarga}</Alert>}
      {error && <Alert kind="error">{error}</Alert>}
      {success && <Alert kind="success">{success}</Alert>}
      {loadingDetail && <div className="state-card">Cargando detalle...</div>}

      <ProductoForm
        key={editing?.id ?? 'nuevo'}
        categorias={categorias.data} producto={editing} onSaved={handleSaved} onCancelEdit={() => setEditing(null)} />

      <div className="toolbar">
        <SearchInput
          value={search}
          label="Buscar producto"
          placeholder="Código, nombre o categoría"
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        <SelectFilter
          label="Categoría"
          value={categoriaFiltro}
          options={[{ value: 'all', label: 'Todas' }, ...categorias.data.map((c) => ({ value: String(c.id), label: c.nombre }))]}
          onChange={(v) => {
            setCategoriaFiltro(v);
            setPage(1);
          }}
        />
        <SelectFilter
          label="Estado"
          value={status}
          options={ESTADOS}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
        <SelectFilter
          label="Tamaño"
          value={String(pageSize)}
          options={TAMANOS}
          onChange={(v) => {
            setPageSize(Number(v));
            setPage(1);
          }}
        />
      </div>

      {pagina.totalItems === 0 ? (
        <EmptyState
          title={productos.data.length === 0 ? 'No hay productos registrados' : 'Ningún producto coincide con los filtros'}
          description={productos.data.length === 0 ? 'Crea el primero con el formulario.' : 'Cambia la búsqueda o los filtros.'}
        />
      ) : (
        <>
          <ProductoTable
            productos={pagina.items}
            categoriasPorId={categoriasPorId}
            onEdit={handleEdit}
            onDelete={setPendingDelete}
            deletingId={deletingId}
          />
          <Pagination page={pagina.pagina} totalPages={pagina.totalPaginas} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar producto"
        message={
          pendingDelete
            ? `¿Eliminar el producto ${pendingDelete.codigo}? Si ya tiene stock o movimientos, el backend lo impedirá.`
            : ''
        }
        confirming={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
