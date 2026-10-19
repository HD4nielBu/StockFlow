/**
 * Barra de nivel: cantidad frente al mínimo. Llena = el doble del mínimo o más.
 * El texto acompaña siempre al color (accesibilidad).
 */
export function NivelStock({ cantidad, minimo }: { cantidad: number; minimo: number }) {
  const tope = Math.max(minimo * 2, 1);
  const nivel = Math.min(1, cantidad / tope);
  const bajo = cantidad <= minimo;
  return (
    <span className={`nivel-stock${bajo ? ' nivel-stock--bajo' : ''}`} role="img" aria-label={`${cantidad} de mínimo ${minimo}`}>
      <span className="nivel-stock__barra" style={{ transform: `scaleX(${nivel})` }} />
    </span>
  );
}
