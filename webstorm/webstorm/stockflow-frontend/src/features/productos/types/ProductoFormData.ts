import type { UnidadMedida } from '../models/Producto';

/**
 * G04/G07: estado del formulario. categoriaId, stockMinimoDefault y precioReferencial son string
 * porque los <input>/<select> entregan texto; se validan y recién después se convierten a number.
 */
export interface ProductoFormData {
  categoriaId: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  unidadMedida: UnidadMedida;
  stockMinimoDefault: string;
  precioReferencial: string;
  activo: boolean;
}
