/** Mensaje de error o de éxito. role="alert" hace que un lector de pantalla lo anuncie. */
export function Alert({ kind, children }: { kind: 'error' | 'success'; children: string }) {
  return (
    <div className={`alert alert--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
