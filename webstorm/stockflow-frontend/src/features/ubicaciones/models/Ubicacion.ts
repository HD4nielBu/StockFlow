/** Coincide con el enum TipoUbicacion de Java y el CHECK de PostgreSQL. */
export const TIPOS_UBICACION = ['ALMACEN_CENTRAL', 'DEPOSITO', 'PUNTO_CONSUMO'] as const;
export type TipoUbicacion = (typeof TIPOS_UBICACION)[number];

export const TIPO_UBICACION_LABEL: Record<TipoUbicacion, string> = {
  ALMACEN_CENTRAL: 'Almacén central',
  DEPOSITO: 'Depósito',
  PUNTO_CONSUMO: 'Punto de consumo',
};

/** Contrato de UbicacionResponse (GET /api/ubicaciones). */
export interface Ubicacion {
  id: number;
  codigo: string;
  nombre: string;
  tipo: TipoUbicacion;
  direccion: string | null;
  activo: boolean;
}

/** CrearUbicacionRequest: sin id ni activo. tipo es opcional (el backend usa DEPOSITO por defecto). */
export interface UbicacionCreateRequest {
  codigo: string;
  nombre: string;
  tipo: TipoUbicacion;
  direccion: string | null;
}
