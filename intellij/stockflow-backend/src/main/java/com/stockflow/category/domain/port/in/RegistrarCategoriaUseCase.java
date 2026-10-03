package com.stockflow.category.domain.port.in;

import com.stockflow.category.domain.model.Categoria;

/** Port IN: capacidad "registrar una categoría" (RF-06). */
public interface RegistrarCategoriaUseCase {

    Categoria registrar(Categoria categoria);
}
