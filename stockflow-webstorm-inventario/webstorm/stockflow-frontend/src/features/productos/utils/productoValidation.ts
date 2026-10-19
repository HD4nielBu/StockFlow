import type { Categoria } from '../../categorias/models/Categoria';
import type { ProductoFormData } from '../types/ProductoFormData';

export type ProductoFormErrors = Partial<Record<keyof ProductoFormData, string>>;

const CODIGO = /^[A-Za-z0-9-]+$/;
const PRECIO = /^\d{1,10}(\.\d{1,2})?$/; // NUMERIC(12,2): hasta 10 enteros y 2 decimales

/**
 * G04/G07: reglas de CrearProductoRequest más la regla de relación:
 * un producto NUEVO o que CAMBIA de categoría sólo puede ir a una categoría activa
 * (la misma regla que aplica ProductoService en el backend; si no, respondería 422).
 * categoriaActualId es la categoría que el producto ya tenía (sólo al editar).
 */
export function validarProducto(
  data: ProductoFormData,
  categorias: Categoria[],
  categoriaActualId?: number,
): ProductoFormErrors {
  const errors: ProductoFormErrors = {};

  const categoriaId = Number(data.categoriaId);
  const categoria = categorias.find((c) => c.id === categoriaId);
  if (!data.categoriaId) errors.categoriaId = 'Seleccione una categoría';
  else if (!categoria) errors.categoriaId = 'La categoría seleccionada no existe';
  else if (!categoria.activo && categoria.id !== categoriaActualId) {
    errors.categoriaId = 'La categoría está inactiva y no admite productos nuevos';
  }

  const codigo = data.codigo.trim();
  if (!codigo) errors.codigo = 'El código es obligatorio';
  else if (codigo.length > 40) errors.codigo = 'El código admite máximo 40 caracteres';
  else if (!CODIGO.test(codigo)) errors.codigo = 'Sólo letras, números y guiones';

  const nombre = data.nombre.trim();
  if (!nombre) errors.nombre = 'El nombre es obligatorio';
  else if (nombre.length > 140) errors.nombre = 'El nombre admite máximo 140 caracteres';

  if (data.descripcion.length > 1000) errors.descripcion = 'La descripción admite máximo 1000 caracteres';

  const minimo = data.stockMinimoDefault.trim();
  if (minimo === '') errors.stockMinimoDefault = 'El stock mínimo es obligatorio';
  else if (!/^\d+$/.test(minimo)) errors.stockMinimoDefault = 'RN-07: debe ser un entero mayor o igual a 0';

  const precio = data.precioReferencial.trim();
  if (precio !== '' && !PRECIO.test(precio)) {
    errors.precioReferencial = 'Precio no negativo, con hasta 2 decimales';
  }
  return errors;
}
