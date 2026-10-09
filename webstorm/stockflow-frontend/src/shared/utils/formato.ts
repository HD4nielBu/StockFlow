const cantidad = new Intl.NumberFormat('es-BO', { maximumFractionDigits: 3 });
const precio = new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Cantidades de stock: el backend usa NUMERIC con 3 decimales (120.000 → "120"). */
export const formatoCantidad = (valor: number) => cantidad.format(valor);

/** Precio referencial con 2 decimales. No se asume moneda: el backend no la informa. */
export const formatoPrecio = (valor: number) => precio.format(valor);
