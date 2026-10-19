import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import type { Categoria } from '../models/Categoria';
import { categoriaService } from '../services/categoriaService';

/** G08: hook de dominio. useAsyncList conoce el patrón; categoriaService conoce la ruta HTTP. */
export function useCategorias() {
  return useAsyncList<Categoria>(categoriaService.listar);
}
