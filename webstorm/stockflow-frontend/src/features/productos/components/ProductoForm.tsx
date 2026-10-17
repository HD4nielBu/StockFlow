import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { describirError, type ErrorLegible } from '../../../api/describirError';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field, Input, Select, Textarea } from '../../../components/ui/Field';
import { Switch } from '../../../components/ui/Switch';
import type { Categoria } from '../../categorias/models/Categoria';
import { UNIDAD_LABEL, UNIDADES_MEDIDA, type Producto } from '../models/Producto';
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
  /** Categoría preseleccionada al crear (p. ej. si la lista está filtrada por una categoría). */
  categoriaInicial?: number;
  onSaved: (producto: Producto, mode: 'create' | 'edit') => void;
  onCancel: () => void;
  /** El backend respondió 404: el producto ya no existe y la lista debe recargarse. */
  onStale?: () => void;
}

/** G07: copia el producto a editar al estado editable; los números pasan a texto para los <input>. */
function aFormulario(producto: Producto | null, categoriaInicial?: number): ProductoFormData {
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
    : { ...formularioVacio, categoriaId: categoriaInicial ? String(categoriaInicial) : '' };
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
 * Igual que CategoriaForm: la Page le pasa un key nuevo en cada apertura para reiniciarlo.
 */
export default function ProductoForm({ categorias, producto, categoriaInicial, onSaved, onCancel, onStale }: ProductoFormProps) {
  const [formData, setFormData] = useState<ProductoFormData>(() => aFormulario(producto, categoriaInicial));
  const [errors, setErrors] = useState<ProductoFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ErrorLegible | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = producto !== null;

  // Opciones del select: categorías activas + la actual del producto (aunque esté inactiva, para no perderla)
  const opciones = categorias.filter((c) => c.activo || c.id === producto?.categoriaId);

  useEffect(() => {
    const frame = requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('select, input')?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const enfocarPrimerError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valor = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value;
    setFormData((prev) => ({ ...prev, [name]: valor }));
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    const validationErrors = validarProducto(formData, categorias, producto?.categoriaId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      enfocarPrimerError();
      return;
    }

    try {
      setSaving(true);
      if (producto) {
        onSaved(await productoService.actualizar(producto.id, { ...aPayload(formData), activo: formData.activo }), 'edit');
      } else {
        onSaved(await productoService.crear(aPayload(formData)), 'create');
      }
    } catch (err) {
      // 400: errores por campo · 409: código repetido · 422: categoría inactiva (regla de la relación)
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors as ProductoFormErrors);
        if (err.status === 404) onStale?.();
      }
      setApiError(describirError(err, 'guardar el producto'));
      enfocarPrimerError();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} className="modal-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de producto">
      <div className="modal__body">
        {apiError && (
          <Alert kind="error" title={apiError.title}>
            {apiError.description}
          </Alert>
        )}
        <div className="form-grid">
          <Field
            label="Categoría"
            required
            error={errors.categoriaId}
            hint={opciones.length === 0 ? 'No hay categorías activas: crea una primero.' : 'Sólo se listan categorías activas.'}
            className="form-span-2"
          >
            {(control) => (
              <Select {...control} name="categoriaId" value={formData.categoriaId} onChange={handleChange}>
                <option value="">Selecciona una categoría</option>
                {opciones.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.nombre} ({c.codigo}){c.activo ? '' : ' · inactiva'}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Código" required error={errors.codigo} hint="Letras, números y guiones. Ej.: PRD-OFI-010">
            {(control) => (
              <Input {...control} name="codigo" value={formData.codigo} onChange={handleChange} maxLength={40} autoComplete="off" />
            )}
          </Field>
          <Field label="Unidad de medida" required>
            {(control) => (
              <Select {...control} name="unidadMedida" value={formData.unidadMedida} onChange={handleChange}>
                {UNIDADES_MEDIDA.map((u) => (
                  <option key={u} value={u}>
                    {UNIDAD_LABEL[u]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Nombre" required error={errors.nombre} className="form-span-2">
            {(control) => (
              <Input {...control} name="nombre" value={formData.nombre} onChange={handleChange} maxLength={140} placeholder="Resma papel bond A4" />
            )}
          </Field>
          <Field label="Stock mínimo" required error={errors.stockMinimoDefault} hint="Por debajo de esta cantidad se genera una alerta.">
            {(control) => (
              <Input {...control} name="stockMinimoDefault" inputMode="numeric" value={formData.stockMinimoDefault} onChange={handleChange} />
            )}
          </Field>
          <Field label="Precio referencial" error={errors.precioReferencial} hint="Opcional · hasta 2 decimales">
            {(control) => (
              <Input {...control} name="precioReferencial" inputMode="decimal" value={formData.precioReferencial} onChange={handleChange} placeholder="18.90" />
            )}
          </Field>
          <Field label="Descripción" error={errors.descripcion} hint={`Opcional · ${formData.descripcion.length}/1000`} className="form-span-2">
            {(control) => <Textarea {...control} name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} />}
          </Field>
          {isEditing && (
            <Switch
              className="form-span-2"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              label="Producto activo"
              description="Si el producto ya tiene stock o movimientos no se puede eliminar: desactívalo en su lugar."
            />
          )}
        </div>
      </div>
      <footer className="modal__footer">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving} loadingText="Guardando...">
          {isEditing ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </footer>
    </form>
  );
}
