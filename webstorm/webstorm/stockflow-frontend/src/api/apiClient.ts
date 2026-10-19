import { API_URL } from '../config/env';

/**
 * Formato de error del backend StockFlow (GlobalExceptionHandler -> ApiErrorResponse).
 * Todas las respuestas 400/404/409/422/500 traen esta forma.
 */
export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors: Record<string, string>;
}

/**
 * Error HTTP con el status y los errores por campo que envió el backend.
 * Nota: los campos se declaran explícitamente porque el tsconfig de Vite usa erasableSyntaxOnly,
 * que no permite "parameter properties" como constructor(public status: number).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string>;

  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Lee el cuerpo de error: si es el JSON de StockFlow usa su message; si no, el texto o el statusText. */
async function construirError(response: Response): Promise<ApiError> {
  const texto = await response.text();
  try {
    const cuerpo = JSON.parse(texto) as Partial<ApiErrorResponse>;
    if (cuerpo && typeof cuerpo.message === 'string') {
      return new ApiError(response.status, cuerpo.message, cuerpo.fieldErrors ?? {});
    }
  } catch {
    // No era JSON (por ejemplo, un error de un proxy): se usa el texto tal cual
  }
  return new ApiError(response.status, texto || response.statusText || `Error HTTP ${response.status}`);
}

/**
 * Única puerta HTTP del frontend (G05): URL base, cabecera JSON, verificación de response.ok,
 * conversión de errores y lectura del cuerpo. fetch NO rechaza la Promise ante un 404 o un 500:
 * por eso se revisa response.ok aquí, en un solo lugar.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!response.ok) {
    throw await construirError(response);
  }
  if (response.status === 204) {
    return undefined as T; // DELETE exitoso: no hay cuerpo que leer
  }
  return (await response.json()) as T;
}

/** Mensaje legible para mostrar en pantalla a partir de cualquier error. */
export function mensajeDeError(error: unknown, porDefecto = 'Ocurrió un error inesperado'): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof TypeError) {
    // fetch lanza TypeError cuando no llega a ningún servidor (backend apagado, CORS, URL mal escrita)
    return 'No se pudo conectar con el backend. ¿Está corriendo StockFlowApplication en el puerto 8080?';
  }
  return error instanceof Error ? error.message : porDefecto;
}
