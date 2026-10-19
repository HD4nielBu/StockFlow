import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * G10: captura errores que ocurren al RENDERIZAR (por ejemplo, leer una propiedad de undefined).
 * NO captura errores de fetch ni de event handlers: esos se manejan con try/catch y estado.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Error de render', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error" role="alert">
          <h1>La interfaz tuvo un problema.</h1>
          <p>Recarga la página. Si el error persiste, revisa la consola del navegador (F12).</p>
        </main>
      );
    }
    return this.props.children;
  }
}
