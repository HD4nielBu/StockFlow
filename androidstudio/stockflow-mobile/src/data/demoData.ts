import type { Categoria, Producto } from '../models/inventario';

// Datos de ejemplo basados en la semilla V2 del backend, pero NO vienen de PostgreSQL.
// Se agregaron dos casos que la semilla no tiene: una categoría inactiva (Tecnología)
// y una categoría sin productos (Mobiliario).
export const CATEGORIAS: readonly Categoria[] = [
  { id: 1, codigo: 'CAT-OFI', nombre: 'Material de oficina', descripcion: 'Papelería y útiles', activo: true },
  { id: 2, codigo: 'CAT-LIM', nombre: 'Limpieza', descripcion: 'Insumos de limpieza e higiene', activo: true },
  { id: 3, codigo: 'CAT-EPP', nombre: 'Seguridad industrial', descripcion: 'Equipos de protección personal', activo: true },
  { id: 4, codigo: 'CAT-TEC', nombre: 'Tecnología', descripcion: 'Consumibles y accesorios informáticos', activo: false },
  { id: 5, codigo: 'CAT-MUE', nombre: 'Mobiliario', descripcion: 'Escritorios, sillas y estanterías', activo: true },
];

export const PRODUCTOS: readonly Producto[] = [
  { id: 1, categoriaId: 1, codigo: 'PRD-OFI-001', nombre: 'Resma papel bond A4 75g', descripcion: null,
    unidadMedida: 'PAQUETE', stockMinimoDefault: 20, precioReferencial: 38.5, activo: true },
  { id: 2, categoriaId: 1, codigo: 'PRD-OFI-002', nombre: 'Bolígrafo azul', descripcion: null,
    unidadMedida: 'UNIDAD', stockMinimoDefault: 100, precioReferencial: 2.5, activo: true },
  { id: 3, categoriaId: 2, codigo: 'PRD-LIM-001', nombre: 'Detergente líquido 5L', descripcion: null,
    unidadMedida: 'LITRO', stockMinimoDefault: 10, precioReferencial: 75, activo: true },
  { id: 4, categoriaId: 3, codigo: 'PRD-EPP-001', nombre: 'Guantes de nitrilo', descripcion: null,
    unidadMedida: 'CAJA', stockMinimoDefault: 15, precioReferencial: 95, activo: true },
  { id: 5, categoriaId: 4, codigo: 'PRD-TEC-001', nombre: 'Tóner negro HP 85A', descripcion: null,
    unidadMedida: 'UNIDAD', stockMinimoDefault: 5, precioReferencial: 420, activo: true },
];
