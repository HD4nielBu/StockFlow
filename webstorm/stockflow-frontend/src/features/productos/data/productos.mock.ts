import type { Producto } from '../models/Producto';

export const productosMock: Producto[] = [
  { id: 1, categoriaId: 1, codigo: 'PRD-OFI-001', nombre: 'Resma papel bond A4 75g', descripcion: null, unidadMedida: 'PAQUETE', stockMinimoDefault: 20, precioReferencial: 38.5, activo: true },
  { id: 2, categoriaId: 1, codigo: 'PRD-OFI-002', nombre: 'Bolígrafo azul', descripcion: null, unidadMedida: 'UNIDAD', stockMinimoDefault: 100, precioReferencial: 2.5, activo: true },
  { id: 3, categoriaId: 2, codigo: 'PRD-LIM-001', nombre: 'Detergente líquido 5L', descripcion: null, unidadMedida: 'LITRO', stockMinimoDefault: 10, precioReferencial: 75, activo: true },
];
