import { FlaskConical, SearchX, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Alert } from '../../../components/ui/Alert';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { DataTable, type Column } from '../../../components/ui/DataTable';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PageHeader } from '../../../components/ui/PageHeader';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { UnavailableButton } from '../../../components/ui/UnavailableButton';
import { normalizar } from '../../../shared/utils/paginar';
import { iniciales } from '../../auth/models/DemoSession';
import { USUARIOS_DEMO } from '../data/usuarios.demo';
import { ROL_INFO, ROLES, type Usuario } from '../models/Usuario';

const SIN_BACKEND = 'El backend todavía no expone endpoints de usuarios.';

/** Vista DEMOSTRATIVA: datos locales ficticios. Buscar y filtrar funcionan; crear o editar no. */
export default function UsuariosPage() {
  const [search, setSearch] = useState('');
  const [rol, setRol] = useState('all');

  const termino = normalizar(search);
  const visibles = USUARIOS_DEMO.filter(
    (u) =>
      (!termino || [u.nombreCompleto, u.username, u.email].some((c) => normalizar(c).includes(termino))) &&
      (rol === 'all' || u.roles.includes(rol as Usuario['roles'][number])),
  );

  const columns: Column<Usuario>[] = [
    {
      key: 'persona',
      header: 'Persona',
      mobile: 'primary',
      cell: (u) => (
        <span className="user-cell">
          <span className="avatar" aria-hidden="true">
            {iniciales(u.nombreCompleto)}
          </span>
          <span className="cell-stack">
            <span className="cell-title">{u.nombreCompleto}</span>
            <span className="cell-sub">{u.email}</span>
          </span>
        </span>
      ),
    },
    { key: 'username', header: 'Nombre de usuario', cell: (u) => <span className="code-cell">{u.username}</span> },
    {
      key: 'roles',
      header: 'Roles',
      cell: (u) => (
        <span className="badge-row">
          {u.roles.map((r) => (
            <Badge key={r} tone="info">
              {ROL_INFO[r].nombre}
            </Badge>
          ))}
        </span>
      ),
    },
    { key: 'estado', header: 'Estado', cell: (u) => <StatusBadge active={u.activo} /> },
  ];

  return (
    <section className="page-stack">
      <PageHeader
        title="Usuarios"
        description="Personas con acceso a StockFlow y sus roles."
        demo
        reference="Modelo de las tablas usuario, rol y usuario_rol (semilla V2). Sin endpoints REST todavía."
        actions={
          <UnavailableButton variant="primary" icon={UserPlus} reason={SIN_BACKEND}>
            Invitar usuario
          </UnavailableButton>
        }
      />

      <Alert kind="warning" title="Datos de demostración">
        Estas personas son ficticias y no se guardan en ningún sitio. La gestión real de usuarios llegará cuando el backend
        la exponga.
      </Alert>

      <div className="filters">
        <div className="filters__search">
          <SearchInput value={search} onChange={setSearch} label="Buscar usuario" hideLabel placeholder="Buscar por nombre, usuario o correo" />
        </div>
        <div className="filters__select">
          <SelectFilter
            label="Rol"
            hideLabel
            value={rol}
            onChange={setRol}
            options={[{ value: 'all', label: 'Todos los roles' }, ...ROLES.map((r) => ({ value: r, label: ROL_INFO[r].nombre }))]}
          />
        </div>
      </div>

      {visibles.length === 0 ? (
        <EmptyState icon={SearchX} title="Ningún usuario coincide" description="Cambia la búsqueda o el rol." />
      ) : (
        <DataTable rows={visibles} columns={columns} rowKey={(u) => u.id} caption="Usuarios de demostración" />
      )}

      <Card title="Roles del sistema" description="Definidos en la base de datos del backend.">
        <ul className="role-list">
          {ROLES.map((r) => (
            <li key={r} className="role-list__item">
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <strong>{ROL_INFO[r].nombre}</strong>
                {ROL_INFO[r].descripcion}
              </span>
              <span className="role-list__count">
                <FlaskConical size={12} aria-hidden="true" />
                {USUARIOS_DEMO.filter((u) => u.roles.includes(r)).length} en la demo
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
