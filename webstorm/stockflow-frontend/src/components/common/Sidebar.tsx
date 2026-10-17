import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { NAV_SECTIONS } from '../../app/navigation';
import { Tooltip } from '../ui/Tooltip';
import { LogoMark } from './Logo';
import UserMenu from './UserMenu';

type SidebarProps = {
  /** Escritorio: sólo iconos. */
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Móvil/tablet: cajón abierto. */
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

/**
 * G02: menú lateral. NavLink cambia la URL sin recargar la página (SPA) y entrega isActive
 * para marcar la opción actual. end en "/" evita que Inicio quede activo en todas las rutas.
 * En escritorio puede contraerse a iconos; por debajo de 1024 px es un cajón (drawer).
 */
export default function Sidebar({ collapsed, onToggleCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <aside
      id="app-sidebar"
      className="sidebar"
      data-collapsed={collapsed || undefined}
      data-mobile-open={mobileOpen || undefined}
      aria-label="Menú lateral"
    >
      <div className="sidebar__brand">
        <Link to="/" className="sidebar__brand-link" onClick={onCloseMobile} aria-label="StockFlow, ir a Inicio">
          <LogoMark size={32} />
          <span className="sidebar__brand-text">
            <strong>StockFlow</strong>
            <small>Gestión de inventario</small>
          </span>
        </Link>
        <button type="button" className="icon-button sidebar__close" aria-label="Cerrar menú" onClick={onCloseMobile}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Navegación principal">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="sidebar__section">
            <p className="sidebar__section-title">{section.title}</p>
            <ul className="sidebar__list">
              {section.items.map((item) => (
                <li key={item.to}>
                  <Tooltip content={item.label} placement="right" enabled={collapsed} describe={false}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) => `sidebar__link${isActive ? ' sidebar__link--active' : ''}`}
                      onClick={onCloseMobile}
                    >
                      <item.icon size={18} aria-hidden="true" className="sidebar__icon" />
                      <span className="sidebar__label">{item.label}</span>
                      {item.data === 'demo' && (
                        <span className="sidebar__demo">
                          Demo<span className="sr-only">: datos de demostración</span>
                        </span>
                      )}
                    </NavLink>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <UserMenu variant="sidebar" compact={collapsed} />
        <Tooltip content={collapsed ? 'Expandir menú' : 'Contraer menú'} placement="right" describe={false}>
          <button
            type="button"
            className="icon-button sidebar__collapse"
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            onClick={onToggleCollapsed}
          >
            {collapsed ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
