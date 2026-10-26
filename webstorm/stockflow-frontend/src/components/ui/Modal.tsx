import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

type ModalProps = {
  open: boolean;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  /** Botones del pie (Cancelar / Guardar). Quedan fijos aunque el cuerpo haga scroll. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /**
   * true: los hijos traen su propio .modal__body y .modal__footer (formularios: así el botón
   * Guardar queda dentro del <form> y Enter envía).
   */
  raw?: boolean;
  /** Formularios: si el usuario ya escribió algo, Escape / fondo / ✕ piden confirmar antes de descartarlo. */
  guardChanges?: boolean;
  onClose: () => void;
};

/**
 * G09: modal con el <dialog> nativo. showModal() lo coloca encima de todo, bloquea el fondo,
 * atrapa el foco y lo devuelve al botón que lo abrió al cerrarse. Escape dispara "cancel".
 * El id del título sale de useId: varios modales montados a la vez no comparten id.
 */
export function Modal({ open, title, description, children, footer, size = 'md', raw = false, guardChanges = false, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Clic en el fondo: sólo cierra si el gesto EMPEZÓ y terminó fuera del panel (no al seleccionar texto)
  const pressedBackdrop = useRef(false);
  // Cualquier evento input dentro del diálogo (burbujea desde inputs, selects y checkboxes) lo marca como modificado
  const dirty = useRef(false);
  const [askDiscard, setAskDiscard] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dirty.current = false;
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const requestClose = () => (guardChanges && dirty.current ? setAskDiscard(true) : onClose());

  return (
    <>
      <dialog
        ref={ref}
        className={`modal modal--${size}`}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onInput={() => {
          dirty.current = true;
        }}
        onCancel={(e) => {
          e.preventDefault();
          requestClose();
        }}
        onPointerDown={(e) => {
          pressedBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressedBackdrop.current && e.target === e.currentTarget) requestClose();
          pressedBackdrop.current = false;
        }}
      >
        <div className="modal__panel">
          <header className="modal__header">
            <div>
              <h2 id={titleId} className="modal__title">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="modal__description">
                  {description}
                </p>
              )}
            </div>
            <button type="button" className="icon-button modal__close" aria-label="Cerrar" onClick={requestClose}>
              <X size={18} aria-hidden="true" />
            </button>
          </header>
          {raw ? (
            children
          ) : (
            <>
              <div className="modal__body">{children}</div>
              {footer && <footer className="modal__footer">{footer}</footer>}
            </>
          )}
        </div>
      </dialog>
      {/* Hermano y no hijo: así sus clics y su Escape no llegan a los manejadores del diálogo de arriba */}
      {guardChanges && (
        <ConfirmDialog
          open={askDiscard}
          title="¿Descartar los cambios?"
          message="Lo que escribiste en el formulario se perderá."
          confirmLabel="Descartar"
          onConfirm={() => {
            setAskDiscard(false);
            onClose();
          }}
          onCancel={() => setAskDiscard(false)}
        />
      )}
    </>
  );
}
