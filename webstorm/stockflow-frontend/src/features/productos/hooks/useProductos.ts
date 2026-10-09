import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import type { Producto } from '../models/Producto';
import { productoService } from '../services/productoService';

export function useProductos() {
  return useAsyncList<Producto>(productoService.listar);
}
