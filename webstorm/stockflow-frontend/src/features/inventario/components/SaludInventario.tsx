import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react';
import { StatusBar } from '../../../components/ui/StatusBar';
import type { Existencia } from '../models/Existencia';
import { saludStock } from '../utils/indicadores';

/** Reparto de las existencias reales en tres estados. "Cerca del mínimo" es un criterio de la UI (≤ 1,5 × mínimo). */
export function SaludInventario({ existencias }: { existencias: Existencia[] }) {
  const salud = saludStock(existencias);
  return (
    <StatusBar
      label={`${salud.total} existencias: ${salud.bajo} bajo el mínimo, ${salud.cerca} cerca del mínimo y ${salud.ok} con stock suficiente`}
      segments={[
        { key: 'bajo', label: 'Bajo el mínimo', value: salud.bajo, tone: 'critical', icon: CircleAlert, hint: 'Reponer cuanto antes' },
        { key: 'cerca', label: 'Cerca del mínimo', value: salud.cerca, tone: 'warning', icon: TriangleAlert, hint: 'Hasta 1,5 veces el mínimo' },
        { key: 'ok', label: 'Stock suficiente', value: salud.ok, tone: 'good', icon: CircleCheck },
      ]}
    />
  );
}
