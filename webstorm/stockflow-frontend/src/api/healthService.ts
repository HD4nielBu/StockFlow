import { apiFetch } from './apiClient';

/** Respuesta de GET /api/health (HealthController del backend). */
export interface HealthResponse {
  application: string;
  status: string;
  timestamp: string;
}

export const healthService = {
  /** ¿Responde el backend? Lo usa la pantalla de acceso para avisar antes de entrar. */
  comprobar(signal?: AbortSignal): Promise<HealthResponse> {
    return apiFetch<HealthResponse>('/health', { signal });
  },
};
