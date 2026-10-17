export type Celda = string | number | boolean | null | undefined;

/**
 * Separador ";" y coma decimal: es lo que espera Excel con configuración regional en español,
 * así el archivo se abre en columnas sin pasos extra.
 */
const SEPARADOR = ';';
const numero = new Intl.NumberFormat('es-BO', { useGrouping: false, maximumFractionDigits: 3 });

function celda(valor: Celda): string {
  if (valor === null || valor === undefined) return '';
  let texto = typeof valor === 'number' ? numero.format(valor) : typeof valor === 'boolean' ? (valor ? 'Sí' : 'No') : valor;
  // Inyección de fórmulas: un nombre como "=HYPERLINK(...)" no debe ejecutarse al abrir el archivo
  if (typeof valor === 'string' && /^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function aCsv(encabezados: string[], filas: Celda[][]): string {
  return [encabezados, ...filas].map((fila) => fila.map(celda).join(SEPARADOR)).join('\r\n');
}

/** Descarga el CSV. El BOM hace que Excel reconozca UTF-8 (tildes y eñes). */
export function descargarCsv(nombreArchivo: string, contenido: string): void {
  const blob = new Blob(['﻿', contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

/** "stockflow-existencias-2026-10-09.csv" */
export function nombreConFecha(base: string, fecha = new Date()): string {
  const iso = [fecha.getFullYear(), String(fecha.getMonth() + 1).padStart(2, '0'), String(fecha.getDate()).padStart(2, '0')].join('-');
  return `stockflow-${base}-${iso}.csv`;
}
