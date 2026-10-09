import { ChevronsUpDown, LogIn, LogOut, Settings, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDemoSession } from '../../features/auth/useDemoSession';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '../ui/Dropdown';

type UserMenuProps = {
  /** sidebar = tarjeta con nombre; header = sólo avatar. */
  variant: 'sidebar' | 'header';
  /** En la sidebar contraída sólo cabe el avatar. */
  compact?: boolean;
};

/** Acceso a perfil, configuración y salida del modo demostración. */
export default function UserMenu({ variant, compact = false }: UserMenuProps) {
  const navigate = useNavigate();
  const { session, identidad, cerrar } = useDemoSession();
  const rol = session ? 'Modo demo' : 'Sin sesión';
  const avatar = (
    <span className="avatar" aria-hidden="true">
      {identidad.iniciales}
    </span>
  );

  return (
    <Dropdown
      label="Menú de usuario"
      placement={variant === 'sidebar' ? 'top' : 'bottom-end'}
      className="user-menu"
      trigger={(props) =>
        variant === 'header' || compact ? (
          <button {...props} type="button" className={`user-trigger user-trigger--avatar user-trigger--${variant}`} aria-label={`Cuenta: ${identidad.nombre}`}>
            {avatar}
          </button>
        ) : (
          <button {...props} type="button" className="user-trigger user-trigger--card" aria-label={`Cuenta: ${identidad.nombre}`}>
            {avatar}
            <span className="user-trigger__text">
              <span className="user-trigger__name">{identidad.nombre}</span>
              <span className="user-trigger__role">{rol}</span>
            </span>
            <ChevronsUpDown size={16} aria-hidden="true" className="user-trigger__chevron" />
          </button>
        )
      }
    >
      <DropdownLabel>
        <span className="user-menu__name">{identidad.nombre}</span>
        <span className="user-menu__email">{identidad.correo}</span>
      </DropdownLabel>
      <DropdownSeparator />
      <DropdownItem icon={UserRound} onSelect={() => navigate('/perfil')}>
        Mi perfil
      </DropdownItem>
      <DropdownItem icon={Settings} onSelect={() => navigate('/configuracion')}>
        Configuración
      </DropdownItem>
      <DropdownSeparator />
      {session ? (
        <DropdownItem
          icon={LogOut}
          tone="danger"
          onSelect={() => {
            cerrar();
            navigate('/login', { state: { salio: true } });
          }}
        >
          Salir del modo demo
        </DropdownItem>
      ) : (
        <DropdownItem icon={LogIn} onSelect={() => navigate('/login')}>
          Entrar en modo demo
        </DropdownItem>
      )}
    </Dropdown>
  );
}
