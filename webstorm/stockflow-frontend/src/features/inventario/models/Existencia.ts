/** Contrato de ExistenciaResponse (GET /api/inventario/stock). */
export interface Existencia {
  stockId: number;
  productoId: number;
  codigoProducto: string;
  producto: string;
  ubicacionId: number;
  codigoUbicacion: string;
  ubicacion: string;
  cantidad: number;
  stockMinimo: number;
  bajoMinimo: boolean;
}
