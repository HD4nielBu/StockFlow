import { useMemo, useState } from 'react';
import { mensajeDeError } from '../../../api/apiClient';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Modal } from '../../../components/ui/Modal';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { normalizar } from '../../../shared/utils/paginar';
import { inventarioService } from '../../inventario/services/inventarioService';
import UbicacionCards from '../components/UbicacionCards';
import UbicacionForm from '../components/UbicacionForm';
import { useUbicaciones } from '../hooks/useUbicaciones';
import { ETIQUETA_TIPO, TIPOS_UBICACION, type TipoUbicacion, type Ubicacion } from '../models/Ubicacion';
import { ubicacionService } from '../services/ubicacionService';

const OPCIONES_TIPO = [{ value: '', label: 'Todos los tipos' }, ...TIPOS_UBICACION.map((t) => ({ value: t, label: ETIQUETA_TIPO[t] }))];

/**
 * RF-07: ubicaciones (almacén central, depósitos y puntos de consumo).
 * - El filtro por tipo va al backend (?tipo=) y cancela la petición anterior (G08).
 * - La búsqueda por texto es un dato derivado en el cliente (G09).
 * - "Ver detalle" usa GET /ubicaciones/{id} para mostrar la versión actual del servidor (G06).
 */
export default function UbicacionesPage() {
  const [tipo, setTipo] = useState<TipoUbicacion | ''>('');
  const [search, setSearch] = useState('');
  const ubicaciones = useUbicaciones(tipo);
  const existencias = useAsyncList(inventarioService.listarStock);

  const [detalle, setDetalle] = useState<Ubicacion | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const existenciasPorUbicacion = useMemo(() => {
    const conteo = new Map<number, number>();
    existencias.data.forEach((e) => conteo.set(e.ubicacionId, (conteo.get(e.ubicacionId) ?? 0) + 1));
    return conteo;
  }, [existencias.data]);

  const termino = normalizar(search);
  const visibles = ubicaciones.data.filter(
    (u) => !termino || [u.codigo, u.nombre, u.direccion].some((campo) => normalizar(campo).includes(termino)),
  );

  const handleCreated = (creada: Ubicacion) => {
    // Sólo se agrega si coincide con el filtro de tipo que se está viendo
    if (!tipo || creada.tipo === tipo) ubicaciones.setData((prev) => [...prev, creada]);
    setSuccess(`Ubicación ${creada.codigo} registrada`);
    window.setTimeout(() => setSuccess(''), 3000);
  };

  const handleVer = async (id: number) => {
    try {
      setCargandoDetalle(true);
      setError('');
      setDetalle(await ubicacionService.obtenerPorId(id));
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudo cargar la ubicación'));
    } finally {
      setCargandoDetalle(false);
    }
  };

  return (
    <section className="page-stack page-ubicaciones">
      <div className="page-heading">
        <p className="eyebrow">Almacén y depósitos · RF-07</p>
        <h1>Ubicaciones</h1>
        <p>Dónde se guarda el inventario. El stock se controla por producto y ubicación.</p>
      </div>

      {(ubicaciones.error || error) && <Alert kind="error">{ubicaciones.error || error}</Alert>}
      {success && <Alert kind="success">{success}</Alert>}
      {cargandoDetalle && <div className="state-card">Cargando detalle...</div>}

      <UbicacionForm onCreated={handleCreated} />

      <div className="toolbar">
        <SearchInput value={search} label="Buscar ubicación" placeholder="Código, nombre o dirección" onChange={setSearch} />
        <SelectFilter label="Tipo" value={tipo} options={OPCIONES_TIPO} onChange={(v) => setTipo(v as TipoUbicacion | '')} />
      </div>

      {ubicaciones.loading ? (
        <div className="state-card">Cargando ubicaciones...</div>
      ) : visibles.length === 0 ? (
        <EmptyState
          title={ubicaciones.data.length === 0 ? 'No hay ubicaciones de este tipo' : 'Ninguna ubicación coincide con la búsqueda'}
          description="Registra una con el formulario o cambia el filtro."
        />
      ) : (
        <UbicacionCards ubicaciones={visibles} existenciasPorUbicacion={existenciasPorUbicacion} onVer={handleVer} />
      )}

      <Modal open={detalle !== null} title={detalle ? `${detalle.codigo} · ${detalle.nombre}` : ''} onClose={() => setDetalle(null)}>
        {detalle && (
          <dl className="detalle-lista">
            <dt>Tipo</dt>
            <dd>{ETIQUETA_TIPO[detalle.tipo]}</dd>
            <dt>Dirección</dt>
            <dd>{detalle.direccion ?? 'Sin dirección registrada'}</dd>
            <dt>Estado</dt>
            <dd>
              <StatusBadge active={detalle.activo} />
            </dd>
            <dt>Productos con existencia</dt>
            <dd>{existenciasPorUbicacion.get(detalle.id) ?? 0}</dd>
          </dl>
        )}
        <div className="modal__actions">
          <Button variant="secondary" onClick={() => setDetalle(null)}>
            Cerrar
          </Button>
        </div>
      </Modal>
    </section>
  );
}
