/** Contrato de MovimientosSemanaResponse (GET /api/inventario/movimientos/semanal). */
export interface MovimientosSemana {
  /** Lunes de la semana, AAAA-MM-DD en la zona de quien consulta. */
  semana: string;
  /** Cantidad de movimientos (no de unidades). */
  entradas: number;
  salidas: number;
}
