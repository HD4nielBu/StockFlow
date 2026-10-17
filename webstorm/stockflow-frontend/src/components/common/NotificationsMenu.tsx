import { Bell, BellOff, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router';
import { inventarioService } from '../../features/inventario/services/inventarioService';
import { useAsyncList } from '../../shared/hooks/useAsyncList';
import { Skeleton } from '../ui/LoadingSkeleton';
import { Popover } from '../ui/Popover';

const MAX_ITEMS = 5;

/**
 * Alertas REALES: existencias en o bajo su stock mínimo (GET /api/inventario/stock?soloBajoMinimo=true, RF-20).
 * No se inventan notificaciones; si el backend no responde, se dice.
 */
export default function NotificationsMenu() {
  const { data: alertas, loading, error, reload } = useAsyncList(inventarioService.stockBajoMinimo);
  const count = alertas.length;
  const label = loading ? 'Alertas de stock' : count === 0 ? 'Alertas de stock: ninguna' : `Alertas de stock: ${count}`;

  return (
    <Popover
      label="Alertas de stock"
      className="notifications"
      trigger={(props) => (
        <button {...props} type="button" className="icon-button topbar__icon-button notifications__trigger" aria-label={label}>
          <Bell size={18} aria-hidden="true" />
          {count > 0 && (
            <span className="notifications__count" aria-hidden="true">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      )}
    >
      <>
        <div className="notifications__header">
          <h2>Alertas de stock</h2>
          <button type="button" className="link-button" onClick={reload} disabled={loading}>
            Actualizar
          </button>
        </div>
        {loading ? (
          <div className="notifications__list" aria-busy="true">
            {[0, 1].map((i) => (
              <div key={i} className="notifications__item">
                <Skeleton width={28} height={28} radius={8} />
                <span style={{ flex: 1, display: 'grid', gap: 6 }}>
                  <Skeleton width="70%" />
                  <Skeleton width="45%" height={11} />
                </span>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="notifications__empty">No se pudieron cargar las alertas. {error}</p>
        ) : count === 0 ? (
          <div className="notifications__empty">
            <BellOff size={20} aria-hidden="true" />
            <p>Todas las existencias están por encima de su mínimo.</p>
          </div>
        ) : (
          <ul className="notifications__list">
            {alertas.slice(0, MAX_ITEMS).map((a) => (
              <li key={a.stockId} className="notifications__item">
                <span className="notifications__icon" aria-hidden="true">
                  <TriangleAlert size={15} />
                </span>
                <span className="notifications__text">
                  <span className="notifications__title">{a.producto}</span>
                  <span className="notifications__meta">
                    {a.ubicacion}: {a.cantidad} de {a.stockMinimo} mínimo
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="notifications__footer">
          <Link to="/existencias?estado=bajo" className="link-button">
            Ver existencias
          </Link>
        </div>
      </>
    </Popover>
  );
}
