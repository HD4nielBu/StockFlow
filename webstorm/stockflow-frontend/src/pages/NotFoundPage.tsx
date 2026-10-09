import { House, MapPinOff } from 'lucide-react';
import { Link } from 'react-router';
import { EmptyState } from '../components/ui/EmptyState';

/** G02: ruta comodín (*). Es un 404 de la SPA, no un 404 de la API. */
export default function NotFoundPage() {
  return (
    <div className="page-stack">
      <h1 className="sr-only">Página no encontrada</h1>
      <EmptyState
        icon={MapPinOff}
        title="Esta página no existe"
        description="Revisa la dirección o vuelve al inicio."
        action={
          <Link className="btn btn--primary btn--md" to="/">
            <span className="btn__content">
              <House size={16} aria-hidden="true" />
              Volver al inicio
            </span>
          </Link>
        }
      />
    </div>
  );
}
