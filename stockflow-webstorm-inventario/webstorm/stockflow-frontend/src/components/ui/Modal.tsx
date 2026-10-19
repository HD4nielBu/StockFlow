import { useEffect, useRef, type ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

/**
 * G09: modal con el <dialog> nativo. showModal() lo coloca encima de todo, bloquea el fondo
 * y permite cerrarlo con Escape (evento cancel). El Effect sincroniza la prop open con el DOM.
 */
export function Modal({ open, title, children, onClose }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="modal-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header className="modal__header">
        <h2 id="modal-title">{title}</h2>
        <button type="button" className="modal__close" aria-label="Cerrar" onClick={onClose}>
          ×
        </button>
      </header>
      {children}
    </dialog>
  );
}
