import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError, mensajeDeError } from '../../../api/apiClient';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import type { Categoria } from '../../categorias/models/Categoria';
import { UNIDADES_MEDIDA, type Producto } from '../models/Producto';
import { productoService } from '../services/productoService';
import type { ProductoFormData } from '../types/ProductoFormData';
import type { ProductoCreateRequest } from '../types/ProductoRequests';
import { validarProducto, type ProductoFormErrors } from '../utils/productoValidation';

const formularioVacio: ProductoFormData = {
  categoriaId: '',
  codigo: '',
  nombre: '',
  descripcion: '',
  unidadMedida: 'UNIDAD',
  stockMinimoDefault: '0',
  precioReferencial: '',
  activo: true,
};

interface ProductoFormProps {
  categorias: Categoria[];
  producto: Producto | null;
  onSaved: (producto: Producto, mode: 'create' | 'edit') => void;
  onCancelEdit: () => void;
}

/** G07: copia el producto a editar al estado editable; los números pasan a texto para los <input>. */
function aFormulario(producto: Producto | null): ProductoFormData {
  return producto
    ? {
        categoriaId: String(producto.categoriaId),
        codigo: producto.codigo,
        nombre: producto.nombre,
        descripcion: producto.descripcion ?? '',
        unidadMedida: producto.unidadMedida,
        stockMinimoDefault: String(producto.stockMinimoDefault),
        precioReferencial: producto.precioReferencial === null ? '' : producto.precioReferencial.toFixed(2),
        activo: producto.activo,
      }
    : formularioVacio;
}

/** Convierte el texto del formulario en el payload tipado. Sólo se llama DESPUÉS de validar. */
function aPayload(data: ProductoFormData): ProductoCreateRequest {
  return {
    categoriaId: Number(data.categoriaId),
    codigo: data.codigo.trim(),
    nombre: data.nombre.trim(),
    descripcion: data.descripcion.trim() || null,
    unidadMedida: data.unidadMedida,
    stockMinimoDefault: Number(data.stockMinimoDefault),
    precioReferencial: data.precioReferencial.trim() === '' ? null : Number(data.precioReferencial),
  };
}

/**
 * G07: formulario de la entidad hija. El usuario ELIGE una categoría por su nombre, pero el payload
 * envía categoriaId: la relación 1:N la valida y persiste el backend (FK producto.categoria_id).
 * Igual que CategoriaForm: la Page le pasa key={producto?.id} para reiniciarlo al cambiar de producto.
 */
export default function ProductoForm({ categorias, producto, onSaved, onCancelEdit }: ProductoFormProps) {
  const [formData, setFormData] = useState<ProductoFormData>(() => aFormulario(producto));
  const [errors, setErrors] = useState<ProductoFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const isEditing = producto !== null;

  // Opciones del select: categorías activas + la actual del producto (aunque esté inactiva, para no perderla)
  const opciones = categorias.filter((c) => c.activo || c.id === producto?.categoriaId);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valor = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value;
    setFormData((prev) => ({ ...prev, [name]: valor }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validarProducto(formData, categorias, producto?.categoriaId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSaving(true);
      if (producto) {
        onSaved(await productoService.actualizar(producto.id, { ...aPayload(formData), activo: formData.activo }), 'edit');
      } else {
        onSaved(await productoService.crear(aPayload(formData)), 'create');
        setFormData(formularioVacio);
      }
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors as ProductoFormErrors);
      setApiError(mensajeDeError(err, 'No se pudo guardar el producto'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de producto">
      <h2>{isEditing ? `Editar producto ${producto.codigo}` : 'Nuevo producto'}</h2>
      <div className="form-grid">
        <label>
          Categoría
          <select name="categoriaId" value={formData.categoriaId} onChange={handleChange}>
            <option value="">Seleccione una categoría</option>
            {opciones.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.codigo} · {c.nombre}
                {c.activo ? '' : ' (inactiva)'}
              </option>
            ))}
          </select>
          {errors.categoriaId && <small className="field-error">{errors.categoriaId}</small>}
        </label>
        <label>
          Código
          <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="PRD-OFI-010" />
          {errors.codigo && <small className="field-error">{errors.codigo}</small>}
        </label>
        <label className="form-span-2">
          Nombre
          <input name="nombre" value={formData.nombre} onChange={handleChange} />
          {errors.nombre && <small className="field-error">{errors.nombre}</small>}
        </label>
        <label>
          Unidad de medida
          <select name="unidadMedida" value={formData.unidadMedida} onChange={handleChange}>
            {UNIDADES_MEDIDA.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stock mínimo
          <input name="stockMinimoDefault" inputMode="numeric" value={formData.stockMinimoDefault} onChange={handleChange} />
          {errors.stockMinimoDefault && <small className="field-error">{errors.stockMinimoDefault}</small>}
        </label>
        <label>
          Precio referencial (opcional)
          <input name="precioReferencial" inputMode="decimal" value={formData.precioReferencial} onChange={handleChange} placeholder="18.90" />
          {errors.precioReferencial && <small className="field-error">{errors.precioReferencial}</small>}
        </label>
        <label className="form-span-2">
          Descripción
          <textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} />
          {errors.descripcion && <small className="field-error">{errors.descripcion}</small>}
        </label>
        {isEditing && (
          <label className="checkbox-field form-span-2">
            <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
            Producto activo
          </label>
        )}
      </div>
      {apiError && <Alert kind="error">{apiError}</Alert>}
      <div className="form-actions">
        {isEditing && (
          <Button variant="secondary" onClick={onCancelEdit} disabled={saving}>
            Cancelar edición
          </Button>
        )}
        <Button type="submit" loading={saving} loadingText="Guardando...">
          {isEditing ? 'Actualizar producto' : 'Crear producto'}
        </Button>
      </div>
    </form>
  );
}
