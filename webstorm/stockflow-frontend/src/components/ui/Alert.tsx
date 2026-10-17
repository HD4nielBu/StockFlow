import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';

type AlertKind = 'error' | 'success' | 'warning' | 'info';
const ICONS = { error: CircleAlert, success: CircleCheck, warning: TriangleAlert, info: Info };

/** Mensaje en línea. role="alert" (errores) hace que un lector de pantalla lo anuncie de inmediato. */
export function Alert({ kind, title, children, action }: { kind: AlertKind; title?: string; children: ReactNode; action?: ReactNode }) {
  const Icon = ICONS[kind];
  return (
    <div className={`alert alert--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <Icon size={18} aria-hidden="true" className="alert__icon" />
      <div className="alert__body">
        {title && <p className="alert__title">{title}</p>}
        <div>{children}</div>
      </div>
      {action && <div className="alert__action">{action}</div>}
    </div>
  );
}
