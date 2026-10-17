import { ToastProvider } from '../components/ui/toast/ToastProvider';
import { DemoSessionProvider } from '../features/auth/DemoSessionProvider';
import AppRouter from '../routes/AppRouter';
import { ThemeProvider } from './theme/ThemeProvider';

/** G02: App sólo compone los providers globales y delega en el router. */
export default function App() {
  return (
    <ThemeProvider>
      <DemoSessionProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </DemoSessionProvider>
    </ThemeProvider>
  );
}
