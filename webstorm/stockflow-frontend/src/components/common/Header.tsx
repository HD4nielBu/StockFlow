import { Menu } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import HeaderSearch from './HeaderSearch';
import NotificationsMenu from './NotificationsMenu';
import ThemeMenu from './ThemeMenu';
import UserMenu from './UserMenu';

type HeaderProps = {
  mobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
};

/** Barra superior: ubicación (breadcrumbs), búsqueda de secciones y accesos globales. */
export default function Header({ mobileMenuOpen, onOpenMobileMenu }: HeaderProps) {
  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button topbar__menu"
        aria-label="Abrir menú"
        aria-controls="app-sidebar"
        aria-expanded={mobileMenuOpen}
        onClick={onOpenMobileMenu}
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      <Breadcrumbs />
      <div className="topbar__actions">
        <HeaderSearch />
        <ThemeMenu />
        <NotificationsMenu />
        <UserMenu variant="header" />
      </div>
    </header>
  );
}
