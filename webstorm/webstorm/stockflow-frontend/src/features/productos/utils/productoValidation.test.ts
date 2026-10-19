import { describe, expect, it } from 'vitest';
import { categoriasMock } from '../../categorias/data/categorias.mock';
import type { ProductoFormData } from '../types/ProductoFormData';
import { validarProducto } from './productoValidation';

const valido: ProductoFormData = {
  categoriaId: '1',
  codigo: 'PRD-NEW-001',
  nombre: 'Producto nuevo',
  descripcion: '',
  unidadMedida: 'UNIDAD',
  stockMinimoDefault: '5',
  precioReferencial: '12.50',
  activo: true,
};

describe('validarProducto', () => {
  it('no devuelve errores con datos válidos', () => {
    expect(validarProducto(valido, categoriasMock)).toEqual({});
  });

  it('exige una categoría existente', () => {
    expect(validarProducto({ ...valido, categoriaId: '' }, categoriasMock).categoriaId).toBe('Seleccione una categoría');
    expect(validarProducto({ ...valido, categoriaId: '99' }, categoriasMock).categoriaId).toMatch(/no existe/);
  });

  it('no permite asignar un producto nuevo a una categoría inactiva', () => {
    expect(validarProducto({ ...valido, categoriaId: '4' }, categoriasMock).categoriaId).toMatch(/inactiva/);
  });

  it('permite conservar la categoría inactiva que el producto ya tenía', () => {
    expect(validarProducto({ ...valido, categoriaId: '4' }, categoriasMock, 4).categoriaId).toBeUndefined();
  });

  it('RN-07: el stock mínimo debe ser un entero no negativo', () => {
    expect(validarProducto({ ...valido, stockMinimoDefault: '-1' }, categoriasMock).stockMinimoDefault).toMatch(/RN-07/);
    expect(validarProducto({ ...valido, stockMinimoDefault: '2.5' }, categoriasMock).stockMinimoDefault).toMatch(/RN-07/);
  });

  it('el precio es opcional pero, si se escribe, admite hasta 2 decimales', () => {
    expect(validarProducto({ ...valido, precioReferencial: '' }, categoriasMock).precioReferencial).toBeUndefined();
    expect(validarProducto({ ...valido, precioReferencial: '1.234' }, categoriasMock).precioReferencial).toBeDefined();
  });
});
