import { Link } from 'react-router';

/** G02: ruta comodín (*). Es un 404 de la SPA, no un 404 de la API. */
export default function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">Error 404</p>
      <h2>La página solicitada no existe</h2>
      <p>Revisa la dirección o vuelve al panel principal.</p>
      <Link className="button-link" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}
