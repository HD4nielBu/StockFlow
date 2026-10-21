import { Tooltip } from '../../../components/ui/Tooltip';
import type { MovimientosSemana } from '../models/MovimientosSemana';

const fecha = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' });
const dia = new Intl.DateTimeFormat('es', { day: 'numeric' });
const mes = new Intl.DateTimeFormat('es', { month: 'short' });
/** "2026-10-13" es una fecha local: sin la hora, Date la leería como UTC y podría caer el domingo anterior. */
const local = (semana: string) => new Date(`${semana}T00:00`);
const etiqueta = (semana: string) => fecha.format(local(semana));

/**
 * Columnas agrupadas: entradas y salidas por semana. Dos series → leyenda siempre visible.
 * Cada semana es enfocable y su aria-label tiene los dos valores, así que el gráfico no depende del color.
 */
export function MovimientosSemanales({ semanas }: { semanas: MovimientosSemana[] }) {
  const max = Math.max(1, ...semanas.flatMap((s) => [s.entradas, s.salidas]));
  const total = (campo: 'entradas' | 'salidas') => semanas.reduce((suma, s) => suma + s[campo], 0);
  return (
    <div className="week-chart">
      <div className="week-chart__legend">
        <span className="week-chart__key week-chart__key--in">Entradas · {total('entradas')}</span>
        <span className="week-chart__key week-chart__key--out">Salidas · {total('salidas')}</span>
      </div>
      <div className="week-chart__plot">
        {semanas.map((s) => {
          const texto = `Semana del ${etiqueta(s.semana)}: ${s.entradas} entradas y ${s.salidas} salidas`;
          return (
            <Tooltip key={s.semana} content={texto} describe={false}>
              <div className="week-chart__week" tabIndex={0} role="img" aria-label={texto}>
                <span className="week-chart__bars" aria-hidden="true">
                  <span className="week-chart__bar week-chart__bar--in" style={{ height: `${(s.entradas / max) * 100}%` }} />
                  <span className="week-chart__bar week-chart__bar--out" style={{ height: `${(s.salidas / max) * 100}%` }} />
                </span>
                {/* Día y mes en dos líneas: en un celular "21 sept" no entra en el ancho de una columna */}
                <span className="week-chart__label" aria-hidden="true">
                  <span>{dia.format(local(s.semana))}</span>
                  <span>{mes.format(local(s.semana))}</span>
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
