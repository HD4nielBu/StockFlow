import { useRemoteData } from '../../../shared/hooks/useRemoteData';
import type { TipoUbicacion, Ubicacion } from '../models/Ubicacion';
import { ubicacionService } from '../services/ubicacionService';

/**
 * G08: el filtro por tipo se resuelve en el BACKEND (?tipo=...). Al cambiar de tipo, useRemoteData
 * cancela la petición anterior con AbortController antes de pedir la nueva.
 */
export function useUbicaciones(tipo: TipoUbicacion | '' = '') {
  return useRemoteData<Ubicacion[]>((signal) => ubicacionService.listar(signal, tipo || undefined), [], `tipo=${tipo}`);
}
