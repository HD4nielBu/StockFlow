import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: ReactNode;
  description?: ReactNode;
  /** Acciones a la derecha del título (botones, enlaces, badges). */
  actions?: ReactNode;
  /** Sin padding interno: para tablas o listas que llegan al borde. */
  flush?: boolean;
};

export function Card({ title, description, actions, flush = false, className, children, ...props }: CardProps) {
  return (
    <section className={['card', flush && 'card--flush', className].filter(Boolean).join(' ')} {...props}>
      {(title || actions) && (
        <header className="card__header">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {description && <p className="card__description">{description}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
