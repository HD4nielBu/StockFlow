// G10: agrega matchers como toBeInTheDocument(), toBeDisabled() y toHaveClass() a expect
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Sin "globals: true", Testing Library no desmonta solo: se limpia el DOM después de cada prueba
afterEach(() => {
  cleanup();
});

// jsdom no implementa showModal()/close() de <dialog>; el navegador real sí.
// Se simulan con el atributo open para poder probar Modal y ConfirmDialog.
HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
  this.removeAttribute('open');
};

// jsdom tampoco implementa matchMedia (lo usan ThemeProvider y el layout). Se responde "no coincide".
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
