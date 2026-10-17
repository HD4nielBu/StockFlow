import { useCategorias } from '../../categorias/hooks/useCategorias';
import { useProductos } from '../../productos/hooks/useProductos';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import { inventarioService } from '../services/inventarioService';

/** Las tres colecciones reales que alimentan Inicio y Dashboard, con un estado de carga común. */
export function useResumenInventario() {
  const categorias = useCategorias();
  const productos = useProductos();
  const existencias = useAsyncList(inventarioService.listarExistencias);
  return {
    categorias: categorias.data,
    productos: productos.data,
    existencias: existencias.data,
    loading: categorias.loading || productos.loading || existencias.loading,
    // || y no ??: un error vacío es '' (no null), así que ?? nunca pasaría al siguiente
    error: categorias.error || productos.error || existencias.error,
    reload: () => {
      categorias.reload();
      productos.reload();
      existencias.reload();
    },
  };
}
