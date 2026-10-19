import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '../../api/apiClient';
import { isAbortError } from '../utils/isAbortError';

type Loader<T> = (signal: AbortSignal) => Promise<T[]>;

/**
 * G08: patrón genérico para cargar una colección del backend con estado data/loading/error.
 * - El Effect sincroniza la UI con un sistema externo (la API) y devuelve un cleanup que aborta.
 * - loader debe ser una referencia estable (definida fuera del componente), si no el Effect se repetiría.
 * - reload() vuelve a ejecutar la carga cambiando reloadToken.
 */
export function useAsyncList<T>(loader: Loader<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((v) => v + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        setData(await loader(controller.signal));
      } catch (err) {
        if (!isAbortError(err)) setError(mensajeDeError(err, 'Error de carga'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [loader, reloadToken]);

  return { data, setData, loading, error, setError, reload };
}
