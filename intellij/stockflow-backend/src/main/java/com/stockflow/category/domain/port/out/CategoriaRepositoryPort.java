package com.stockflow.category.domain.port.out;

import com.stockflow.category.domain.model.Categoria;

import java.util.List;
import java.util.Optional;

/** Port OUT: lo que el núcleo necesita del exterior. No extiende JpaRepository. */
public interface CategoriaRepositoryPort {

    Categoria guardar(Categoria categoria);

    Optional<Categoria> buscarPorId(Long id);

    List<Categoria> listar(String nombre);

    boolean existePorCodigo(String codigo);

    boolean existePorNombre(String nombre);
}
