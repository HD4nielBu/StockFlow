import { Link } from 'react-router';
import { Alert } from '../components/ui/Alert';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricCard } from '../components/ui/MetricCard';
import { useCategorias } from '../features/categorias/hooks/useCategorias';
import { inventarioService } from '../features/inventario/services/inventarioService';
import { useProductos } from '../features/productos/hooks/useProductos';
import { useAsyncList } from '../shared/hooks/useAsyncList';

/**
 * G10: el Dashboard no crea otra fuente de verdad. Las métricas son DATOS DERIVADOS de las
 * colecciones que ya entregan los hooks. Con mucho volumen, deberían venir de un endpoint
 * agregado del backend en lugar de descargar todo para contar.
 */
export default function DashboardPage() {
  const categorias = useCategorias();
  const productos = useProductos();
  const stockBajo = useAsyncList(inventarioService.stockBajoMinimo);

  if (categorias.loading || productos.loading || stockBajo.loading) {
    return <div className="state-card">Cargando panel...</div>;
  }
  // || y no ??: un error vacío es '' (no null), así que ?? nunca pasaría al siguiente
  const error = categorias.error || productos.error || stockBajo.error;

  const metricas = {
    categorias: categorias.data.length,
    categoriasActivas: categorias.data.filter((c) => c.activo).length,
    productos: productos.data.length,
    productosActivos: productos.data.filter((p) => p.activo).length,
    alertas: stockBajo.data.length,
  };

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Panel principal</p>
        <h1>Resumen del inventario</h1>
        <p>Datos en vivo desde el backend Spring Boot.</p>
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      <div className="stats-grid">
        <MetricCard label="Categorías" value={metricas.categorias} helper={`${metricas.categoriasActivas} activas`} />
        <MetricCard label="Productos" value={metricas.productos} helper={`${metricas.productosActivos} activos`} />
        <MetricCard
          label="Alertas de stock mínimo"
          value={metricas.alertas}
          helper="existencias en o bajo su mínimo"
          tone={metricas.alertas > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="page-heading">
        <h2>Stock bajo (RF-20)</h2>
        <p>Existencias por producto y ubicación que alcanzaron su stock mínimo.</p>
      </div>
      {stockBajo.data.length === 0 ? (
        <EmptyState title="Sin alertas" description="Todas las existencias están por encima de su mínimo." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Ubicación</th>
                  <th>Cantidad</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.data.map((e) => (
                  <tr key={e.stockId}>
                    <td>
                      <span className="code-cell">{e.codigoProducto}</span> · {e.producto}
                    </td>
                    <td>{e.ubicacion}</td>
                    <td className="danger-cell">{e.cantidad}</td>
                    <td>{e.stockMinimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className="muted-cell">
        Gestiona el catálogo en <Link to="/categorias">Categorías</Link> y <Link to="/productos">Productos</Link>.
      </p>
    </section>
  );
}
