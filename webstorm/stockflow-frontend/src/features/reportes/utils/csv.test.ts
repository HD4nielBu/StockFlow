import { describe, expect, it } from 'vitest';
import { aCsv, nombreConFecha } from './csv';

describe('aCsv', () => {
  it('usa ";" como separador, coma decimal y Sí/No para booleanos', () => {
    expect(aCsv(['Código', 'Precio', 'Activo'], [['PRD-1', 38.5, true]])).toBe('Código;Precio;Activo\r\nPRD-1;38,5;Sí');
  });

  it('entrecomilla los textos con separador, comillas o saltos de línea', () => {
    expect(aCsv(['Nombre'], [['Papel "A4"; 75g'], ['dos\nlíneas']])).toBe('Nombre\r\n"Papel ""A4""; 75g"\r\n"dos\nlíneas"');
  });

  it('neutraliza textos que una hoja de cálculo ejecutaría como fórmula', () => {
    expect(aCsv(['x'], [['=HYPERLINK("http://malo")'], ['+1'], ['@SUM(A1)']])).toBe(
      'x\r\n"\'=HYPERLINK(""http://malo"")"\r\n\'+1\r\n\'@SUM(A1)',
    );
  });

  it('deja vacías las celdas nulas y no altera números negativos', () => {
    expect(aCsv(['a', 'b'], [[null, -3]])).toBe('a;b\r\n;-3');
  });
});

describe('nombreConFecha', () => {
  it('incluye la fecha local en el nombre del archivo', () => {
    expect(nombreConFecha('existencias', new Date(2026, 9, 9))).toBe('stockflow-existencias-2026-10-09.csv');
  });
});
