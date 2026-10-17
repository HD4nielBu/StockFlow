import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastInput, type ToastTone } from './toastContext';

interface ToastItem extends ToastInput {
  id: number;
  tone: ToastTone;
  closing: boolean;
}

const MAX_VISIBLE = 4;
// Los errores se leen con más calma: duran más
const DURATION: Record<ToastTone, number> = { success: 4000, info: 5000, error: 7000 };
const EXIT_MS = 160;
const ICONS = { success: CircleCheck, error: CircleAlert, info: Info };

/**
 * Notificaciones efímeras. El contenedor aria-live existe desde el inicio (si se creara junto con el
 * mensaje, algunos lectores de pantalla no lo anunciarían). Los errores usan role="alert".
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, closing: true } : t)));
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), EXIT_MS);
  }, []);

  const push = useCallback((tone: ToastTone, input: ToastInput | string) => {
    const toast = typeof input === 'string' ? { title: input } : input;
    const id = nextId.current++;
    setToasts((prev) => [...prev, { ...toast, id, tone, closing: false }].slice(-MAX_VISIBLE));
  }, []);

  const api = useMemo(
    () => ({
      success: (t: ToastInput | string) => push('success', t),
      error: (t: ToastInput | string) => push('error', t),
      info: (t: ToastInput | string) => push('info', t),
    }),
    [push],
  );

  return (
    <ToastContext value={api}>
      {children}
      <section className="toast-viewport" aria-label="Notificaciones">
        {/* div y no ol/li: cada toast lleva role status/alert, que no se permite en un <li> */}
        <div aria-live="polite" className="toast-list">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      </section>
    </ToastContext>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = ICONS[toast.tone];
  const [paused, setPaused] = useState(false);
  const remaining = useRef(DURATION[toast.tone]);

  // El temporizador se pausa con el puntero o el foco encima, y con la pestaña oculta
  useEffect(() => {
    if (paused || toast.closing) return;
    const started = Date.now();
    const timer = window.setTimeout(() => onDismiss(toast.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, toast.closing, toast.id, onDismiss]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <div
      className={`toast toast--${toast.tone}`}
      data-closing={toast.closing || undefined}
      role={toast.tone === 'error' ? 'alert' : 'status'}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon size={18} aria-hidden="true" className="toast__icon" />
      <div className="toast__text">
        <p className="toast__title">{toast.title}</p>
        {toast.description && <p className="toast__description">{toast.description}</p>}
      </div>
      <button type="button" className="icon-button toast__close" aria-label="Cerrar notificación" onClick={() => onDismiss(toast.id)}>
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
