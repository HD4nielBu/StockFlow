import { describe, expect, it } from 'vitest';
import { validarUbicacion } from './ubicacionValidation';

const valida = { codigo: 'UB-DEP-ESTE', nombre: 'Depósito Este', tipo: 'DEPOSITO' as const, direccion: '' };

describe('validarUbicacion', () => {
  it('acepta una ubicación válida', () => {
    expect(validarUbicacion(valida)).toEqual({});
  });

  it('exige código y nombre', () => {
    expect(validarUbicacion({ ...valida, codigo: ' ', nombre: '' })).toEqual({
      codigo: 'El código es obligatorio',
      nombre: 'El nombre es obligatorio',
    });
  });

  it('rechaza códigos con espacios o símbolos', () => {
    expect(validarUbicacion({ ...valida, codigo: 'UB DEP' }).codigo).toBe('El código sólo admite letras, números y guiones');
  });

  it('limita la dirección a 220 caracteres', () => {
    expect(validarUbicacion({ ...valida, direccion: 'x'.repeat(221) }).direccion).toBeDefined();
  });
});
