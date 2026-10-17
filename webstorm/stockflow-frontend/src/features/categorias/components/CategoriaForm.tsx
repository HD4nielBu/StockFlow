import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { describirError, type ErrorLegible } from '../../../api/describirError';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field, Input, Textarea } from '../../../components/ui/Field';
import { Switch } from '../../../components/ui/Switch';
import type { Categoria } from '../models/Categoria';
import { categoriaService } from '../services/categoriaService';
import type { CategoriaFormData } from '../types/CategoriaFormData';
import { validarCategoria, type CategoriaFormErrors } from '../utils/categoriaValidation';

const formularioVacio: CategoriaFormData = { codigo: '', nombre: '', descripcion: '', activo: true };

/** G06: copia la categoría a editar al estado editable (o el formulario vacío en modo crear). */
function aFormulario(categoria: Categoria | null): CategoriaFormData {
  return categoria
    ? { codigo: categoria.codigo, nombre: categoria.nombre, descripcion: categoria.descripcion ?? '', activo: categoria.activo }
    : formularioVacio;
}

interface CategoriaFormProps {
  /** null = modo crear; una categoría = modo editar. */
  categoria: Categoria | null;
  onSaved: (categoria: Categoria, mode: 'create' | 'edit') => void;
  onCancel: () => void;
  /** El backend respondió 404: la categoría ya no existe y la lista debe recargarse. */
  onStale?: () => void;
}

/**
 * G04/G06: un solo formulario controlado para crear (POST) y editar (PUT). Vive dentro de un Modal.
 * La decisión POST/PUT depende de si existe una categoría persistida (con id), no del texto del botón.
 * La Page lo renderiza con un key nuevo en cada apertura: React lo vuelve a montar y useState toma
 * el valor inicial correcto (en vez de copiar props al estado con un Effect).
 */
export default function CategoriaForm({ categoria, onSaved, onCancel, onStale }: CategoriaFormProps) {
  const [formData, setFormData] = useState<CategoriaFormData>(() => aFormulario(categoria));
  const [errors, setErrors] = useState<CategoriaFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ErrorLegible | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = categoria !== null;

  // Foco en el primer campo. requestAnimationFrame: showModal() del Modal padre corre DESPUÉS de este Effect
  useEffect(() => {
    const frame = requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input')?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const enfocarPrimerError = () =>
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valor = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value;
    // Inmutabilidad: se crea un objeto nuevo con ...prev; nunca formData.nombre = ...
    setFormData((prev) => ({ ...prev, [name]: valor }));
    // El error de un campo desaparece en cuanto el usuario lo corrige
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // la SPA no recarga la página
    setApiError(null);
    const validationErrors = validarCategoria(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      enfocarPrimerError();
      return; // no se envía una petición que fallaría
    }

    const base = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null,
    };
    try {
      setSaving(true);
      if (categoria) {
        onSaved(await categoriaService.actualizar(categoria.id, { ...base, activo: formData.activo }), 'edit');
      } else {
        onSaved(await categoriaService.crear(base), 'create');
      }
    } catch (err) {
      // 400 del backend: sus errores se muestran junto a cada campo; 409: código o nombre repetido
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors as CategoriaFormErrors);
        if (err.status === 404) onStale?.();
      }
      setApiError(describirError(err, 'guardar la categoría'));
      enfocarPrimerError();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} className="modal-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de categoría">
      <div className="modal__body">
        {apiError && (
          <Alert kind="error" title={apiError.title}>
            {apiError.description}
          </Alert>
        )}
        <div className="form-grid">
          <Field label="Código" required error={errors.codigo} hint="Letras, números y guiones. Ej.: CAT-OFI">
            {(control) => (
              <Input {...control} name="codigo" value={formData.codigo} onChange={handleChange} maxLength={30} autoComplete="off" />
            )}
          </Field>
          <Field label="Nombre" required error={errors.nombre}>
            {(control) => (
              <Input {...control} name="nombre" value={formData.nombre} onChange={handleChange} maxLength={100} placeholder="Material de oficina" />
            )}
          </Field>
          <Field
            label="Descripción"
            error={errors.descripcion}
            hint={`Opcional · ${formData.descripcion.length}/1000`}
            className="form-span-2"
          >
            {(control) => <Textarea {...control} name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} />}
          </Field>
          {isEditing && (
            <Switch
              className="form-span-2"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              label="Categoría activa"
              description="Una categoría inactiva no admite productos nuevos."
            />
          )}
        </div>
      </div>
      <footer className="modal__footer">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving} loadingText="Guardando...">
          {isEditing ? 'Guardar cambios' : 'Crear categoría'}
        </Button>
      </footer>
    </form>
  );
}
