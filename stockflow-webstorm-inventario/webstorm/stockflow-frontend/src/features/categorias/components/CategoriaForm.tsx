import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ApiError, mensajeDeError } from '../../../api/apiClient';
import { Alert } from '../../../components/ui/Alert';
import { Button } from '../../../components/ui/Button';
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
  onCancelEdit: () => void;
}

/**
 * G04/G06: un solo formulario controlado para crear (POST) y editar (PUT).
 * La decisión POST/PUT depende de si existe una categoría persistida (con id), no del texto del botón.
 * La Page lo renderiza con key={categoria?.id}: al cambiar la categoría a editar, React lo vuelve a
 * montar y useState toma el nuevo valor inicial (en vez de copiar props al estado con un Effect).
 */
export default function CategoriaForm({ categoria, onSaved, onCancelEdit }: CategoriaFormProps) {
  const [formData, setFormData] = useState<CategoriaFormData>(() => aFormulario(categoria));
  const [errors, setErrors] = useState<CategoriaFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const isEditing = categoria !== null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const valor = e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : value;
    // Inmutabilidad: se crea un objeto nuevo con ...prev; nunca formData.nombre = ...
    setFormData((prev) => ({ ...prev, [name]: valor }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // la SPA no recarga la página
    setApiError('');
    const validationErrors = validarCategoria(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return; // no se envía una petición que fallaría

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
        setFormData(formularioVacio);
      }
    } catch (err) {
      // 400 del backend: se muestran sus errores junto a cada campo; 409: código o nombre repetido
      if (err instanceof ApiError) setErrors(err.fieldErrors as CategoriaFormErrors);
      setApiError(mensajeDeError(err, 'No se pudo guardar la categoría'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate aria-label="Formulario de categoría">
      <h2>{isEditing ? `Editar categoría #${categoria.id}` : 'Nueva categoría'}</h2>
      <div className="form-grid">
        <label>
          Código
          <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="CAT-OFI" />
          {errors.codigo && <small className="field-error">{errors.codigo}</small>}
        </label>
        <label>
          Nombre
          <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Material de oficina" />
          {errors.nombre && <small className="field-error">{errors.nombre}</small>}
        </label>
        <label className="form-span-2">
          Descripción
          <textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} />
          {errors.descripcion && <small className="field-error">{errors.descripcion}</small>}
        </label>
        {isEditing && (
          <label className="checkbox-field form-span-2">
            <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
            Categoría activa (una inactiva no admite productos nuevos)
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
          {isEditing ? 'Actualizar categoría' : 'Crear categoría'}
        </Button>
      </div>
    </form>
  );
}
