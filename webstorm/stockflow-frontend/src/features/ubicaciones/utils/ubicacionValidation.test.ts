import { describe, expect, it } from 'vitest';
import { validarUbicacion } from './ubicacionValidation';

const valido = { codigo: 'UB-DEP-ESTE', nombre: 'Depósito Este', tipo: 'DEPOSITO' as const, direccion: '' };

describe('validarUbicacion', () => {
  it('acepta datos válidos con dirección vacía', () => {
    expect(validarUbicacion(valido)).toEqual({});
  });

  it('aplica las reglas del backend a código, nombre y dirección', () => {
    expect(validarUbicacion({ ...valido, codigo: 'UB ESTE' }).codigo).toBe('Sólo letras, números y guiones');
    expect(validarUbicacion({ ...valido, codigo: 'X'.repeat(31) }).codigo).toMatch(/30/);
    expect(validarUbicacion({ ...valido, nombre: '  ' }).nombre).toBe('El nombre es obligatorio');
    expect(validarUbicacion({ ...valido, direccion: 'x'.repeat(221) }).direccion).toMatch(/220/);
  });
});
