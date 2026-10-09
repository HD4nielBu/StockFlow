import { KeyRound, LogIn, ShieldOff } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import ThemeSelector from '../../../components/common/ThemeSelector';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Field, Input } from '../../../components/ui/Field';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../components/ui/toast/useToast';
import { useDemoSession } from '../useDemoSession';

/** Perfil de la sesión DEMO: lo editable se guarda sólo en este navegador y así se indica. */
export default function PerfilPage() {
  const { session, identidad } = useDemoSession();

  return (
    <div className="page-stack">
      <PageHeader title="Mi perfil" description="Tus datos de la sesión de demostración y tus preferencias." demo />

      <section className="profile-hero" aria-label="Resumen de la cuenta">
        <span className="avatar avatar--xl" aria-hidden="true">
          {identidad.iniciales}
        </span>
        <div className="profile-hero__text">
          <h2>{identidad.nombre}</h2>
          <p>{identidad.correo}</p>
        </div>
        <Badge tone={session ? 'info' : 'neutral'}>{session ? 'Sesión de demostración' : 'Sin sesión'}</Badge>
      </section>

      <Tabs
        label="Secciones del perfil"
        items={[
          { id: 'datos', label: 'Datos', panel: <DatosPanel /> },
          { id: 'preferencias', label: 'Preferencias', panel: <PreferenciasPanel /> },
          { id: 'seguridad', label: 'Seguridad', panel: <SeguridadPanel /> },
        ]}
      />
    </div>
  );
}

function DatosPanel() {
  const { session, actualizar } = useDemoSession();
  const toast = useToast();
  const [nombre, setNombre] = useState(session?.nombre ?? '');
  const [correo, setCorreo] = useState(session?.correo ?? '');
  const [errors, setErrors] = useState<{ nombre?: string; correo?: string }>({});

  if (!session) {
    return (
      <EmptyState
        icon={LogIn}
        title="No has entrado en modo demostración"
        description="Entra con un nombre para personalizar cómo te muestra StockFlow."
        action={
          <Link to="/login" className="btn btn--primary btn--md">
            <span className="btn__content">Entrar en modo demo</span>
          </Link>
        }
      />
    );
  }

  const cambios = nombre.trim() !== session.nombre || correo.trim() !== session.correo;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nuevos: typeof errors = {};
    if (!nombre.trim()) nuevos.nombre = 'Escribe tu nombre';
    else if (nombre.trim().length > 80) nuevos.nombre = 'Máximo 80 caracteres';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) nuevos.correo = 'El correo no tiene un formato válido';
    setErrors(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    actualizar({ nombre: nombre.trim(), correo: correo.trim().toLowerCase() });
    toast.success({ title: 'Perfil actualizado', description: 'Los cambios se guardaron en este navegador.' });
  };

  return (
    <Card title="Datos personales" description="Se guardan sólo en este navegador: no hay una cuenta en el servidor.">
      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field label="Nombre para mostrar" required error={errors.nombre}>
            {(control) => <Input {...control} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={80} />}
          </Field>
          <Field label="Correo" required error={errors.correo}>
            {(control) => <Input {...control} type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} maxLength={120} />}
          </Field>
        </div>
        <div className="profile-form__actions">
          <Button
            variant="secondary"
            disabled={!cambios}
            onClick={() => {
              setNombre(session.nombre);
              setCorreo(session.correo);
              setErrors({});
            }}
          >
            Descartar
          </Button>
          <Button type="submit" disabled={!cambios}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  );
}

function PreferenciasPanel() {
  return (
    <Card title="Apariencia" description="Se aplica al instante y se recuerda en este navegador.">
      <ThemeSelector />
    </Card>
  );
}

function SeguridadPanel() {
  return (
    <Card title="Seguridad" description="Disponible cuando el backend incorpore autenticación.">
      <ul className="settings-list">
        <li className="settings-list__item">
          <span className="settings-list__icon" aria-hidden="true">
            <KeyRound size={18} />
          </span>
          <span className="settings-list__text">
            <span className="settings-list__title">Contraseña</span>
            <span className="settings-list__desc">En modo demostración no existe una contraseña que cambiar.</span>
          </span>
          <Button variant="secondary" size="sm" disabled>
            No disponible
          </Button>
        </li>
        <li className="settings-list__item">
          <span className="settings-list__icon" aria-hidden="true">
            <ShieldOff size={18} />
          </span>
          <span className="settings-list__text">
            <span className="settings-list__title">Sesiones y dispositivos</span>
            <span className="settings-list__desc">No hay sesiones en el servidor: tu nombre sólo vive en este navegador.</span>
          </span>
          <Button variant="secondary" size="sm" disabled>
            No disponible
          </Button>
        </li>
      </ul>
    </Card>
  );
}
