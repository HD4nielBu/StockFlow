import { Boxes, Info, RotateCw, ScrollText, SearchX } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { DataTable, type Column } from '../../../components/ui/DataTable';
import { DropdownItem } from '../../../components/ui/Dropdown';
import { EmptyState } from '../../../components/ui/EmptyState';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import { Meter } from '../../../components/ui/Meter';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Pagination } from '../../../components/ui/Pagination';
import { RowActions } from '../../../components/ui/RowActions';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { formatoCantidad } from '../../../shared/utils/formato';
import { normalizar, paginar } from '../../../shared/utils/paginar';
import type { Existencia } from '../models/Existencia';
import { inventarioService } from '../services/inventarioService';
import { LABEL_ESTADO, TONO_ESTADO } from '../utils/estadoVisual';
import { estadoExistencia, type EstadoExistencia } from '../utils/indicadores';

const PAGE_SIZE = 10;
const BADGE_TONE = { bajo: 'danger', cerca: 'warning', ok: 'success' } as const;
const ESTADOS: (EstadoExistencia | 'all')[] = ['all', 'bajo', 'cerca', 'ok'];

/**
 * Existencias por producto y ubicación (GET /api/inventario/stock). Sólo lectura: el stock cambia con
 * movimientos de inventario y la API todavía no expone cómo registrarlos.
 * Filtros de estado y ubicación en la URL para poder enlazar ("ver lo que está bajo el mínimo").
 */
export default function ExistenciasPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: existencias, loading, error, reload } = useAsyncList(inventarioService.listarExistencias);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const estadoParam = params.get('estado');
  const estado = ESTADOS.includes(estadoParam as EstadoExistencia) ? (estadoParam as EstadoExistencia) : 'all';
  const ubicacion = params.get('ubicacion') ?? 'all';

  const setFiltro = (clave: 'estado' | 'ubicacion', valor: string) => {
    const siguiente = new URLSearchParams(params);
    if (valor === 'all') siguiente.delete(clave);
    else siguiente.set(clave, valor);
    setParams(siguiente, { replace: true });
    setPage(1);
  };

  const ubicaciones = [...new Map(existencias.map((e) => [e.ubicacionId, e.ubicacion])).entries()].sort((a, b) =>
    a[1].localeCompare(b[1]),
  );

  const termino = normalizar(search);
  const base = existencias.filter((e) => {
    const coincideTexto = !termino || [e.producto, e.codigoProducto].some((c) => normalizar(c).includes(termino));
    const coincideUbicacion = ubicacion === 'all' || e.ubicacionId === Number(ubicacion);
    return coincideTexto && coincideUbicacion;
  });
  const cuenta = (est: EstadoExistencia) => base.filter((e) => estadoExistencia(e) === est).length;
  const filtradas = base
    .filter((e) => estado === 'all' || estadoExistencia(e) === estado)
    // Lo más urgente primero: menor cobertura del mínimo
    .sort((a, b) => a.cantidad / (a.stockMinimo || 1) - b.cantidad / (b.stockMinimo || 1));
  const pagina = paginar(filtradas, page, PAGE_SIZE);
  const hayFiltros = search !== '' || estado !== 'all' || ubicacion !== 'all';

  const columns: Column<Existencia>[] = [
    {
      key: 'producto',
      header: 'Producto',
      mobile: 'primary',
      cell: (e) => (
        <span className="cell-stack">
          <span className="cell-title">{e.producto}</span>
          <span className="cell-sub code-cell">{e.codigoProducto}</span>
        </span>
      ),
    },
    { key: 'ubicacion', header: 'Ubicación', cell: (e) => e.ubicacion },
    { key: 'cantidad', header: 'Cantidad', align: 'end', cell: (e) => <span className="num cell-title">{formatoCantidad(e.cantidad)}</span> },
    { key: 'minimo', header: 'Mínimo', align: 'end', cell: (e) => <span className="num">{formatoCantidad(e.stockMinimo)}</span> },
    {
      key: 'cobertura',
      header: 'Cobertura',
      cell: (e) => {
        const ratio = e.stockMinimo > 0 ? e.cantidad / e.stockMinimo : null;
        if (ratio === null) return <span className="muted-cell">Sin mínimo</span>;
        const pct = Math.round(ratio * 100);
        return (
          <span className="coverage-cell">
            <Meter value={ratio / 2} tone={TONO_ESTADO[estadoExistencia(e)]} label={`${pct} % del stock mínimo`} />
            <span className="num">{pct} %</span>
          </span>
        );
      },
    },
    {
      key: 'estado',
      header: 'Estado',
      cell: (e) => {
        const est = estadoExistencia(e);
        return (
          <Badge tone={BADGE_TONE[est]} dot>
            {LABEL_ESTADO[est]}
          </Badge>
        );
      },
    },
  ];

  return (
    <section className="page-stack">
      <PageHeader
        title="Existencias"
        description="Stock de cada producto en cada almacén, ordenado por lo más urgente."
        reference="RF-20 · GET /api/inventario/stock (?productoId, ?ubicacionId, ?soloBajoMinimo)"
      />

      {error && (
        <Alert
          kind="error"
          title="No se pudieron cargar las existencias"
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
            label="Buscar existencia"
            hideLabel
            placeholder="Buscar por producto o código"
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
        </div>
        <div className="filters__select">
          <SelectFilter
            label="Ubicación"
            hideLabel
            value={ubicacion}
            onChange={(v) => setFiltro('ubicacion', v)}
            options={[{ value: 'all', label: 'Todas las ubicaciones' }, ...ubicaciones.map(([id, nombre]) => ({ value: String(id), label: nombre }))]}
          />
        </div>
        <SegmentedControl
          label="Estado"
          value={estado}
          onChange={(v) => setFiltro('estado', v)}
          options={[
            { value: 'all', label: 'Todas', count: base.length },
            { value: 'bajo', label: 'Bajo mínimo', count: cuenta('bajo') },
            { value: 'cerca', label: 'Cerca', count: cuenta('cerca') },
            { value: 'ok', label: 'Suficiente', count: cuenta('ok') },
          ]}
        />
      </div>

      {loading ? (
        <TableSkeleton columns={6} rows={6} label="Cargando existencias" />
      ) : pagina.totalItems === 0 ? (
        hayFiltros ? (
          <EmptyState
            icon={SearchX}
            title="Ninguna existencia coincide"
            description="Cambia la búsqueda o los filtros."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('');
                  setParams({}, { replace: true });
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          !error && <EmptyState icon={Boxes} title="No hay existencias registradas" description="El stock aparece aquí cuando se registran movimientos de entrada." />
        )
      ) : (
        <DataTable
          rows={pagina.items}
          columns={columns}
          rowKey={(e) => e.stockId}
          caption="Existencias por producto y ubicación"
          actions={(e) => (
            <RowActions name={`${e.producto} en ${e.ubicacion}`}>
              <DropdownItem icon={ScrollText} onSelect={() => navigate(`/movimientos?producto=${e.productoId}`)}>
                Ver kardex
              </DropdownItem>
            </RowActions>
          )}
          footer={<Pagination page={pagina.pagina} totalPages={pagina.totalPaginas} onPageChange={setPage} totalItems={pagina.totalItems} pageSize={PAGE_SIZE} />}
        />
      )}

      <p className="footnote">
        <Info size={14} aria-hidden="true" />
        "Cerca del mínimo" significa hasta 1,5 veces el stock mínimo. Las cantidades cambian mediante movimientos de inventario,
        que la API todavía no permite registrar desde esta interfaz.
      </p>
    </section>
  );
}
