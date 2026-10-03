package com.stockflow.category.domain.port.in;

import com.stockflow.category.domain.model.Categoria;

/** Port IN: reemplazar los datos editables de una categoría existente (PUT). */
public interface ActualizarCategoriaUseCase {

    /** El id llega por separado: la identidad la decide la ruta, no el cuerpo. */
    Categoria actualizar(Long id, Categoria cambios);
}
