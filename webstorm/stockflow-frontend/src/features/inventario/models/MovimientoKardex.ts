/** Contrato de MovimientoKardexResponse (GET /api/inventario/kardex/{productoId}). */
export interface MovimientoKardex {
  movimientoId: number;
  /** ISO-8601 (UTC). */
  ocurridoAt: string;
  /** Código de la ubicación (p. ej. "UB-CENTRAL"). */
  ubicacion: string;
  /** ENTRADA, SALIDA, AJUSTE_POSITIVO, AJUSTE_NEGATIVO, TRANSFERENCIA_ENTRADA, TRANSFERENCIA_SALIDA. */
  tipo: string;
  entrada: number;
  salida: number;
  saldoResultante: number;
  referenciaTipo: string | null;
  registradoPor: string | null;
  motivo: string | null;
}

/** Nombre legible de cada tipo; un valor nuevo del backend se muestra tal cual en lugar de romper la tabla. */
export const TIPO_MOVIMIENTO_LABEL: Record<string, string> = {
  ENTRADA: 'Entrada',
  SALIDA: 'Salida',
  AJUSTE_POSITIVO: 'Ajuste (+)',
  AJUSTE_NEGATIVO: 'Ajuste (−)',
  TRANSFERENCIA_ENTRADA: 'Transferencia recibida',
  TRANSFERENCIA_SALIDA: 'Transferencia enviada',
};
