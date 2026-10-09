import type { Existencia } from '../features/inventario/models/Existencia';
import type { Ubicacion } from '../features/ubicaciones/models/Ubicacion';

/** Datos de prueba compartidos por los tests de inventario (misma forma que la API). */
export const existenciasMock: Existencia[] = [
  { stockId: 1, productoId: 2, codigoProducto: 'PRD-OFI-002', producto: 'Bolígrafo azul', ubicacionId: 2, codigoUbicacion: 'UB-DEP-NOR', ubicacion: 'Depósito Norte', cantidad: 25, stockMinimo: 100, bajoMinimo: true },
  { stockId: 2, productoId: 1, codigoProducto: 'PRD-OFI-001', producto: 'Resma papel bond A4 75g', ubicacionId: 1, codigoUbicacion: 'UB-CENTRAL', ubicacion: 'Almacén central', cantidad: 25, stockMinimo: 20, bajoMinimo: false },
  { stockId: 3, productoId: 3, codigoProducto: 'PRD-LIM-001', producto: 'Detergente líquido 5L', ubicacionId: 1, codigoUbicacion: 'UB-CENTRAL', ubicacion: 'Almacén central', cantidad: 300, stockMinimo: 10, bajoMinimo: false },
];

export const ubicacionesMock: Ubicacion[] = [
  { id: 1, codigo: 'UB-CENTRAL', nombre: 'Almacén central', tipo: 'ALMACEN_CENTRAL', direccion: 'Parque Industrial', activo: true },
  { id: 2, codigo: 'UB-DEP-NOR', nombre: 'Depósito Norte', tipo: 'DEPOSITO', direccion: null, activo: true },
];
