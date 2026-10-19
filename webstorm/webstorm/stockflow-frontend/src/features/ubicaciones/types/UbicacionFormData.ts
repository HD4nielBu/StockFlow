import type { TipoUbicacion } from '../models/Ubicacion';

/** Estado del formulario: todo texto mientras se escribe. */
export interface UbicacionFormData {
  codigo: string;
  nombre: string;
  tipo: TipoUbicacion;
  direccion: string;
}
