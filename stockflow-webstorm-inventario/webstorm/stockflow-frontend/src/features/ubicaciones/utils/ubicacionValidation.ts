import type { UbicacionFormData } from '../types/UbicacionFormData';

export type UbicacionFormErrors = Partial<Record<keyof UbicacionFormData, string>>;

const CODIGO = /^[A-Za-z0-9-]+$/;

/** Mismas reglas que CrearUbicacionRequest (@NotBlank, @Size, @Pattern). El backend sigue siendo la autoridad. */
export function validarUbicacion(data: UbicacionFormData): UbicacionFormErrors {
  const errors: UbicacionFormErrors = {};
  const codigo = data.codigo.trim();
  if (!codigo) errors.codigo = 'El código es obligatorio';
  else if (codigo.length > 30) errors.codigo = 'El código admite máximo 30 caracteres';
  else if (!CODIGO.test(codigo)) errors.codigo = 'El código sólo admite letras, números y guiones';

  const nombre = data.nombre.trim();
  if (!nombre) errors.nombre = 'El nombre es obligatorio';
  else if (nombre.length > 120) errors.nombre = 'El nombre admite máximo 120 caracteres';

  if (data.direccion.trim().length > 220) errors.direccion = 'La dirección admite máximo 220 caracteres';
  return errors;
}
