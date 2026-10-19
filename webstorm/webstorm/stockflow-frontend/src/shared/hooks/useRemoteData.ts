import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { mensajeDeError } from '../../api/apiClient';
import { isAbortError } from '../utils/isAbortError';

/**
 * G08: carga que DEPENDE de parámetros (un id o filtros que van al backend).
 * - `clave` resume esos parámetros (por ejemplo `tipo=DEPOSITO` o `producto=3&pagina=0`).
 * - Cuando la clave cambia, el cleanup ABORTA la petición anterior antes de lanzar la nueva:
 *   si el usuario cambia rápido de filtro, una respuesta vieja nunca pisa a la nueva (race condition).
 * - Un AbortError no se muestra como error: cancelar es parte del flujo normal.
 * Se usa la versión más reciente de `cargar` (ref) para que la Page pueda pasar una función inline.
 */
export function useRemoteData<T>(cargar: (signal: AbortSignal) => Promise<T>, inicial: T, clave: string) {
  const [data, setData] = useState<T>(inicial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const cargarRef = useRef(cargar);

  useLayoutEffect(() => {
    cargarRef.current = cargar;
  });

  const reload = useCallback(() => setReloadToken((v) => v + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const resultado = await cargarRef.current(controller.signal);
        if (!controller.signal.aborted) setData(resultado);
      } catch (err) {
        if (!isAbortError(err) && !controller.signal.aborted) setError(mensajeDeError(err, 'Error de carga'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [clave, reloadToken]);

  return { data, setData, loading, error, setError, reload };
}
