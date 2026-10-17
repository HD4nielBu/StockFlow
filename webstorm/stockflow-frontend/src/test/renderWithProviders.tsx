import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { ToastProvider } from '../components/ui/toast/ToastProvider';
import { DemoSessionProvider } from '../features/auth/DemoSessionProvider';

/** Las Pages usan enlaces (Router), notificaciones (Toast) y la sesión demo: se montan con los mismos providers que la app. */
export function renderWithProviders(ui: ReactElement, { route = '/' }: { route?: string } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <DemoSessionProvider>
        <ToastProvider>{ui}</ToastProvider>
      </DemoSessionProvider>
    </MemoryRouter>,
  );
}
