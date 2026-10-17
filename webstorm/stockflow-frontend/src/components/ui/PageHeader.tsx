import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { DemoBadge } from './DemoBadge';
import { Tooltip } from './Tooltip';

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  /** Botones principales de la página ("Nueva categoría"). */
  actions?: ReactNode;
  /** Referencia técnica/académica (RF, endpoint). Se consulta con el icono de información. */
  reference?: string;
  /** La página usa datos locales de demostración. */
  demo?: boolean;
};

/** Encabezado común de cada página: el único <h1> de la vista. */
export function PageHeader({ title, description, actions, reference, demo = false }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header__text">
        <div className="page-header__title-row">
          <h1 className="page-header__title">{title}</h1>
          {demo && <DemoBadge />}
          {reference && (
            <Tooltip content={reference} placement="bottom-start">
              <button type="button" className="icon-button page-header__info" aria-label="Referencia técnica">
                <Info size={16} aria-hidden="true" />
              </button>
            </Tooltip>
          )}
        </div>
        {description && <p className="page-header__description">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
