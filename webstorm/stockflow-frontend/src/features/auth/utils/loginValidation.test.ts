import { describe, expect, it } from 'vitest';
import { iniciales, nombreDesdeIdentificador, primerNombre } from '../models/DemoSession';
import { correoMostrado, validarLogin } from './loginValidation';

const base = { identificador: 'maria.lopez@uni.edu', password: 'x', recordar: false };

describe('validarLogin', () => {
  it('acepta un correo o un nombre de usuario con contraseña', () => {
    expect(validarLogin(base)).toEqual({});
    expect(validarLogin({ ...base, identificador: 'mlopez_01' })).toEqual({});
  });

  it('exige ambos campos y valida el formato del correo o del usuario', () => {
    expect(validarLogin({ ...base, identificador: '', password: '' })).toEqual({
      identificador: 'Escribe tu correo o nombre de usuario',
      password: 'Escribe una contraseña',
    });
    expect(validarLogin({ ...base, identificador: 'maria@uni' }).identificador).toBe('El correo no tiene un formato válido');
    expect(validarLogin({ ...base, identificador: 'ma' }).identificador).toMatch(/de 3 a 40/);
  });
});

describe('identidad de la sesión demo', () => {
  it('deriva nombre, iniciales, primer nombre y correo mostrado', () => {
    expect(nombreDesdeIdentificador('maria.lopez@uni.edu')).toBe('Maria Lopez');
    expect(nombreDesdeIdentificador('juan_perez')).toBe('Juan Perez');
    expect(iniciales('Maria Lopez')).toBe('ML');
    expect(iniciales('Admin')).toBe('AD');
    expect(primerNombre('Maria Lopez')).toBe('Maria');
    expect(correoMostrado('JPerez')).toBe('jperez@demo.stockflow');
  });
});
