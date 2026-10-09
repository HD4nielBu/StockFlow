import { useCallback, useEffect, useState } from 'react';
import type { PaginaResponse } from '../../../api/PaginaResponse';
import { isAbortError } from '../../../shared/utils/isAbortError';
import type { MovimientoKardex } from '../models/MovimientoKardex';
import { inventarioService } from '../services/inventarioService';

type Resultado = { key: string; data: PaginaResponse<MovimientoKardex> | null; error: unknown };

/**
 * Kardex paginado EN EL SERVIDOR. Cada cambio de producto/página aborta la petición anterior:
 * una respuesta lenta de la página 1 nunca pisa a la de la página 2.
 * El resultado se guarda junto a la clave de la petición que lo produjo; "cargando" se DERIVA
 * (la clave actual todavía no tiene resultado) en lugar de guardarse en otro estado.
 * Devuelve el error crudo para que la Page lo traduzca (404, 422...).
 */
export function useKardex(productoId: number | null, pagina: number, tamano: number) {
  const [reloadToken, setReloadToken] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  // Último resultado con datos: se sigue mostrando (atenuado) mientras llega la página siguiente
  const [anterior, setAnterior] = useState<Resultado | null>(null);
  const reload = useCallback(() => setReloadToken((v) => v + 1), []);
  const key = `${productoId}:${pagina}:${tamano}:${reloadToken}`;

  useEffect(() => {
    if (productoId === null) return;
    const controller = new AbortController();
    inventarioService
      .kardex(productoId, pagina, tamano, controller.signal)
      .then((data) => {
        const r = { key, data, error: null };
        setResultado(r);
        setAnterior(r);
      })
      .catch((error) => {
        if (!isAbortError(error)) setResultado({ key, data: null, error });
      });
    return () => controller.abort();
  }, [productoId, pagina, tamano, key]);

  if (productoId === null) return { data: null, loading: false, error: null, reload };
  const actual = resultado?.key === key ? resultado : null;
  const mismoProducto = anterior?.key.startsWith(`${productoId}:`) ?? false;
  return {
    data: actual ? actual.data : mismoProducto ? (anterior?.data ?? null) : null,
    loading: actual === null,
    error: actual?.error ?? null,
    reload,
  };
}
