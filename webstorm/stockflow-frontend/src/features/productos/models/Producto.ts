/** Coincide con el enum UnidadMedida de Java y con el CHECK ck_producto_unidad_medida de PostgreSQL. */
export const UNIDADES_MEDIDA = ['UNIDAD', 'CAJA', 'PAQUETE', 'KILOGRAMO', 'LITRO', 'METRO'] as const;
export type UnidadMedida = (typeof UNIDADES_MEDIDA)[number];

/** Nombre legible de cada unidad (el valor que viaja a la API sigue siendo el del enum). */
export const UNIDAD_LABEL: Record<UnidadMedida, string> = {
  UNIDAD: 'Unidad',
  CAJA: 'Caja',
  PAQUETE: 'Paquete',
  KILOGRAMO: 'Kilogramo (kg)',
  LITRO: 'Litro (L)',
  METRO: 'Metro (m)',
};

/**
 * Contrato de ProductoResponse del backend.
 * La relación con Categoria (1:N) viaja como categoriaId: el producto NO contiene el objeto categoría.
 */
export interface Producto {
  id: number;
  categoriaId: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  unidadMedida: UnidadMedida;
  stockMinimoDefault: number;
  precioReferencial: number | null;
  activo: boolean;
}
