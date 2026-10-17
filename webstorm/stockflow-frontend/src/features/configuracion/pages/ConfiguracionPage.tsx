import { CircleCheck, CircleX, Plug, RotateCw, Save } from 'lucide-react';
import { healthService } from '../../../api/healthService';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import ThemeSelector from '../../../components/common/ThemeSelector';
import { DemoBadge } from '../../../components/ui/DemoBadge';
import { Field, Input, Select } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Skeleton } from '../../../components/ui/LoadingSkeleton';
import { Tabs } from '../../../components/ui/Tabs';
import { UnavailableButton } from '../../../components/ui/UnavailableButton';
import { API_URL } from '../../../config/env';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { FACTOR_CERCA_MINIMO } from '../../inventario/utils/indicadores';

const SIN_BACKEND = 'El backend todavía no tiene un endpoint de configuración.';

// useAsyncList trabaja con listas: el health se envuelve en un arreglo de un elemento
const cargarHealth = async (signal: AbortSignal) => [await healthService.comprobar(signal)];

/**
 * Mezcla honesta: Apariencia y Sistema funcionan de verdad; los datos de la organización son DEMO
 * (no hay dónde guardarlos) y sus controles están desactivados.
 */
export default function ConfiguracionPage() {
  return (
    <section className="page-stack">
      <PageHeader title="Configuración" description="Preferencias de la interfaz y estado de la conexión con el servidor." />
      <Tabs
        label="Secciones de configuración"
        items={[
          { id: 'apariencia', label: 'Apariencia', panel: <AparienciaPanel /> },
          { id: 'sistema', label: 'Sistema', panel: <SistemaPanel /> },
          {
            id: 'organizacion',
            label: (
              <span className="tab-with-badge">
                Organización <DemoBadge />
              </span>
            ),
            panel: <OrganizacionPanel />,
          },
        ]}
      />
    </section>
  );
}

function AparienciaPanel() {
  return (
    <Card title="Tema" description="Se aplica al instante y se recuerda en este navegador.">
      <ThemeSelector />
    </Card>
  );
}

function SistemaPanel() {
  const health = useAsyncList(cargarHealth);
  const estado = health.data[0];
  return (
    <div className="page-stack">
      <Card
        title="Conexión con el backend"
        description="Comprueba si el servidor de StockFlow responde."
        actions={
          <Button variant="secondary" size="sm" icon={RotateCw} onClick={health.reload} loading={health.loading} loadingText="Comprobando">
            Comprobar
          </Button>
        }
      >
        <dl className="definition-list">
          <div>
            <dt>Estado</dt>
            <dd>
              {health.loading ? (
                <Skeleton width={90} />
              ) : health.error ? (
                <Badge tone="danger">
                  <CircleX size={12} aria-hidden="true" />
                  Sin conexión
                </Badge>
              ) : (
                <Badge tone="success">
                  <CircleCheck size={12} aria-hidden="true" />
                  {estado?.status === 'OK' ? 'Conectado' : (estado?.status ?? 'Desconocido')}
                </Badge>
              )}
            </dd>
          </div>
          {health.error && (
            <div>
              <dt>Detalle</dt>
              <dd>{health.error}</dd>
            </div>
          )}
          <div>
            <dt>URL de la API</dt>
            <dd>
              <code>{API_URL}</code>
            </dd>
          </div>
          {estado && (
            <>
              <div>
                <dt>Aplicación</dt>
                <dd>{estado.application}</dd>
              </div>
              <div>
                <dt>Hora del servidor</dt>
                <dd>{new Date(estado.timestamp).toLocaleString('es-BO')}</dd>
              </div>
            </>
          )}
        </dl>
      </Card>
      <Card title="Criterios de la interfaz" description="Reglas de presentación que aplica el frontend (no se guardan en el servidor).">
        <dl className="definition-list">
          <div>
            <dt>Franja "cerca del mínimo"</dt>
            <dd>Hasta {String(FACTOR_CERCA_MINIMO).replace('.', ',')} × el stock mínimo</dd>
          </div>
          <div>
            <dt>Entorno</dt>
            <dd>{import.meta.env.MODE === 'production' ? 'Producción' : 'Desarrollo'}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

function OrganizacionPanel() {
  return (
    <Card
      title="Datos de la organización"
      description="Valores de ejemplo. No se pueden guardar porque el servidor aún no los admite."
      actions={
        <UnavailableButton size="sm" icon={Save} reason={SIN_BACKEND}>
          Guardar
        </UnavailableButton>
      }
    >
      <fieldset className="demo-fieldset" disabled>
        <legend className="sr-only">Datos de la organización (demostración, solo lectura)</legend>
        <div className="form-grid">
          <Field label="Nombre de la organización">
            {(control) => <Input {...control} defaultValue="Universidad (demo)" />}
          </Field>
          <Field label="Moneda de referencia">
            {(control) => (
              <Select {...control} defaultValue="BOB">
                <option value="BOB">Boliviano (Bs)</option>
              </Select>
            )}
          </Field>
          <Field label="Zona horaria">
            {(control) => (
              <Select {...control} defaultValue="America/La_Paz">
                <option value="America/La_Paz">América/La Paz (UTC−4)</option>
              </Select>
            )}
          </Field>
          <Field label="Correo para alertas de stock">
            {(control) => <Input {...control} type="email" defaultValue="almacen@demo.stockflow" />}
          </Field>
        </div>
      </fieldset>
      <p className="demo-note">
        <Plug size={14} aria-hidden="true" />
        Cuando exista el endpoint, este formulario se conectará y se habilitará.
      </p>
    </Card>
  );
}
