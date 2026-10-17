import { useContext } from 'react';
import { ToastContext } from './toastContext';

/** toast.success('Categoría creada') desde cualquier componente dentro de <ToastProvider>. */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return context;
}
