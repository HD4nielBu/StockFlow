import { ArrowRight, Boxes, FlaskConical, PackageSearch, ScrollText, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { healthService } from '../../../api/healthService';
import { mensajeDeError } from '../../../api/apiClient';
import { LogoMark } from '../../../components/common/Logo';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Field, Input } from '../../../components/ui/Field';
import { PasswordInput } from '../../../components/ui/PasswordInput';
import { nombreDesdeIdentificador } from '../models/DemoSession';
import { useDemoSession } from '../useDemoSession';
import { correoMostrado, validarLogin, type LoginFormData, type LoginFormErrors } from '../utils/loginValidation';

const vacio: LoginFormData = { identificador: '', password: '', recordar: false };

/**
 * Acceso en MODO DEMOSTRACIÓN. No hay endpoint de autenticación en el backend, así que:
 * - no se comprueban credenciales (cualquier correo/usuario con formato válido entra),
 * - la contraseña sólo se valida como "no vacía", nunca se envía ni se guarda,
 * - lo único persistido es el nombre y el correo a mostrar.
 * La espera de "Entrar" es REAL: comprueba si el backend responde (GET /api/health).
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, iniciar } = useDemoSession();
  const [form, setForm] = useState<LoginFormData>(vacio);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [checking, setChecking] = useState(false);
  const [backendCaido, setBackendCaido] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const salio = (location.state as { salio?: boolean } | null)?.salio === true;

  useEffect(() => {
    document.title = 'Acceso · StockFlow';
    return () => {
      document.title = 'StockFlow · Inventario';
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const entrar = () => {
    const id = form.identificador.trim();
    iniciar({ nombre: nombreDesdeIdentificador(id), correo: correoMostrado(id), recordar: form.recordar });
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validarLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    // La contraseña ya cumplió su único papel (no estar vacía): se descarta de inmediato
    setForm((prev) => ({ ...prev, password: '' }));
    try {
      setChecking(true);
      setBackendCaido('');
      await healthService.comprobar();
      entrar();
    } catch (err) {
      // Sin backend la interfaz abre igual, pero se avisa: las páginas no tendrán datos
      setBackendCaido(mensajeDeError(err));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="auth">
      <main className="auth__main">
        <div className="auth__panel">
          <div className="auth__brand">
            <LogoMark size={36} />
            <span>StockFlow</span>
          </div>

          <header className="auth__header">
            <h1>Entrar a StockFlow</h1>
            <p>Gestiona categorías, productos y existencias de tus almacenes.</p>
          </header>

          <div className="auth__demo" role="note">
            <FlaskConical size={18} aria-hidden="true" />
            <p>
              <strong>Modo demostración.</strong> StockFlow aún no tiene inicio de sesión real: puedes entrar con cualquier correo
              o usuario. La contraseña no se envía ni se guarda.
            </p>
          </div>

          {salio && !session && (
            <Alert kind="info">Saliste del modo demostración. Este navegador ya no guarda tu nombre.</Alert>
          )}
          {session && (
            <Alert
              kind="info"
              action={
                <Link to="/" className="link-button">
                  Continuar
                </Link>
              }
            >
              Ya estás dentro como {session.nombre}.
            </Alert>
          )}

          <form ref={formRef} className="auth__form" onSubmit={handleSubmit} noValidate aria-label="Acceso en modo demostración">
            <Field label="Correo o usuario" required error={errors.identificador}>
              {(control) => (
                <Input
                  {...control}
                  name="identificador"
                  value={form.identificador}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="nombre@universidad.edu"
                  autoFocus
                />
              )}
            </Field>
            <Field label="Contraseña" required error={errors.password} hint="No se verifica en modo demostración.">
              {(control) => (
                // autoComplete="off": evita que el navegador ofrezca guardar una contraseña que no protege nada
                <PasswordInput {...control} name="password" value={form.password} onChange={handleChange} autoComplete="off" />
              )}
            </Field>
            <Checkbox
              name="recordar"
              checked={form.recordar}
              onChange={handleChange}
              label="Recordarme en este navegador"
            />

            {backendCaido ? (
              <div className="auth__offline">
                <Alert kind="warning" title="El servidor no responde">
                  {backendCaido} Puedes entrar igualmente, pero las páginas no mostrarán datos hasta que el backend esté disponible.
                </Alert>
                <Button variant="secondary" onClick={entrar} icon={ArrowRight}>
                  Entrar sin conexión
                </Button>
              </div>
            ) : (
              <Button type="submit" loading={checking} loadingText="Comprobando el servidor..." className="auth__submit">
                Entrar en modo demo
              </Button>
            )}
          </form>

          <p className="auth__footnote">
            <TriangleAlert size={14} aria-hidden="true" />
            Cuando el backend incorpore autenticación, esta pantalla se conectará a ella y dejará de ser demostrativa.
          </p>
        </div>
      </main>

      <aside className="auth__aside" aria-label="Qué puedes hacer con StockFlow">
        <div className="auth__aside-inner">
          <div className="auth__levels" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h2>Tu inventario, siempre a la vista.</h2>
          <ul className="auth__features">
            <li>
              <PackageSearch size={18} aria-hidden="true" />
              <span>
                <strong>Catálogo ordenado</strong>
                Productos agrupados por categoría, con unidad, precio y stock mínimo.
              </span>
            </li>
            <li>
              <Boxes size={18} aria-hidden="true" />
              <span>
                <strong>Stock por almacén</strong>
                Existencias en cada ubicación y alertas cuando bajan del mínimo.
              </span>
            </li>
            <li>
              <ScrollText size={18} aria-hidden="true" />
              <span>
                <strong>Kardex de movimientos</strong>
                Entradas y salidas de cada producto con su saldo.
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
