import { useCallback, useState } from 'react';

/** Conjunto de ids seleccionados en una tabla (acciones masivas). */
export function useSeleccion<K>() {
  const [seleccion, setSeleccion] = useState<ReadonlySet<K>>(() => new Set());

  const alternar = useCallback((ids: K[], seleccionar: boolean) => {
    setSeleccion((prev) => {
      const siguiente = new Set(prev);
      ids.forEach((id) => (seleccionar ? siguiente.add(id) : siguiente.delete(id)));
      return siguiente;
    });
  }, []);

  /** Deja seleccionados sólo estos ids (p. ej. los que fallaron en una acción masiva). */
  const reemplazar = useCallback((ids: K[]) => setSeleccion(new Set(ids)), []);

  return { seleccion, alternar, reemplazar };
}
