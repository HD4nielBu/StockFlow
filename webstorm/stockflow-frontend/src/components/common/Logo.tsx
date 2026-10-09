/**
 * Marca de StockFlow: tres niveles de stock que crecen. Es decorativa (aria-hidden):
 * el nombre "StockFlow" siempre aparece como texto a su lado o en un aria-label.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="8" fill="var(--logo-bg, #17365D)" />
      <rect x="7" y="17" width="5" height="8" rx="1.5" fill="#fff" fillOpacity="0.55" />
      <rect x="13.5" y="13" width="5" height="12" rx="1.5" fill="#fff" fillOpacity="0.8" />
      <rect x="20" y="8" width="5" height="17" rx="1.5" fill="#60A5FA" />
    </svg>
  );
}
