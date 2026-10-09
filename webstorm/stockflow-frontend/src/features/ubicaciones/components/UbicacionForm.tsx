import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError } from '../../../api/apiClient';
import { describirError, type ErrorLegible } from '../../../api/describirError';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { Field, Input, Select, Textarea } from '../../../components/ui/Field';
import { TIPO_UBICACION_LABEL, TIPOS_UBICACION, type Ubicacion } from '../models/Ubicacion';
import { ubicacionService } from '../services/ubicacionService';
import { validarUbicacion, type UbicacionFormData, type UbicacionFormErrors } from '../utils/ubicacionValidation';

const vacio: UbicacionFormData = { codigo: '', nombre: '', tipo: 'DEPOSITO', direccion: '' };

interface UbicacionFormProps {
  /** Ya existe un almacén central: el backend rechaza un segundo (409), así que se avisa antes. */
  hayAlmacenCentral: boolean;
  onSaved: (ubicacion: Ubicacion) => void;
  onCancel: () => void;
}

/** Alta de ubicación (POST /api/ubicaciones). La API no permite editarlas ni eliminarlas. */
export default function UbicacionForm({ hayAlmacenCentral, onSaved, onCancel }: UbicacionFormProps) {
  const [form, setForm] = useState<UbicacionFormData>(vacio);
  const [errors, setErrors] = useState<UbicacionFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ErrorLegible | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input')?.focus());
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    const validationErrors = validarUbicacion(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    try {
      setSaving(true);
      onSaved(
        await ubicacionService.crear({
          codigo: form.codigo.trim(),
          nombre: form.nombre.trim(),
          tipo: form.tipo,
          direccion: form.direccion.trim() || null,
        }),
      );
    } catch (err) {
      if (err instanceof ApiError) setErrors(err.fieldErrors as UbicacionFormErrors);
      setApiError(describirError(err, 'crear la ubicación'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} className="modal-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de ubicación">
      <div className="modal__body">
        {apiError && (
          <Alert kind="error" title={apiError.title}>
            {apiError.description}
          </Alert>
        )}
        <div className="form-grid">
          <Field label="Código" required error={errors.codigo} hint="Letras, números y guiones. Ej.: UB-DEP-ESTE">
            {(control) => <Input {...control} name="codigo" value={form.codigo} onChange={handleChange} maxLength={30} autoComplete="off" />}
          </Field>
          <Field
            label="Tipo"
            required
            error={errors.tipo}
            hint={hayAlmacenCentral ? 'Ya existe un almacén central: sólo puede haber uno.' : undefined}
          >
            {(control) => (
              <Select {...control} name="tipo" value={form.tipo} onChange={handleChange}>
                {TIPOS_UBICACION.map((t) => (
                  <option key={t} value={t} disabled={t === 'ALMACEN_CENTRAL' && hayAlmacenCentral}>
                    {TIPO_UBICACION_LABEL[t]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Nombre" required error={errors.nombre} className="form-span-2">
            {(control) => <Input {...control} name="nombre" value={form.nombre} onChange={handleChange} maxLength={120} placeholder="Depósito Este" />}
          </Field>
          <Field label="Dirección" error={errors.direccion} hint={`Opcional · ${form.direccion.length}/220`} className="form-span-2">
            {(control) => <Textarea {...control} name="direccion" rows={2} value={form.direccion} onChange={handleChange} maxLength={220} />}
          </Field>
        </div>
      </div>
      <footer className="modal__footer">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving} loadingText="Guardando...">
          Crear ubicación
        </Button>
      </footer>
    </form>
  );
}
