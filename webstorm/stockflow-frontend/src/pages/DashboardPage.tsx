import { Boxes, CircleCheck, Coins, Package, RotateCw, TriangleAlert, Warehouse } from 'lucide-react';
import { Alert } from '../components/ui/Alert';
import { BarList } from '../components/ui/BarList';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { CoberturaList } from '../features/inventario/components/CoberturaList';
import { MovimientosSemanales } from '../features/inventario/components/MovimientosSemanales';
import { SaludInventario } from '../features/inventario/components/SaludInventario';
import { useResumenInventario } from '../features/inventario/hooks/useResumenInventario';
import { inventarioService } from '../features/inventario/services/inventarioService';
import { useAsyncList } from '../shared/hooks/useAsyncList';
import {
  existenciasPorUbicacion,
  menorCobertura,
  productosPorCategoria,
  valorReferencial,
} from '../features/inventario/utils/indicadores';
import { formatoPrecio } from '../shared/utils/formato';

/**
 * Indicadores calculados en el navegador a partir de los endpoints reales, salvo los movimientos por semana,
 * que agrega el backend (no se pueden derivar sin descargar todo el kardex).
 */
export default function DashboardPage() {
  const { categorias, productos, existencias, loading, error, reload: recargarResumen } = useResumenInventario();
  const semanal = useAsyncList(inventarioService.movimientosSemanales);
  const reload = () => {
    recargarResumen();
    semanal.reload();
  };

  const activos = productos.filter((p) => p.activo).length;
  const bajo = existencias.filter((e) => e.bajoMinimo).length;
  const ubicaciones = existenciasPorUbicacion(existencias);
  const valor = valorReferencial(existencias, productos);
  const porCategoria = productosPorCategoria(productos, categorias);
  const pctBajo = existencias.length === 0 ? 0 : Math.round((bajo / existencias.length) * 100);

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard"
        description="Indicadores calculados con los datos actuales del catálogo y del inventario."
        reference="Derivado de /api/categorias, /api/productos, /api/inventario/stock y /api/inventario/movimientos/semanal"
        actions={
          <Button variant="secondary" icon={RotateCw} onClick={reload} loading={loading || semanal.loading} loadingText="Actualizando">
            Actualizar
          </Button>
        }
      />

      {error && (
        <Alert kind="error" title="Parte de la información no se pudo cargar">
          {error}
        </Alert>
      )}

      <section aria-label="Indicadores principales" className="stats-grid">
        <StatCard icon={Package} label="Productos activos" value={activos} helper={`de ${productos.length} registrados`} loading={loading} />
        <StatCard
          icon={Boxes}
          label="Existencias registradas"
          value={existencias.length}
          helper={`en ${ubicaciones.length} ubicaciones`}
          loading={loading}
        />
        <StatCard
          icon={TriangleAlert}
          label="Bajo el stock mínimo"
          value={bajo}
          helper={`${pctBajo} % de las existencias`}
          tone={bajo > 0 ? 'warning' : 'success'}
          loading={loading}
        />
        <StatCard
          icon={Coins}
          label="Valor referencial"
          value={formatoPrecio(valor.valor)}
          helper={valor.sinPrecio > 0 ? `Estimado · ${valor.sinPrecio} existencias sin precio` : 'Estimado con el precio referencial'}
          loading={loading}
        />
      </section>

      <Card title="Movimientos por semana" description="Entradas y salidas registradas en las últimas 8 semanas (cantidad de movimientos).">
        {semanal.loading ? (
          <ChartSkeleton rows={3} />
        ) : semanal.error ? (
          <p className="muted-cell">No se pudieron cargar los movimientos. {semanal.error}</p>
        ) : (
          <MovimientosSemanales semanas={semanal.data} />
        )}
      </Card>

      <div className="dashboard-grid">
        <Card title="Productos por categoría" description="Cantidad de productos en cada categoría. Selecciona una para ver sus productos.">
          {loading ? (
            <ChartSkeleton />
          ) : porCategoria.length === 0 ? (
            <p className="muted-cell">No hay categorías registradas.</p>
          ) : (
            <BarList
              label="Productos por categoría"
              items={porCategoria.map((c) => ({ id: c.id, label: c.nombre, value: c.total, to: `/productos?categoria=${c.id}` }))}
            />
          )}
        </Card>

        <Card title="Estado del inventario" description="Existencias según su distancia al stock mínimo.">
          {loading ? <ChartSkeleton rows={3} /> : <SaludInventario existencias={existencias} />}
        </Card>

        <Card title="Productos por ubicación" description="Productos distintos con stock en cada almacén o depósito.">
          {loading ? (
            <ChartSkeleton rows={3} />
          ) : ubicaciones.length === 0 ? (
            <p className="muted-cell">No hay existencias registradas.</p>
          ) : (
            <BarList
              label="Productos por ubicación"
              items={ubicaciones.map((u) => ({
                id: u.ubicacionId,
                label: u.ubicacion,
                value: u.productos,
                hint: u.bajoMinimo > 0 ? `${u.bajoMinimo} bajo el mínimo` : undefined,
              }))}
            />
          )}
        </Card>

        <Card title="Menor cobertura del mínimo" description="Las existencias más cerca de agotarse respecto de su mínimo.">
          {loading ? (
            <ChartSkeleton />
          ) : existencias.length === 0 ? (
            <p className="muted-cell">No hay existencias registradas.</p>
          ) : bajo === 0 && menorCobertura(existencias, 1)[0]?.ratio > 2 ? (
            <div className="inline-empty">
              <CircleCheck size={20} aria-hidden="true" />
              <p>Todas las existencias duplican holgadamente su mínimo.</p>
            </div>
          ) : (
            <CoberturaList items={menorCobertura(existencias, 5)} />
          )}
        </Card>
      </div>

      <p className="footnote">
        <Warehouse size={14} aria-hidden="true" />
        Las cantidades no se suman entre productos porque usan unidades distintas (cajas, litros, kilos…). El valor referencial
        multiplica cada existencia por el precio referencial de su producto; no es un costo contable.
      </p>
    </div>
  );
}

function ChartSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="list-skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="list-skeleton__bar">
          <Skeleton width={`${40 - i * 5}%`} height={12} />
          <Skeleton width={`${90 - i * 15}%`} height={8} />
        </div>
      ))}
    </div>
  );
}
