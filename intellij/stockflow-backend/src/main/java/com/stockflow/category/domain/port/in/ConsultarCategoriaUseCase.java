package com.stockflow.category.domain.port.in;

import com.stockflow.category.domain.model.Categoria;

import java.util.List;
import java.util.Optional;

/** Port IN: consultas del catálogo de categorías. Lo usa también el módulo product. */
public interface ConsultarCategoriaUseCase {

    Optional<Categoria> buscarPorId(Long id);

    List<Categoria> listar(String nombre);
}
