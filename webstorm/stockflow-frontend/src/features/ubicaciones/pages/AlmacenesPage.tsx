import { Boxes, Building2, Info, MapPin, Plus, RotateCw, Store, TriangleAlert, Warehouse, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Skeleton } from '../../../components/ui/LoadingSkeleton';
import { Modal } from '../../../components/ui/Modal';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { useToast } from '../../../components/ui/toast/useToast';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { inventarioService } from '../../inventario/services/inventarioService';
import { existenciasPorUbicacion } from '../../inventario/utils/indicadores';
import UbicacionForm from '../components/UbicacionForm';
import { TIPO_UBICACION_LABEL, type TipoUbicacion, type Ubicacion } from '../models/Ubicacion';
import { ubicacionService } from '../services/ubicacionService';

const ICONO: Record<TipoUbicacion, LucideIcon> = { ALMACEN_CENTRAL: Warehouse, DEPOSITO: Building2, PUNTO_CONSUMO: Store };
const ORDEN: Record<TipoUbicacion, number> = { ALMACEN_CENTRAL: 0, DEPOSITO: 1, PUNTO_CONSUMO: 2 };

/** Ubicaciones (GET/POST /api/ubicaciones) con sus cifras de stock reales (GET /api/inventario/stock). */
export default function AlmacenesPage() {
  const toast = useToast();
  const ubicaciones = useAsyncList(ubicacionService.listar);
  const existencias = useAsyncList(inventarioService.listarExistencias);
  const [tipo, setTipo] = useState<'all' | TipoUbicacion>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const resumen = new Map(existenciasPorUbicacion(existencias.data).map((r) => [r.ubicacionId, r]));
  const cuenta = (t: TipoUbicacion) => ubicaciones.data.filter((u) => u.tipo === t).length;
  const visibles = ubicaciones.data
    .filter((u) => tipo === 'all' || u.tipo === tipo)
    .sort((a, b) => ORDEN[a.tipo] - ORDEN[b.tipo] || a.nombre.localeCompare(b.nombre));

  const handleSaved = (nueva: Ubicacion) => {
    ubicaciones.setData((prev) => [...prev, nueva]);
    setFormOpen(false);
    toast.success(`Ubicación ${nueva.codigo} creada`);
  };

  return (
    <section className="page-stack">
      <PageHeader
        title="Almacenes"
        description="Almacén central, depósitos y puntos de consumo donde se guarda el stock."
        reference="GET/POST /api/ubicaciones · la API no permite editar ni eliminar ubicaciones"
        actions={
          <Button
            icon={Plus}
            onClick={() => {
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
          >
            Nueva ubicación
          </Button>
        }
      />

      {ubicaciones.error && (
        <Alert
          kind="error"
          title="No se pudieron cargar las ubicaciones"
          action={
            <Button variant="secondary" size="sm" icon={RotateCw} onClick={ubicaciones.reload}>
              Reintentar
            </Button>
          }
        >
          {ubicaciones.error}
        </Alert>
      )}

      <div className="filters">
        <SegmentedControl
          label="Tipo de ubicación"
          value={tipo}
          onChange={(v) => setTipo(v as typeof tipo)}
          options={[
            { value: 'all', label: 'Todas', count: ubicaciones.data.length },
            { value: 'ALMACEN_CENTRAL', label: 'Central', count: cuenta('ALMACEN_CENTRAL') },
            { value: 'DEPOSITO', label: 'Depósitos', count: cuenta('DEPOSITO') },
            { value: 'PUNTO_CONSUMO', label: 'Consumo', count: cuenta('PUNTO_CONSUMO') },
          ]}
        />
      </div>

      {ubicaciones.loading ? (
        <div className="location-grid" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="location-card">
              <Skeleton width="50%" height={16} />
              <Skeleton width="30%" />
              <Skeleton width="80%" />
            </div>
          ))}
        </div>
      ) : visibles.length === 0 ? (
        !ubicaciones.error && (
          <EmptyState icon={MapPin} title="No hay ubicaciones de este tipo" description="Crea una con el botón Nueva ubicación." />
        )
      ) : (
        <ul className="location-grid" aria-label="Ubicaciones">
          {visibles.map((u) => {
            const Icon = ICONO[u.tipo];
            const stock = resumen.get(u.id);
            return (
              <li key={u.id} className="location-card">
                <div className="location-card__head">
                  <span className="location-card__icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <span className="location-card__title">
                    <strong>{u.nombre}</strong>
                    <span className="code-cell">{u.codigo}</span>
                  </span>
                  {!u.activo && <Badge>Inactiva</Badge>}
                </div>
                <Badge tone="info" className="location-card__type">
                  {TIPO_UBICACION_LABEL[u.tipo]}
                </Badge>
                <p className="location-card__address">
                  <MapPin size={14} aria-hidden="true" />
                  {u.direccion ?? 'Sin dirección registrada'}
                </p>
                <dl className="location-card__stats">
                  <div>
                    <dt>Productos con stock</dt>
                    <dd>{existencias.loading ? <Skeleton width={24} /> : (stock?.productos ?? 0)}</dd>
                  </div>
                  <div>
                    <dt>Bajo el mínimo</dt>
                    <dd className={stock?.bajoMinimo ? 'location-card__alert' : undefined}>
                      {existencias.loading ? (
                        <Skeleton width={24} />
                      ) : (
                        <>
                          {stock?.bajoMinimo ? <TriangleAlert size={14} aria-hidden="true" /> : null}
                          {stock?.bajoMinimo ?? 0}
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
                <Link to={`/existencias?ubicacion=${u.id}`} className="location-card__link">
                  <Boxes size={15} aria-hidden="true" />
                  Ver existencias<span className="sr-only"> de {u.nombre}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {existencias.error && <Alert kind="warning" title="Las cifras de stock no están disponibles">{existencias.error}</Alert>}

      <p className="footnote">
        <Info size={14} aria-hidden="true" />
        La API permite crear ubicaciones, pero todavía no editarlas ni eliminarlas. Solo puede existir un almacén central.
      </p>

      <Modal open={formOpen} raw title="Nueva ubicación" description="Un lugar físico donde se guarda stock." onClose={() => setFormOpen(false)}>
        <UbicacionForm
          key={formKey}
          hayAlmacenCentral={cuenta('ALMACEN_CENTRAL') > 0}
          onSaved={handleSaved}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </section>
  );
}
