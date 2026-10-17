import { PackagePlus, Plus, RotateCw, SearchX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { ApiError } from '../../../api/apiClient';
import { describirError } from '../../../api/describirError';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import { Modal } from '../../../components/ui/Modal';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { useToast } from '../../../components/ui/toast/useToast';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { normalizar, paginar } from '../../../shared/utils/paginar';
import { useCategorias } from '../../categorias/hooks/useCategorias';
import type { Categoria } from '../../categorias/models/Categoria';
import { inventarioService } from '../../inventario/services/inventarioService';
import { stockPorProducto } from '../../inventario/utils/stockPorProducto';
import ProductoForm from '../components/ProductoForm';
import ProductoTable from '../components/ProductoTable';
import { useProductos } from '../hooks/useProductos';
import type { Producto } from '../models/Producto';
import { productoService } from '../services/productoService';

const TAMANOS = [5, 10, 20, 50].map((n) => ({ value: String(n), label: `${n} por página` }));

/**
 * G07/G08/G09: CRUD de Producto + relación Categoría 1:N + búsqueda, filtros y paginación.
 * El filtro de categoría vive en la URL (?categoria=ID): se puede enlazar desde Categorías y compartir.
 * El stock es un dato de OTRO módulo (inventario): si falla, la página sigue funcionando sin él.
 */
export default function ProductosPage() {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const productos = useProductos();
  const categorias = useCategorias();
  const existencias = useAsyncList(inventarioService.listarExistencias);

  // Acceso rápido "Nuevo producto" desde Inicio: llega como state de navegación
  const [formOpen, setFormOpen] = useState(() => (location.state as { nuevo?: boolean } | null)?.nuevo === true);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Producto | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const categoriaFiltro = searchParams.get('categoria') ?? 'all';

  // El state "nuevo" se consume una vez: si se recarga la página, el modal no vuelve a abrirse
  useEffect(() => {
    if ((location.state as { nuevo?: boolean } | null)?.nuevo) {
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
    }
  }, [location, navigate]);

  // G07: Map id -> Categoria para resolver nombres sin una petición por fila
  const categoriasPorId = useMemo(
    () => new Map<number, Categoria>(categorias.data.map((c) => [c.id, c])),
    [categorias.data],
  );
  const stock = useMemo(
    () => (existencias.error ? null : stockPorProducto(existencias.data)),
    [existencias.data, existencias.error],
  );

  // Filtros por texto y categoría primero; el estado después, para contar cada segmento
  const termino = normalizar(search);
  const porTextoYCategoria = productos.data.filter((p) => {
    const categoria = categoriasPorId.get(p.categoriaId);
    const coincideTexto =
      !termino || [p.codigo, p.nombre, categoria?.nombre, categoria?.codigo].some((c) => normalizar(c).includes(termino));
    // El filtro llega como string (URL): se convierte a number para comparar con categoriaId
    const coincideCategoria = categoriaFiltro === 'all' || p.categoriaId === Number(categoriaFiltro);
    return coincideTexto && coincideCategoria;
  });
  const activos = porTextoYCategoria.filter((p) => p.activo).length;
  const filtrados = porTextoYCategoria.filter((p) => status === 'all' || (status === 'active' ? p.activo : !p.activo));
  const pagina = paginar(filtrados, page, pageSize);
  const hayFiltros = search !== '' || status !== 'all' || categoriaFiltro !== 'all';

  const cambiarCategoria = (valor: string) => {
    setSearchParams(valor === 'all' ? {} : { categoria: valor }, { replace: true });
    setPage(1);
  };

  const limpiarFiltros = () => {
    setSearch('');
    setStatus('all');
    cambiarCategoria('all');
  };

  const abrirFormulario = (producto: Producto | null) => {
    setEditing(producto);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  const handleEdit = async (producto: Producto) => {
    try {
      setLoadingDetailId(producto.id);
      abrirFormulario(await productoService.obtenerPorId(producto.id));
    } catch (err) {
      toast.error(describirError(err, 'abrir el producto'));
      if (err instanceof ApiError && err.status === 404) productos.reload();
    } finally {
      setLoadingDetailId(null);
    }
  };

  const handleSaved = (saved: Producto, mode: 'create' | 'edit') => {
    productos.setData((prev) => (mode === 'create' ? [...prev, saved] : prev.map((p) => (p.id === saved.id ? saved : p))));
    setFormOpen(false);
    toast.success(mode === 'create' ? `Producto ${saved.codigo} creado` : `Producto ${saved.codigo} actualizado`);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const producto = pendingDelete;
    try {
      setDeleting(true);
      await productoService.eliminar(producto.id);
      productos.setData((prev) => prev.filter((p) => p.id !== producto.id));
      toast.success(`Producto ${producto.codigo} eliminado`);
    } catch (err) {
      // 409: tiene stock o movimientos (RN-01). La fila se conserva.
      toast.error(describirError(err, 'eliminar el producto'));
      if (err instanceof ApiError && err.status === 404) productos.reload();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const loading = productos.loading || categorias.loading;
  const errorCarga = productos.error || categorias.error;
  const stockDelPendiente = pendingDelete && stock ? stock.get(pendingDelete.id) : undefined;
  const categoriaInicial = categoriaFiltro !== 'all' ? Number(categoriaFiltro) : undefined;

  return (
    <section className="page-stack">
      <PageHeader
        title="Productos"
        description="Artículos del catálogo con su categoría, unidad de medida y stock disponible."
        reference="RF-05 · Entidad hija de Categoría 1:N Producto · /api/productos · stock: /api/inventario/stock"
        actions={
          <Button icon={Plus} onClick={() => abrirFormulario(null)}>
            Nuevo producto
          </Button>
        }
      />

      {errorCarga && (
        <Alert
          kind="error"
          title="No se pudieron cargar los productos"
          action={
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCw}
              onClick={() => {
                productos.reload();
                categorias.reload();
              }}
            >
              Reintentar
            </Button>
          }
        >
          {errorCarga}
        </Alert>
      )}
      {existencias.error && !errorCarga && (
        <Alert kind="warning" title="El stock no está disponible">
          Los productos se muestran sin su stock actual. {existencias.error}
        </Alert>
      )}

      <div className="filters">
        <div className="filters__search">
          <SearchInput
            value={search}
            label="Buscar producto"
            hideLabel
            placeholder="Buscar por código, nombre o categoría"
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
        </div>
        <div className="filters__select">
          <SelectFilter
            label="Categoría"
            hideLabel
            value={categoriaFiltro}
            options={[
              { value: 'all', label: 'Todas las categorías' },
              ...categorias.data.map((c) => ({ value: String(c.id), label: c.nombre })),
            ]}
            onChange={cambiarCategoria}
          />
        </div>
        <SegmentedControl
          label="Estado"
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          options={[
            { value: 'all', label: 'Todos', count: porTextoYCategoria.length },
            { value: 'active', label: 'Activos', count: activos },
            { value: 'inactive', label: 'Inactivos', count: porTextoYCategoria.length - activos },
          ]}
        />
      </div>

      {loading ? (
        <TableSkeleton columns={7} rows={5} label="Cargando productos" />
      ) : pagina.totalItems === 0 ? (
        hayFiltros ? (
          <EmptyState
            icon={SearchX}
            title="Ningún producto coincide"
            description="Prueba con otro texto o quita los filtros de categoría y estado."
            action={
              <Button variant="secondary" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          !errorCarga && (
            <EmptyState
              icon={PackagePlus}
              title="Todavía no hay productos"
              description="Registra el primero; necesitarás al menos una categoría activa."
              action={
                <Button icon={Plus} onClick={() => abrirFormulario(null)}>
                  Nuevo producto
                </Button>
              }
            />
          )
        )
      ) : (
        <ProductoTable
          productos={pagina.items}
          categoriasPorId={categoriasPorId}
          stock={stock}
          stockLoading={existencias.loading}
          onEdit={handleEdit}
          onDelete={(p) => {
            setPendingDelete(p);
            setConfirmOpen(true);
          }}
          busyId={loadingDetailId}
          footer={
            <>
              <Pagination
                page={pagina.pagina}
                totalPages={pagina.totalPaginas}
                onPageChange={setPage}
                totalItems={pagina.totalItems}
                pageSize={pageSize}
              />
              <SelectFilter
                label="Filas por página"
                hideLabel
                value={String(pageSize)}
                options={TAMANOS}
                onChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              />
            </>
          }
        />
      )}

      <Modal
        open={formOpen}
        raw
        size="lg"
        title={editing ? `Editar ${editing.nombre}` : 'Nuevo producto'}
        description={editing ? `Código ${editing.codigo}` : 'El producto pertenece a una categoría activa.'}
        onClose={() => setFormOpen(false)}
      >
        <ProductoForm
          key={formKey}
          categorias={categorias.data}
          producto={editing}
          categoriaInicial={categoriaInicial}
          onSaved={handleSaved}
          onCancel={() => setFormOpen(false)}
          onStale={productos.reload}
        />
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar producto"
        message={
          pendingDelete
            ? stockDelPendiente
              ? `${pendingDelete.nombre} (${pendingDelete.codigo}) tiene stock registrado. El sistema no permite eliminar productos con stock o movimientos; puedes desactivarlo desde Editar.`
              : `¿Eliminar ${pendingDelete.nombre} (${pendingDelete.codigo})? Esta acción no se puede deshacer.`
            : ''
        }
        confirming={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
