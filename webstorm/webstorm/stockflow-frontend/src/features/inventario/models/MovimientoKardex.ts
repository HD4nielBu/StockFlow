/** Contrato de MovimientoKardexResponse (GET /api/inventario/kardex/{productoId}). */
export interface MovimientoKardex {
  movimientoId: number;
  /** Instant en ISO-8601 (UTC), por ejemplo "2026-10-15T14:20:00Z". */
  ocurridoAt: string;
  ubicacion: string;
  tipo: string;
  entrada: number;
  salida: number;
  saldoResultante: number;
  referenciaTipo: string;
  registradoPor: string;
  motivo: string | null;
}
