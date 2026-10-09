import { createContext } from 'react';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastInput {
  title: string;
  description?: string;
}

export interface ToastApi {
  success: (toast: ToastInput | string) => void;
  error: (toast: ToastInput | string) => void;
  info: (toast: ToastInput | string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);
