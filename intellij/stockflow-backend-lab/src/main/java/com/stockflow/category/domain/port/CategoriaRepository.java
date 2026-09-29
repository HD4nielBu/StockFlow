package com.stockflow.category.domain.port;

import com.stockflow.category.domain.Categoria;

import java.util.List;
import java.util.Optional;

/**
 * Contrato del repositorio. NO sabe si los datos viven en memoria,
 * en PostgreSQL o en otro lugar: sólo declara QUÉ necesita la aplicación.
 */
public interface CategoriaRepository {

    Categoria guardar(Categoria categoria);

    Optional<Categoria> buscarPorId(Long id);

    List<Categoria> listarTodas();

    boolean existePorCodigo(String codigo);
}
