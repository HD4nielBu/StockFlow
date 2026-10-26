// Un modelo describe la forma de los datos: no guarda registros reales.
// Los campos son los mismos que CategoriaResponse y ProductoResponse del backend.

/** Coincide con el enum UnidadMedida de Java y con el CHECK de PostgreSQL. */
export type UnidadMedida = 'UNIDAD' | 'CAJA' | 'PAQUETE' | 'KILOGRAMO' | 'LITRO' | 'METRO';

export type Categoria = Readonly<{
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}>;

/** La relación 1:N viaja como categoriaId: el producto no contiene el objeto categoría. */
export type Producto = Readonly<{
  id: number;
  categoriaId: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  unidadMedida: UnidadMedida;
  stockMinimoDefault: number;
  precioReferencial: number | null;
  activo: boolean;
}>;

export type Seccion = 'categorias' | 'productos';
