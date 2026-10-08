import { apiFetch } from '../../../api/apiClient';
import type { Existencia } from '../models/Existencia';

export const inventarioService = {
  /** RF-20: existencias en o bajo su stock mínimo, por producto y ubicación. */
  stockBajoMinimo(signal?: AbortSignal): Promise<Existencia[]> {
    return apiFetch<Existencia[]>('/inventario/stock?soloBajoMinimo=true', { signal });
  },
};
