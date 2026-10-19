import { useMemo, useState } from 'react';
import { mensajeDeError } from '../../../api/apiClient';
import { Alert } from '../../../components/ui/Alert';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { normalizar, paginar } from '../../../shared/utils/paginar';
import { useProductos } from '../../productos/hooks/useProductos';
import CategoriaForm from '../components/CategoriaForm';
import CategoriaTable from '../components/CategoriaTable';
import { useCategorias } from '../hooks/useCategorias';
import type { Categoria } from '../models/Categoria';
import { categoriaService } from '../services/categoriaService';

const ESTADOS = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
];
const TAMANOS = [5, 10, 20].map((n) => ({ value: String(n), label: `${n} por página` }));

/**
 * G06/G08/G09: la Page coordina el caso de uso: carga (hook), edición, eliminación,
 * búsqueda, filtros y paginación. Los componentes UI sólo reciben datos y callbacks.
 */
export default function CategoriasPage() {
  const { data: categorias, setData: setCategorias, loading, error, setError } = useCategorias();
  const { data: productos } = useProductos();

  const [editing, setEditing] = useState<Categoria | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Categoria | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');

  // Estado fuente de la UI: lo elige el usuario
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const mostrarExito = (mensaje: string) => {
    setSuccess(mensaje);
    window.setTimeout(() => setSuccess(''), 3000);
  };

  // Datos DERIVADOS: se calculan en cada render, no se guardan en otro useState (G08/G09)
  const productosPorCategoria = useMemo(() => {
    const conteo = new Map<number, number>();
    productos.forEach((p) => conteo.set(p.categoriaId, (conteo.get(p.categoriaId) ?? 0) + 1));
    return conteo;
  }, [productos]);

  const filtradas = categorias.filter((c) => {
    const termino = normalizar(search);
    const coincideTexto =
      !termino || [c.codigo, c.nombre, c.descripcion].some((campo) => normalizar(campo).includes(termino));
    const coincideEstado = status === 'all' || (status === 'active' ? c.activo : !c.activo);
    return coincideTexto && coincideEstado; // AND entre filtros, OR entre campos de texto
  });
  const pagina = paginar(filtradas, page, pageSize); // primero filtrar, después paginar

  // G06: GET /{id} antes de editar, para trabajar con la versión actual del servidor
  const handleEdit = async (id: number) => {
    try {
      setLoadingDetail(true);
      setError('');
      setEditing(await categoriaService.obtenerPorId(id));
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo cargar la categoría'));
    } finally {
      setLoadingDetail(false);
    }
  };

  // Sincronización local con la RESPUESTA del backend (trae el id real y los datos normalizados)
  const handleSaved = (saved: Categoria, mode: 'create' | 'edit') => {
    setCategorias((prev) => (mode === 'create' ? [...prev, saved] : prev.map((c) => (c.id === saved.id ? saved : c))));
    setEditing(null);
    mostrarExito(mode === 'create' ? `Categoría ${saved.codigo} creada` : `Categoría ${saved.codigo} actualizada`);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const categoria = pendingDelete;
    try {
      setDeletingId(categoria.id);
      setError('');
      await categoriaService.eliminar(categoria.id);
      // Sólo se quita la fila DESPUÉS de que el backend confirmó (204)
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id));
      if (editing?.id === categoria.id) setEditing(null);
      mostrarExito(`Categoría ${categoria.codigo} eliminada`);
    } catch (err) {
      // 409: tiene productos. La fila NO se borra de la pantalla: el backend la rechazó.
      setError(mensajeDeError(err, 'No se pudo eliminar la categoría'));
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  if (loading) return <div className="state-card">Cargando categorías...</div>;

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Entidad padre · RF-06</p>
        <h1>Categorías</h1>
        <p>CRUD completo conectado con Spring Boot (/api/categorias).</p>
      </div>

      {error && <Alert kind="error">{error}</Alert>}
      {success && <Alert kind="success">{success}</Alert>}
      {loadingDetail && <div className="state-card">Cargando detalle...</div>}

      <CategoriaForm key={editing?.id ?? 'nueva'} categoria={editing} onSaved={handleSaved} onCancelEdit={() => setEditing(null)} />

      <div className="toolbar">
        <SearchInput
          value={search}
          label="Buscar categoría"
          placeholder="Código, nombre o descripción"
          onChange={(v) => {
            setSearch(v);
            setPage(1); // al cambiar el filtro se vuelve a la primera página
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
          title={categorias.length === 0 ? 'No hay categorías registradas' : 'Ninguna categoría coincide con la búsqueda'}
          description={categorias.length === 0 ? 'Crea la primera con el formulario.' : 'Cambia el texto o el filtro de estado.'}
        />
      ) : (
        <>
          <CategoriaTable
            categorias={pagina.items}
            productosPorCategoria={productosPorCategoria}
            onEdit={handleEdit}
            onDelete={setPendingDelete}
            deletingId={deletingId}
          />
          <Pagination page={pagina.pagina} totalPages={pagina.totalPaginas} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Eliminar categoría"
        message={
          pendingDelete
            ? `¿Eliminar la categoría ${pendingDelete.codigo} (${pendingDelete.nombre})? Si tiene productos, el backend lo impedirá.`
            : ''
        }
        confirming={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
