import type { Usuario } from '../models/Usuario';

/**
 * DATOS DE DEMOSTRACIÓN. Personas ficticias para mostrar cómo se verá la gestión de usuarios.
 * No vienen del backend (no hay endpoint) y la interfaz los rotula como DEMO en todo momento.
 */
export const USUARIOS_DEMO: Usuario[] = [
  { id: 1, username: 'lucia.admin', nombreCompleto: 'Lucía Fernández', email: 'lucia.fernandez@demo.stockflow', roles: ['ADMINISTRADOR'], activo: true },
  { id: 2, username: 'pablo.almacen', nombreCompleto: 'Pablo Rojas', email: 'pablo.rojas@demo.stockflow', roles: ['ENCARGADO_ALMACEN'], activo: true },
  { id: 3, username: 'sofia.almacen', nombreCompleto: 'Sofía Méndez', email: 'sofia.mendez@demo.stockflow', roles: ['ENCARGADO_ALMACEN'], activo: true },
  { id: 4, username: 'diego.compras', nombreCompleto: 'Diego Vargas', email: 'diego.vargas@demo.stockflow', roles: ['SOLICITANTE'], activo: true },
  { id: 5, username: 'ana.super', nombreCompleto: 'Ana Gutiérrez', email: 'ana.gutierrez@demo.stockflow', roles: ['SUPERVISOR', 'SOLICITANTE'], activo: true },
  { id: 6, username: 'jorge.ex', nombreCompleto: 'Jorge Salinas', email: 'jorge.salinas@demo.stockflow', roles: ['SOLICITANTE'], activo: false },
];
