import { TriangleAlert } from 'lucide-react';
import { Button } from './Button';
import { Modal } from './Modal';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** G09: reemplaza window.confirm(). No sabe QUÉ se elimina: la Page decide qué service llamar. */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  confirmingLabel = 'Eliminando...',
  confirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      size="sm"
      onClose={() => !confirming && onCancel()}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={confirming}>
            Cancelar
          </Button>
          <Button variant="danger" loading={confirming} loadingText={confirmingLabel} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="confirm">
        <span className="confirm__icon" aria-hidden="true">
          <TriangleAlert size={20} />
        </span>
        <p className="confirm__message">{message}</p>
      </div>
    </Modal>
  );
}
