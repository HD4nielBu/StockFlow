import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router';
import { findPage } from '../../app/navigation';

/** Dónde estoy: sección del menú › página. Las secciones son agrupaciones, no páginas: van como texto. */
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { section, page } = findPage(pathname);
  const current = page?.label ?? 'Página no encontrada';

  return (
    <nav aria-label="Ruta de navegación" className="breadcrumbs">
      <ol>
        {section && (
          <li className="breadcrumbs__section">
            <span>{section}</span>
            <ChevronRight size={14} aria-hidden="true" />
          </li>
        )}
        <li>
          <span aria-current="page" className="breadcrumbs__current">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  );
}
