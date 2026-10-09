import { Meter } from '../../../components/ui/Meter';
import type { StatusTone } from '../../../components/ui/StatusBar';
import { formatoCantidad } from '../../../shared/utils/formato';
import { TONO_ESTADO } from '../utils/estadoVisual';
import { estadoExistencia, type Cobertura } from '../utils/indicadores';
const tono = (c: Cobertura): StatusTone => TONO_ESTADO[estadoExistencia(c.existencia)];

/**
 * Existencias ordenadas por cobertura de su mínimo. El medidor se llena al llegar a 2 × mínimo:
 * más allá ya no hay urgencia que comparar. La cifra exacta siempre va como texto.
 */
export function CoberturaList({ items }: { items: Cobertura[] }) {
  return (
    <ul className="coverage-list">
      {items.map((c) => {
        const pct = Math.round(c.ratio * 100);
        return (
          <li key={c.existencia.stockId} className="coverage-list__item">
            <span className="coverage-list__text">
              <span className="coverage-list__title">{c.existencia.producto}</span>
              <span className="coverage-list__meta">{c.existencia.ubicacion}</span>
            </span>
            <span className="coverage-list__figures">
              <span className="num">
                {formatoCantidad(c.existencia.cantidad)} / {formatoCantidad(c.existencia.stockMinimo)}
              </span>
              <span className="coverage-list__pct">{pct} % del mínimo</span>
            </span>
            <span className="coverage-list__meter">
              <Meter value={c.ratio / 2} tone={tono(c)} label={`${pct} % del stock mínimo`} />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
