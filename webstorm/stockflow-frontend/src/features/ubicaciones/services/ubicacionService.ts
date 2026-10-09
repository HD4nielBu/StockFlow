import { apiFetch } from '../../../api/apiClient';
import type { Ubicacion, UbicacionCreateRequest } from '../models/Ubicacion';

/** /api/ubicaciones sólo expone listar, buscar por id y crear: no hay PUT ni DELETE. */
export const ubicacionService = {
  listar(signal?: AbortSignal): Promise<Ubicacion[]> {
    return apiFetch<Ubicacion[]>('/ubicaciones', { signal });
  },
  /** 201 · 400 (validación) · 409 (código repetido o un segundo almacén central). */
  crear(data: UbicacionCreateRequest): Promise<Ubicacion> {
    return apiFetch<Ubicacion>('/ubicaciones', { method: 'POST', body: JSON.stringify(data) });
  },
};
