import type { Ubicacion } from '../models/Ubicacion';

/** Misma forma que la semilla V2 del backend. La usan las pruebas automáticas. */
export const ubicacionesMock: Ubicacion[] = [
  { id: 1, codigo: 'UB-CENTRAL', nombre: 'Almacén central', tipo: 'ALMACEN_CENTRAL', direccion: 'Parque Industrial Mz 8', activo: true },
  { id: 2, codigo: 'UB-DEP-NOR', nombre: 'Depósito Norte', tipo: 'DEPOSITO', direccion: 'Av. Banzer km 9', activo: true },
  { id: 3, codigo: 'UB-DEP-SUR', nombre: 'Depósito Sur', tipo: 'DEPOSITO', direccion: 'Av. Santos Dumont 6to anillo', activo: true },
];
