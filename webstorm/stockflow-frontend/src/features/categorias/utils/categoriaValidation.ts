import type { CategoriaFormData } from '../types/CategoriaFormData';

export type CategoriaFormErrors = Partial<Record<keyof CategoriaFormData, string>>;

const CODIGO = /^[A-Za-z0-9-]+$/;

/**
 * G04: mismas reglas que CrearCategoriaRequest del backend (@NotBlank, @Size, @Pattern).
 * Mejoran la experiencia (error inmediato junto al campo), pero NO reemplazan la validación
 * de Spring Boot ni las constraints de PostgreSQL.
 */
export function validarCategoria(data: CategoriaFormData): CategoriaFormErrors {
  const errors: CategoriaFormErrors = {};
  const codigo = data.codigo.trim();
  if (!codigo) errors.codigo = 'El código es obligatorio';
  else if (codigo.length > 30) errors.codigo = 'El código admite máximo 30 caracteres';
  else if (!CODIGO.test(codigo)) errors.codigo = 'Sólo letras, números y guiones';

  const nombre = data.nombre.trim();
  if (!nombre) errors.nombre = 'El nombre es obligatorio';
  else if (nombre.length > 100) errors.nombre = 'El nombre admite máximo 100 caracteres';

  if (data.descripcion.length > 1000) errors.descripcion = 'La descripción admite máximo 1000 caracteres';
  return errors;
}
