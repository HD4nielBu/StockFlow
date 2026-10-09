import {
  ArrowLeftRight,
  Boxes,
  ChartColumn,
  House,
  LayoutDashboard,
  Package,
  Settings,
  Tags,
  UserRound,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

/**
 * Fuente única de la navegación: la usan Sidebar, Breadcrumbs y la búsqueda del Header.
 * data indica de dónde salen los datos de la sección:
 * - 'api'  → endpoints reales del backend.
 * - 'demo' → datos locales de demostración (no hay endpoints todavía); la UI lo rotula como DEMO.
 */
export type DataSource = 'api' | 'demo';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  data: DataSource;
  /** Palabras extra para la búsqueda del Header. */
  keywords?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { to: '/', label: 'Inicio', icon: House, data: 'api', keywords: 'resumen bienvenida' },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, data: 'api', keywords: 'estadísticas gráficos indicadores' },
    ],
  },
  {
    title: 'Inventario',
    items: [
      { to: '/categorias', label: 'Categorías', icon: Tags, data: 'api', keywords: 'catálogo familias' },
      { to: '/productos', label: 'Productos', icon: Package, data: 'api', keywords: 'artículos catálogo sku' },
      { to: '/existencias', label: 'Existencias', icon: Boxes, data: 'api', keywords: 'stock cantidades mínimo' },
      { to: '/movimientos', label: 'Movimientos', icon: ArrowLeftRight, data: 'api', keywords: 'kardex entradas salidas' },
      { to: '/almacenes', label: 'Almacenes', icon: Warehouse, data: 'api', keywords: 'ubicaciones depósitos' },
    ],
  },
  {
    title: 'Administración',
    items: [
      { to: '/reportes', label: 'Reportes', icon: ChartColumn, data: 'api', keywords: 'informes exportar csv excel' },
      { to: '/usuarios', label: 'Usuarios', icon: Users, data: 'demo', keywords: 'roles permisos' },
      { to: '/configuracion', label: 'Configuración', icon: Settings, data: 'demo', keywords: 'ajustes preferencias tema' },
    ],
  },
];

/** Páginas que no están en el menú lateral pero sí en breadcrumbs y búsqueda. */
export const EXTRA_PAGES: NavItem[] = [
  { to: '/perfil', label: 'Mi perfil', icon: UserRound, data: 'demo', keywords: 'cuenta usuario' },
];

export const ALL_PAGES: NavItem[] = [...NAV_SECTIONS.flatMap((s) => s.items), ...EXTRA_PAGES];

/** Sección y página de una ruta, para los breadcrumbs. */
export function findPage(pathname: string): { section?: string; page?: NavItem } {
  for (const section of NAV_SECTIONS) {
    const page = section.items.find((item) => item.to === pathname);
    if (page) return { section: section.title, page };
  }
  return { page: EXTRA_PAGES.find((item) => item.to === pathname) };
}
