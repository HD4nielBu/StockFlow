import { ArrowDownLeft, ArrowUpRight, Boxes, Gauge, Info, PackageSearch, RotateCw, ScrollText } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { describirError } from '../../../api/describirError';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { DataTable, type Column } from '../../../components/ui/DataTable';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Field, Select } from '../../../components/ui/Field';
import { TableSkeleton } from '../../../components/ui/LoadingSkeleton';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Pagination } from '../../../components/ui/Pagination';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { StatCard } from '../../../components/ui/StatCard';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { formatoCantidad } from '../../../shared/utils/formato';
import { UNIDAD_LABEL } from '../../productos/models/Producto';
import { useProductos } from '../../productos/hooks/useProductos';
import { ubicacionService } from '../../ubicaciones/services/ubicacionService';
import { useKardex } from '../hooks/useKardex';
import { TIPO_MOVIMIENTO_LABEL, type MovimientoKardex } from '../models/MovimientoKardex';
import { inventarioService } from '../services/inventarioService';

const TAMANOS = [10, 20, 50].map((n) => ({ value: String(n), label: `${n} por página` }));
const fechaHora = new Intl.DateTimeFormat('es-BO', { dateStyle: 'medium', timeStyle: 'short' });

/**
 * RF-19: kardex de un producto (GET /api/inventario/kardex/{id}, paginado en el servidor).
 * Producto, página y tamaño viven en la URL: el enlace "Ver kardex" de Existencias llega aquí.
 * No hay botón "Registrar movimiento": la API todavía no lo expone.
 */
