import {
  ArrowRight,
  Boxes,
  CircleCheck,
  FolderPlus,
  LayoutDashboard,
  MapPin,
  Package,
  PackagePlus,
  RotateCw,
  Tags,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CoberturaList } from '../features/inventario/components/CoberturaList';
import { SaludInventario } from '../features/inventario/components/SaludInventario';
import { primerNombre } from '../features/auth/models/DemoSession';
import { useDemoSession } from '../features/auth/useDemoSession';
import { useResumenInventario } from '../features/inventario/hooks/useResumenInventario';
import { menorCobertura, ultimosRegistrados } from '../features/inventario/utils/indicadores';

function saludo(hora: number) {
  if (hora >= 5 && hora < 12) return 'Buenos días';
  if (hora >= 12 && hora < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

const fechaLarga = new Intl.DateTimeFormat('es-BO', { weekday: 'long', day: 'numeric', month: 'long' });

const ACCESOS = [
  { to: '/productos', state: { nuevo: true }, icon: PackagePlus, title: 'Nuevo producto', text: 'Registra un artículo en el catálogo' },
  { to: '/categorias', state: { nuevo: true }, icon: FolderPlus, title: 'Nueva categoría', text: 'Agrupa productos del mismo tipo' },
  { to: '/existencias', icon: Boxes, title: 'Existencias', text: 'Stock por producto y almacén' },
  { to: '/dashboard', icon: LayoutDashboard, title: 'Dashboard', text: 'Indicadores y gráficos' },
];

/**
 * G10: portada operativa. No crea otra fuente de verdad: todo sale de las colecciones reales
 * (categorías, productos, existencias) y se deriva en cada render.
 */
export default function InicioPage() {
  const { categorias, productos, existencias, loading, error, reload } = useResumenInventario();
  const { session } = useDemoSession();
  // La hora se fija al montar la página: el saludo no debe cambiar en cada re-render
  const [ahora] = useState(() => new Date());
  const fecha = fechaLarga.format(ahora);

  const productosActivos = productos.filter((p) => p.activo).length;
  const categoriasActivas = categorias.filter((c) => c.activo).length;
  const bajoMinimo = existencias.filter((e) => e.bajoMinimo);
  const ubicaciones = new Set(existencias.map((e) => e.ubicacionId)).size;
  const categoriasPorId = new Map(categorias.map((c) => [c.id, c.nombre]));

  return (
    <div className="page-stack">
      <header className="welcome">
        <h1 className="welcome__title">
          {saludo(ahora.getHours())}
          {session && `, ${primerNombre(session.nombre)}`}
        </h1>
        <p className="welcome__subtitle">
          <span className="welcome__date">{fecha.charAt(0).toUpperCase() + fecha.slice(1)}</span>. Esto es lo que pasa hoy en tu inventario.
        </p>
      </header>

      {error && (
        <Alert
          kind="error"
          title="Parte de la información no se pudo cargar"
          action={
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={reload}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <nav aria-label="Accesos rápidos" className="quick-actions">
        {ACCESOS.map((a) => (
          <Link key={a.title} to={a.to} state={a.state} className="quick-action">
            <span className="quick-action__icon" aria-hidden="true">
              <a.icon size={18} />
            </span>
            <span className="quick-action__text">
              <span className="quick-action__title">{a.title}</span>
              <span className="quick-action__desc">{a.text}</span>
            </span>
            <ArrowRight size={16} aria-hidden="true" className="quick-action__arrow" />
          </Link>
        ))}
      </nav>

      <section aria-label="Indicadores" className="stats-grid">
        <StatCard icon={Package} label="Productos" value={productos.length} helper={`${productosActivos} activos`} loading={loading} />
        <StatCard icon={Tags} label="Categorías" value={categorias.length} helper={`${categoriasActivas} activas`} loading={loading} />
        <StatCard
          icon={TriangleAlert}
          label="Bajo el stock mínimo"
          value={bajoMinimo.length}
          helper={bajoMinimo.length === 0 ? 'Nada que reponer' : 'existencias por reponer'}
          tone={bajoMinimo.length > 0 ? 'warning' : 'default'}
          loading={loading}
        />
        <StatCard icon={MapPin} label="Ubicaciones con stock" value={ubicaciones} helper="almacenes y depósitos" loading={loading} />
      </section>

      <div className="home-grid">
        <Card
          title="Alertas de inventario"
          description="Existencias en o por debajo de su stock mínimo."
          actions={
            <Link to="/existencias?estado=bajo" className="link-button">
              Ver existencias
            </Link>
          }
        >
          {loading ? (
            <ListSkeleton />
          ) : bajoMinimo.length === 0 ? (
            <div className="inline-empty">
              <CircleCheck size={20} aria-hidden="true" />
              <p>Todas las existencias están por encima de su mínimo.</p>
            </div>
          ) : (
            <CoberturaList items={menorCobertura(bajoMinimo, 5)} />
          )}
        </Card>

        <Card title="Estado del inventario" description="Cómo están las existencias respecto de su mínimo.">
          {loading ? <ListSkeleton rows={3} /> : <SaludInventario existencias={existencias} />}
        </Card>
      </div>

      <Card
        title="Últimos productos registrados"
        description="Ordenados por número de registro."
        actions={
          <Link to="/productos" className="link-button">
            Ver todos
          </Link>
        }
        flush
      >
        {loading ? (
          <div className="card-pad">
            <ListSkeleton />
          </div>
        ) : productos.length === 0 ? (
          <div className="card-pad">
            <EmptyState icon={PackagePlus} title="Todavía no hay productos" description="Registra el primero desde Productos." />
          </div>
        ) : (
          <ul className="recent-list">
            {ultimosRegistrados(productos, 5).map((p) => (
              <li key={p.id} className="recent-list__item">
                <span className="recent-list__text">
                  <span className="recent-list__title">{p.nombre}</span>
                  <span className="recent-list__meta">
                    <span className="code-cell">{p.codigo}</span> en {categoriasPorId.get(p.categoriaId) ?? `categoría #${p.categoriaId}`}
                  </span>
                </span>
                <StatusBadge active={p.activo} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="list-skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="list-skeleton__row">
          <Skeleton width={`${55 - i * 6}%`} />
          <Skeleton width={56} />
        </div>
      ))}
    </div>
  );
}
