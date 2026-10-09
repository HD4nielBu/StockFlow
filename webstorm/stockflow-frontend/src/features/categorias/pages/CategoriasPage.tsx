import { FolderPlus, Plus, RotateCw, SearchX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
import { normalizar, paginar } from '../../../shared/utils/paginar';
import { useProductos } from '../../productos/hooks/useProductos';
import CategoriaForm from '../components/CategoriaForm';
import CategoriaTable from '../components/CategoriaTable';
import { useCategorias } from '../hooks/useCategorias';
import type { Categoria } from '../models/Categoria';
import { categoriaService } from '../services/categoriaService';

const TAMANOS = [5, 10, 20, 50].map((n) => ({ value: String(n), label: `${n} por página` }));

/**
 * G06/G08/G09: la Page coordina el caso de uso: carga (hook), edición en modal, eliminación,
 * búsqueda, filtros y paginación. Los componentes UI sólo reciben datos y callbacks.
 */
export default function CategoriasPage() {
  const toast = useToast();
  const { data: categorias, setData: setCategorias, loading, error, reload } = useCategorias();
  const { data: productos } = useProductos();

  const location = useLocation();
  const navigate = useNavigate();

  // Modal de formulario: formKey cambia en cada apertura para montar un formulario limpio.
  // El acceso rápido "Nueva categoría" de Inicio llega como state de navegación.
  const [formOpen, setFormOpen] = useState(() => (location.state as { nuevo?: boolean } | null)?.nuevo === true);
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [loadingDetailId, setLoadingDetailId] = useState<number | null>(null);
  // El registro a eliminar se conserva al cerrar el diálogo: el texto no desaparece durante la animación
  const [pendingDelete, setPendingDelete] = useState<Categoria | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // El state "nuevo" se consume una vez: si se recarga la página, el modal no vuelve a abrirse
  useEffect(() => {
    if ((location.state as { nuevo?: boolean } | null)?.nuevo) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  // Estado fuente de la UI: lo elige el usuario
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Datos DERIVADOS: se calculan en cada render, no se guardan en otro useState (G08/G09)
  const productosPorCategoria = useMemo(() => {
    const conteo = new Map<number, number>();
    productos.forEach((p) => conteo.set(p.categoriaId, (conteo.get(p.categoriaId) ?? 0) + 1));
    return conteo;
  }, [productos]);

  const activas = categorias.filter((c) => c.activo).length;
  const filtradas = categorias.filter((c) => {
    const termino = normalizar(search);
    const coincideTexto =
      !termino || [c.codigo, c.nombre, c.descripcion].some((campo) => normalizar(campo).includes(termino));
    const coincideEstado = status === 'all' || (status === 'active' ? c.activo : !c.activo);
    return coincideTexto && coincideEstado; // AND entre filtros, OR entre campos de texto
  });
  const pagina = paginar(filtradas, page, pageSize); // primero filtrar, después paginar
  const hayFiltros = search !== '' || status !== 'all';

  const limpiarFiltros = () => {
    setSearch('');
    setStatus('all');
    setPage(1);
  };

  const abrirFormulario = (categoria: Categoria | null) => {
    setEditing(categoria);
    setFormKey((k) => k + 1);
    setFormOpen(true);
  };

  // G06: GET /{id} antes de editar, para trabajar con la versión actual del servidor
  const handleEdit = async (categoria: Categoria) => {
    try {
      setLoadingDetailId(categoria.id);
      abrirFormulario(await categoriaService.obtenerPorId(categoria.id));
    } catch (err) {
      toast.error(describirError(err, 'abrir la categoría'));
      if (err instanceof ApiError && err.status === 404) reload();
    } finally {
      setLoadingDetailId(null);
    }
  };

  // Sincronización local con la RESPUESTA del backend (trae el id real y los datos normalizados)
  const handleSaved = (saved: Categoria, mode: 'create' | 'edit') => {
    setCategorias((prev) => (mode === 'create' ? [...prev, saved] : prev.map((c) => (c.id === saved.id ? saved : c))));
    setFormOpen(false);
    toast.success(mode === 'create' ? `Categoría ${saved.codigo} creada` : `Categoría ${saved.codigo} actualizada`);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const categoria = pendingDelete;
    try {
      setDeleting(true);
      await categoriaService.eliminar(categoria.id);
      // Sólo se quita la fila DESPUÉS de que el backend confirmó (204)
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
      toast.success(`Categoría ${categoria.codigo} eliminada`);
    } catch (err) {
      // 409: tiene productos. La fila NO se borra de la pantalla: el backend la rechazó.
      toast.error(describirError(err, 'eliminar la categoría'));
      if (err instanceof ApiError && err.status === 404) reload();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const productosDelPendiente = pendingDelete ? (productosPorCategoria.get(pendingDelete.id) ?? 0) : 0;

  return (
    <section className="page-stack">
      <PageHeader
        title="Categorías"
        description="Organiza el catálogo en familias de productos."
        reference="RF-06 · Entidad padre de Categoría 1:N Producto · /api/categorias"
        actions={
          <Button icon={Plus} onClick={() => abrirFormulario(null)}>
            Nueva categoría
          </Button>
        }
      />

      {error && (
        <Alert
          kind="error"
          title="No se pudieron cargar las categorías"
          action={
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={reload}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <div className="filters">
        <div className="filters__search">
          <SearchInput
            value={search}
            label="Buscar categoría"
            hideLabel
            placeholder="Buscar por código, nombre o descripción"
            onChange={(v) => {
              setSearch(v);
              setPage(1); // al cambiar el filtro se vuelve a la primera página
            }}
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
            { value: 'all', label: 'Todas', count: categorias.length },
            { value: 'active', label: 'Activas', count: activas },
            { value: 'inactive', label: 'Inactivas', count: categorias.length - activas },
          ]}
        />
      </div>

      {loading ? (
        <TableSkeleton columns={5} rows={5} label="Cargando categorías" />
      ) : pagina.totalItems === 0 ? (
        hayFiltros ? (
          <EmptyState
            icon={SearchX}
            title="Ninguna categoría coincide"
            description="Prueba con otro texto o quita el filtro de estado."
            action={
              <Button variant="secondary" onClick={limpiarFiltros}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          !error && (
            <EmptyState
              icon={FolderPlus}
              title="Todavía no hay categorías"
              description="Crea la primera para empezar a organizar tus productos."
              action={
                <Button icon={Plus} onClick={() => abrirFormulario(null)}>
                  Nueva categoría
                </Button>
              }
            />
          )
        )
      ) : (
        <CategoriaTable
          categorias={pagina.items}
          productosPorCategoria={productosPorCategoria}
          onEdit={handleEdit}
          onDelete={(c) => {
            setPendingDelete(c);
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
        title={editing ? `Editar ${editing.nombre}` : 'Nueva categoría'}
        description={editing ? `Código ${editing.codigo}` : 'Agrupa productos del mismo tipo.'}
        onClose={() => setFormOpen(false)}
      >
        <CategoriaForm key={formKey} categoria={editing} onSaved={handleSaved} onCancel={() => setFormOpen(false)} onStale={reload} />
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Eliminar categoría"
        message={
          pendingDelete
            ? productosDelPendiente > 0
              ? `${pendingDelete.nombre} (${pendingDelete.codigo}) tiene ${productosDelPendiente} producto(s) asociado(s). El sistema no permitirá eliminarla mientras existan.`
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