export default function MovimientosPage() {
  const [params, setParams] = useSearchParams();
  const productos = useProductos();
  const ubicaciones = useAsyncList(ubicacionService.listar);
  const existencias = useAsyncList(inventarioService.listarExistencias);

  const productoId = Number(params.get('producto')) || null;
  const pagina = Math.max(1, Number(params.get('pagina')) || 1);
  const tamano = Number(params.get('tamano')) || 10;
  const kardex = useKardex(productoId, pagina - 1, tamano); // la API cuenta páginas desde 0

  const actualizar = (cambios: Record<string, string | null>) => {
    const siguiente = new URLSearchParams(params);
    Object.entries(cambios).forEach(([k, v]) => (v === null ? siguiente.delete(k) : siguiente.set(k, v)));
    setParams(siguiente, { replace: true });
  };

  const producto = productos.data.find((p) => p.id === productoId);
  const nombreUbicacion = useMemo(() => new Map(ubicaciones.data.map((u) => [u.codigo, u.nombre])), [ubicaciones.data]);
  const stockProducto = existencias.data.filter((e) => e.productoId === productoId);
  const stockTotal = stockProducto.reduce((sum, e) => sum + e.cantidad, 0);
  const errorKardex = kardex.error ? describirError(kardex.error, 'cargar el kardex') : null;

  const columns: Column<MovimientoKardex>[] = [
    {
      key: 'fecha',
      header: 'Fecha',
      mobile: 'primary',
      cell: (m) => (
        <span className="cell-stack">
          <span className="cell-title">{fechaHora.format(new Date(m.ocurridoAt))}</span>
          {m.motivo && <span className="cell-sub">{m.motivo}</span>}
        </span>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      cell: (m) => {
        const ingreso = m.entrada > 0;
        const Icon = ingreso ? ArrowDownLeft : ArrowUpRight;
        return (
          <Badge tone={ingreso ? 'info' : 'neutral'}>
            <Icon size={12} aria-hidden="true" />
            {TIPO_MOVIMIENTO_LABEL[m.tipo] ?? m.tipo}
          </Badge>
        );
      },
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      cell: (m) => nombreUbicacion.get(m.ubicacion) ?? <span className="code-cell">{m.ubicacion}</span>,
    },
    {
      key: 'entrada',
      header: 'Entrada',
      align: 'end',
      cell: (m) => (m.entrada > 0 ? <span className="num delta delta--in">+{formatoCantidad(m.entrada)}</span> : <span className="muted-cell">—</span>),
    },
    {
      key: 'salida',
      header: 'Salida',
      align: 'end',
      cell: (m) => (m.salida > 0 ? <span className="num delta">−{formatoCantidad(m.salida)}</span> : <span className="muted-cell">—</span>),
    },
    { key: 'saldo', header: 'Saldo', align: 'end', cell: (m) => <span className="num cell-title">{formatoCantidad(m.saldoResultante)}</span> },
    {
      key: 'registro',
      header: 'Registro',
      cell: (m) => (
        <span className="cell-stack">
          <span>{m.registradoPor ?? '—'}</span>
          {m.referenciaTipo && <span className="cell-sub">Ref.: {m.referenciaTipo.toLowerCase()}</span>}
        </span>
      ),
    },
  ];

  const opcionesProducto = [...productos.data].sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <section className="page-stack">
      <PageHeader
        title="Movimientos"
        description="Kardex de cada producto: entradas, salidas y saldo por ubicación."
        reference="RF-19 · GET /api/inventario/kardex/{productoId}?pagina&tamano"
      />

      <div className="filters">
        <div className="filters__product">
          <Field label="Producto">
            {(control) => (
              <Select
                {...control}
                value={productoId ? String(productoId) : ''}
                onChange={(e) => actualizar({ producto: e.target.value || null, pagina: null })}
                disabled={productos.loading}
              >
                <option value="">{productos.loading ? 'Cargando productos…' : 'Elige un producto'}</option>
                {opcionesProducto.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} ({p.codigo})
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </div>

      {productos.error && <Alert kind="error" title="No se pudieron cargar los productos">{productos.error}</Alert>}

      {!productoId ? (
        <EmptyState icon={PackageSearch} title="Elige un producto" description="Verás cada entrada y salida con el saldo resultante en su ubicación." />
      ) : (
        <>
          {producto && (
            <section aria-label={`Resumen de ${producto.nombre}`} className="stats-grid">
              <StatCard icon={ScrollText} label="Movimientos" value={kardex.data?.totalElementos ?? 0} helper="registrados en el kardex" loading={kardex.loading && !kardex.data} />
              <StatCard
                icon={Boxes}
                label="Stock actual"
                value={formatoCantidad(stockTotal)}
                helper={`${UNIDAD_LABEL[producto.unidadMedida]} · en ${stockProducto.length} ubicaciones`}
                loading={existencias.loading}
              />
              <StatCard icon={Gauge} label="Stock mínimo" value={formatoCantidad(producto.stockMinimoDefault)} helper="por ubicación (valor por defecto)" />
            </section>
          )}

          {errorKardex ? (
            <Alert
              kind="error"
              title={errorKardex.title}
              action={
                <Button variant="secondary" size="sm" icon={RotateCw} onClick={kardex.reload}>
                  Reintentar
                </Button>
              }
            >
              {errorKardex.description}
            </Alert>
          ) : kardex.loading && !kardex.data ? (
            <TableSkeleton columns={6} rows={5} label="Cargando kardex" />
          ) : kardex.data && kardex.data.totalElementos === 0 ? (
            <EmptyState icon={ScrollText} title="Sin movimientos" description="Este producto todavía no tiene entradas ni salidas registradas." />
          ) : (
            kardex.data && (
              // Al cambiar de página se mantiene la tabla anterior atenuada: sin saltos de altura
              <div className={kardex.loading ? 'is-refetching' : undefined} aria-busy={kardex.loading || undefined}>
                <DataTable
                  rows={kardex.data.contenido}
                  columns={columns}
                  rowKey={(m) => m.movimientoId}
                  caption={`Kardex de ${producto?.nombre ?? 'producto'}`}
                  footer={
                    <>
                      <Pagination
                        page={kardex.data.pagina + 1}
                        totalPages={Math.max(1, kardex.data.totalPaginas)}
                        totalItems={kardex.data.totalElementos}
                        pageSize={kardex.data.tamano}
                        onPageChange={(p) => actualizar({ pagina: String(p) })}
                      />
                      <SelectFilter
                        label="Filas por página"
                        hideLabel
                        value={String(tamano)}
                        options={TAMANOS}
                        onChange={(v) => actualizar({ tamano: v, pagina: null })}
                      />
                    </>
                  }
                />
              </div>
            )
          )}
        </>
      )}

      <p className="footnote">
        <Info size={14} aria-hidden="true" />
        El saldo es el de la ubicación del movimiento. Registrar entradas, salidas o transferencias desde aquí estará disponible
        cuando la API lo permita.
      </p>
    </section>
  );
}
