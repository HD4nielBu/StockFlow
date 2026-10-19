/** Coincide con el enum TipoUbicacion de Java y con el CHECK ck_ubicacion_tipo de PostgreSQL. */
export const TIPOS_UBICACION = ['ALMACEN_CENTRAL', 'DEPOSITO', 'PUNTO_CONSUMO'] as const;
export type TipoUbicacion = (typeof TIPOS_UBICACION)[number];

export const ETIQUETA_TIPO: Record<TipoUbicacion, string> = {
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
