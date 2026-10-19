import type { Categoria } from '../models/Categoria';

/** G03: datos simulados con la misma forma que la semilla V2. Hoy los usan las pruebas automáticas. */
export const categoriasMock: Categoria[] = [
  { id: 1, codigo: 'CAT-OFI', nombre: 'Material de oficina', descripcion: 'Papelería y útiles', activo: true },
  { id: 2, codigo: 'CAT-LIM', nombre: 'Limpieza', descripcion: 'Insumos de limpieza e higiene', activo: true },
  { id: 3, codigo: 'CAT-EPP', nombre: 'Seguridad industrial', descripcion: 'Equipos de protección personal', activo: true },
  { id: 4, codigo: 'CAT-OLD', nombre: 'Categoría retirada', descripcion: null, activo: false },
];
