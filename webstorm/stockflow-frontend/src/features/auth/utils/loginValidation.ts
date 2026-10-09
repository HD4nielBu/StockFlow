export interface LoginFormData {
  identificador: string;
  password: string;
  recordar: boolean;
}

export type LoginFormErrors = Partial<Record<'identificador' | 'password', string>>;

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USUARIO = /^[A-Za-z0-9._-]{3,40}$/;

/**
 * Valida el FORMATO de lo escrito (feedback inmediato). No comprueba credenciales: en modo
 * demostración no hay contra qué comprobarlas.
 */
export function validarLogin(data: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const id = data.identificador.trim();
  if (!id) errors.identificador = 'Escribe tu correo o nombre de usuario';
  else if (id.includes('@') ? !CORREO.test(id) : !USUARIO.test(id)) {
    errors.identificador = id.includes('@')
      ? 'El correo no tiene un formato válido'
      : 'El usuario admite de 3 a 40 letras, números, puntos, guiones o guiones bajos';
  }
  if (!data.password) errors.password = 'Escribe una contraseña';
  return errors;
}

/** El correo que se muestra en el perfil: el escrito, o uno ficticio si se usó un nombre de usuario. */
export function correoMostrado(identificador: string): string {
  const id = identificador.trim();
  return id.includes('@') ? id.toLowerCase() : `${id.toLowerCase()}@demo.stockflow`;
}
