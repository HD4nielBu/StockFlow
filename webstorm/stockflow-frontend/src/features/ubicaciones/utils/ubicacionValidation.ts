import type { TipoUbicacion } from '../models/Ubicacion';

export interface UbicacionFormData {
  codigo: string;
  nombre: string;
  tipo: TipoUbicacion;
  direccion: string;
}

export type UbicacionFormErrors = Partial<Record<keyof UbicacionFormData, string>>;

const CODIGO = /^[A-Za-z0-9-]+$/;

/** Mismas reglas que CrearUbicacionRequest (@NotBlank, @Size, @Pattern). No reemplazan las del backend. */
export function validarUbicacion(data: UbicacionFormData): UbicacionFormErrors {
  const errors: UbicacionFormErrors = {};
  const codigo = data.codigo.trim();
  if (!codigo) errors.codigo = 'El código es obligatorio';
  else if (codigo.length > 30) errors.codigo = 'El código admite máximo 30 caracteres';
  else if (!CODIGO.test(codigo)) errors.codigo = 'Sólo letras, números y guiones';

  const nombre = data.nombre.trim();
  if (!nombre) errors.nombre = 'El nombre es obligatorio';
  else if (nombre.length > 120) errors.nombre = 'El nombre admite máximo 120 caracteres';

  if (data.direccion.length > 220) errors.direccion = 'La dirección admite máximo 220 caracteres';
  return errors;
}
