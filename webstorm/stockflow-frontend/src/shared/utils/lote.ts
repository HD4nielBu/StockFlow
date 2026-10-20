import { describirError } from '../../api/describirError';
import type { ToastApi } from '../../components/ui/toast/toastContext';

export interface ResultadoLote<T, R> {
  exitos: { item: T; valor: R }[];
  fallos: { item: T; error: unknown }[];
}

/**
 * Acción masiva: la API no tiene endpoints por lote, así que es UNA petición por elemento, en paralelo.
 * allSettled y no all: un 409 en un elemento no cancela ni oculta el resultado de los demás.
 */
export async function enLote<T, R>(items: T[], operacion: (item: T) => Promise<R>): Promise<ResultadoLote<T, R>> {
  const resultados = await Promise.allSettled(items.map(operacion));
  const lote: ResultadoLote<T, R> = { exitos: [], fallos: [] };
  resultados.forEach((r, i) =>
    r.status === 'fulfilled' ? lote.exitos.push({ item: items[i], valor: r.value }) : lote.fallos.push({ item: items[i], error: r.reason }),
  );
  return lote;
}

/** Un toast por resultado: éxito con la cantidad y, si hubo fallos, cuáles fallaron y el motivo del primero. */
export function avisarLote<T>(
  toast: ToastApi,
  { exitos, fallos }: ResultadoLote<T, unknown>,
  textos: { hecho: (n: number) => string; accion: string },
  etiqueta: (item: T) => string,
) {
  if (exitos.length > 0) toast.success(textos.hecho(exitos.length));
  if (fallos.length === 0) return;
  const motivo = describirError(fallos[0].error, textos.accion);
  toast.error({
    title: `No se pudo ${textos.accion}: ${fallos.length} de ${exitos.length + fallos.length}`,
    description: `${fallos.map((f) => etiqueta(f.item)).join(', ')}. ${motivo.description}`,
  });
}
