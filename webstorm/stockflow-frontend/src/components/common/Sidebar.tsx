import { NavLink } from 'react-router';

const menuItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/categorias', label: 'Categorías' },
  { to: '/productos', label: 'Productos' },
];

/**
 * G02: menú lateral. NavLink cambia la URL sin recargar la página (SPA) y entrega isActive
 * para marcar la opción actual. end en "/" evita que Inicio quede activo en todas las rutas.
 */
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">S</span>
        <div>
          <strong>StockFlow</strong>
          <small>Inventario</small>
        </div>
      </div>
      <nav className="sidebar__nav" aria-label="Navegación principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
