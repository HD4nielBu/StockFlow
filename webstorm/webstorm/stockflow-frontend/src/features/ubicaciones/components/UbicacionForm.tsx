import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError, mensajeDeError } from '../../../api/apiClient';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
import { ETIQUETA_TIPO, TIPOS_UBICACION, type Ubicacion } from '../models/Ubicacion';
import { ubicacionService } from '../services/ubicacionService';
import type { UbicacionFormData } from '../types/UbicacionFormData';
import { validarUbicacion, type UbicacionFormErrors } from '../utils/ubicacionValidation';

const formularioVacio: UbicacionFormData = { codigo: '', nombre: '', tipo: 'DEPOSITO', direccion: '' };

interface UbicacionFormProps {
  onCreated: (ubicacion: Ubicacion) => void;
}

/**
 * G04/G05: formulario controlado para registrar una ubicación (POST).
 * El backend todavía no expone PUT, así que este formulario sólo crea.
 */
export default function UbicacionForm({ onCreated }: UbicacionFormProps) {
  const [formData, setFormData] = useState<UbicacionFormData>(formularioVacio);
  const [errors, setErrors] = useState<UbicacionFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validarUbicacion(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSaving(true);
      const creada = await ubicacionService.crear({
        codigo: formData.codigo.trim().toUpperCase(),
        nombre: formData.nombre.trim(),
        tipo: formData.tipo,
        direccion: formData.direccion.trim() || null,
      });
      onCreated(creada);
      setFormData(formularioVacio);
    } catch (err) {
      // 400: errores por campo; 409: código repetido o segundo almacén central activo
      if (err instanceof ApiError) setErrors(err.fieldErrors as UbicacionFormErrors);
      setApiError(mensajeDeError(err, 'No se pudo registrar la ubicación'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de ubicación">
      <h2>Nueva ubicación</h2>
      <div className="form-grid">
        <label>
          Código
          <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="UB-DEP-ESTE" />
          {errors.codigo && <small className="field-error">{errors.codigo}</small>}
        </label>
        <label>
          Nombre
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Depósito Este" />
          {errors.nombre && <small className="field-error">{errors.nombre}</small>}
        </label>
        <label>
          Tipo
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            {TIPOS_UBICACION.map((t) => (
              <option key={t} value={t}>
                {ETIQUETA_TIPO[t]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Dirección (opcional)
          <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Av. Banzer km 9" />
          {errors.direccion && <small className="field-error">{errors.direccion}</small>}
        </label>
      </div>
      {apiError && <Alert kind="error">{apiError}</Alert>}
      <div className="form-actions">
        <Button type="submit" loading={saving} loadingText="Registrando...">
          Registrar ubicación
        </Button>
      </div>
    </form>
  );
}
