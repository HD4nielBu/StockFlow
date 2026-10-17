/**
 * Mismo modelo que las tablas usuario / rol / usuario_rol del backend (semilla V2). No hay endpoints
 * todavía: cuando existan, sólo cambia la fuente de datos, no la interfaz.
 */
export const ROLES = ['ADMINISTRADOR', 'ENCARGADO_ALMACEN', 'SOLICITANTE', 'SUPERVISOR'] as const;
export type RolCodigo = (typeof ROLES)[number];

/** Nombres y descripciones copiados de la semilla del backend (tabla rol). */
export const ROL_INFO: Record<RolCodigo, { nombre: string; descripcion: string }> = {
  ADMINISTRADOR: { nombre: 'Administrador', descripcion: 'Configura catálogos, usuarios y parámetros' },
  ENCARGADO_ALMACEN: { nombre: 'Encargado de almacén', descripcion: 'Registra movimientos y atiende solicitudes' },
  SOLICITANTE: { nombre: 'Solicitante interno', descripcion: 'Crea y consulta solicitudes internas' },
  SUPERVISOR: { nombre: 'Supervisor', descripcion: 'Aprueba o rechaza solicitudes' },
};

export interface Usuario {
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  roles: RolCodigo[];
  activo: boolean;
}
