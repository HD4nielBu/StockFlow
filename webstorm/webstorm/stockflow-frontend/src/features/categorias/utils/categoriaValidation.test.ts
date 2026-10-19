import { describe, expect, it } from 'vitest';
import { validarCategoria } from './categoriaValidation';

const valida = { codigo: 'CAT-NEW', nombre: 'Nueva', descripcion: '', activo: true };

describe('validarCategoria', () => {
  it('no devuelve errores con datos válidos', () => {
    expect(validarCategoria(valida)).toEqual({});
  });

  it('exige código y nombre', () => {
    const errors = validarCategoria({ ...valida, codigo: '  ', nombre: '' });
    expect(errors.codigo).toBe('El código es obligatorio');
    expect(errors.nombre).toBe('El nombre es obligatorio');
  });

  it('rechaza caracteres fuera del patrón del backend', () => {
    expect(validarCategoria({ ...valida, codigo: 'CAT OFI' }).codigo).toBe('Sólo letras, números y guiones');
  });

  it('respeta el máximo de 30 caracteres del código', () => {
    expect(validarCategoria({ ...valida, codigo: 'C'.repeat(31) }).codigo).toMatch(/máximo 30/);
  });
});
