import type { StatusTone } from '../../../components/ui/StatusBar';
import type { EstadoExistencia } from './indicadores';

/** Cómo se pinta cada estado de una existencia (colores de estado reservados + texto). */
export const TONO_ESTADO: Record<EstadoExistencia, StatusTone> = { bajo: 'critical', cerca: 'warning', ok: 'good' };
export const LABEL_ESTADO: Record<EstadoExistencia, string> = { bajo: 'Bajo el mínimo', cerca: 'Cerca del mínimo', ok: 'Suficiente' };
