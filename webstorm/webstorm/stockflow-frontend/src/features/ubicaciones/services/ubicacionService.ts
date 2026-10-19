import { apiFetch } from '../../../api/apiClient';
import type { TipoUbicacion, Ubicacion } from '../models/Ubicacion';
import type { UbicacionCreateRequest } from '../types/UbicacionRequests';

/**
 * Único lugar que conoce las rutas de ubicaciones (UbicacionController).
 * El backend hoy expone POST, GET y GET/{id}: todavía no tiene PUT ni DELETE.
 */
export const ubicacionService = {
  /** GET /api/ubicaciones (todas) o GET /api/ubicaciones?tipo=DEPOSITO. */
  listar(signal?: AbortSignal, tipo?: TipoUbicacion): Promise<Ubicacion[]> {
    const query = tipo ? `?tipo=${tipo}` : '';
    return apiFetch<Ubicacion[]>(`/ubicaciones${query}`, { signal });
  },
  obtenerPorId(id: number, signal?: AbortSignal): Promise<Ubicacion> {
    return apiFetch<Ubicacion>(`/ubicaciones/${id}`, { signal });
  },
  /** 201 si se creó; 409 si el código ya existe o si ya hay un almacén central activo. */
  crear(data: UbicacionCreateRequest): Promise<Ubicacion> {
    return apiFetch<Ubicacion>('/ubicaciones', { method: 'POST', body: JSON.stringify(data) });
  },
};
