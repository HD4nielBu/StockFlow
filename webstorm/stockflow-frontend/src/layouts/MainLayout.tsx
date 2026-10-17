import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { PageSkeleton } from '../components/ui/LoadingSkeleton';
import { guardarPreferencia, leerPreferencia } from '../shared/utils/storage';

const COLLAPSED_KEY = 'stockflow.sidebar';
const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * G02: estructura permanente. Outlet es el hueco donde React Router pinta la página de la URL actual.
 * Escritorio: sidebar fija (expandida o contraída, se recuerda). Por debajo de 1024 px: cajón modal.
 */
export default function MainLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => leerPreferencia(COLLAPSED_KEY) === 'collapsed');
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  // Al cerrar el cajón con Escape o el fondo, el foco vuelve al botón ☰. Se hace DESPUÉS del render:
  // mientras el cajón está abierto el contenido es inert y el botón no puede recibir el foco.
  const returnFocus = useRef(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    guardarPreferencia(COLLAPSED_KEY, collapsed ? 'expanded' : 'collapsed');
  };

  const closeMobile = (refocus = false) => {
    returnFocus.current = refocus;
    setMobileOpen(false);
  };

  // Cajón abierto: Escape lo cierra; si la ventana crece a escritorio, deja de ser cajón
  useEffect(() => {
    if (!mobileOpen) {
      if (returnFocus.current) document.querySelector<HTMLButtonElement>('.topbar__menu')?.focus();
      returnFocus.current = false;
      return;
    }
    document.querySelector<HTMLElement>('#app-sidebar .sidebar__close')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile(true);
    };
    const media = window.matchMedia(DESKTOP_QUERY);
    const onResize = () => media.matches && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    media.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      media.removeEventListener('change', onResize);
    };
  }, [mobileOpen]);

  // Al cambiar de página, el foco va al contenido (lectores de pantalla anuncian la nueva vista)
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    contentRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="app-shell" data-sidebar-collapsed={collapsed || undefined}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => closeMobile()}
      />
      {mobileOpen && <div className="sidebar-backdrop" aria-hidden="true" onClick={() => closeMobile(true)} />}
      <div className="app-shell__main" inert={mobileOpen}>
        <Header mobileMenuOpen={mobileOpen} onOpenMobileMenu={() => setMobileOpen(true)} />
        <main id="contenido" ref={contentRef} tabIndex={-1} className="app-content">
          <div key={pathname} className="page-transition">
            {/* Las páginas se cargan bajo demanda (lazy): sidebar y header no parpadean mientras llega su código */}
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
