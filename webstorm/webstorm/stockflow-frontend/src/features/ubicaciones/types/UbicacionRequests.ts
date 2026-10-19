import type { TipoUbicacion } from '../models/Ubicacion';

/** CrearUbicacionRequest del backend: sin id ni activo (nace activa). */
export interface UbicacionCreateRequest {
  codigo: string;
  nombre: string;
  tipo: TipoUbicacion;
  direccion: string | null;
}
