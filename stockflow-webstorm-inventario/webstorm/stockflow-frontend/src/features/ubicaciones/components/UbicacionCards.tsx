import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { ETIQUETA_TIPO, type Ubicacion } from '../models/Ubicacion';

interface UbicacionCardsProps {
  ubicaciones: Ubicacion[];
  /** Existencias registradas por ubicación (dato derivado que calcula la Page). */
  existenciasPorUbicacion?: Map<number, number>;
  onVer: (id: number) => void;
}

/** Cada ubicación es una tarjeta (pin del mapa). Sólo muestra y emite la intención "ver detalle". */
export default function UbicacionCards({ ubicaciones, existenciasPorUbicacion, onVer }: UbicacionCardsProps) {
  return (
    <ul className="ubicaciones-grid">
      {ubicaciones.map((u) => (
        <li key={u.id} className={`ubicacion-card ubicacion-card--${u.tipo.toLowerCase()}`}>
          <span className="ubicacion-card__tipo">{ETIQUETA_TIPO[u.tipo]}</span>
          <strong className="ubicacion-card__codigo">{u.codigo}</strong>
          <span className="ubicacion-card__nombre">{u.nombre}</span>
          <span className="ubicacion-card__direccion">{u.direccion ?? 'Sin dirección registrada'}</span>
          <span className="ubicacion-card__existencias">
            {existenciasPorUbicacion?.get(u.id) ?? 0} productos con existencia
          </span>
          <div className="ubicacion-card__pie">
            <StatusBadge active={u.activo} />
            <Button variant="secondary" onClick={() => onVer(u.id)} aria-label={`Ver ${u.nombre}`}>
              Ver detalle
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
