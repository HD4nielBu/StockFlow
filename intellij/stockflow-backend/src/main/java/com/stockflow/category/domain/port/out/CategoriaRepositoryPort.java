package com.stockflow.category.domain.port.out;

import com.stockflow.category.domain.model.Categoria;

import java.util.List;
import java.util.Optional;

/** Port OUT: lo que el núcleo necesita del exterior. No extiende JpaRepository. */
public interface CategoriaRepositoryPort {

    Categoria guardar(Categoria categoria);

    /** Modifica una categoría que ya existe; nunca crea una nueva. */
    Categoria actualizar(Categoria categoria);

    /** Lanza CategoriaConProductosException si la FK de producto lo impide. */
    void eliminar(Long id);

    Optional<Categoria> buscarPorId(Long id);

    List<Categoria> listar(String nombre);

    boolean existePorCodigo(String codigo);

    boolean existePorNombre(String nombre);

    /** Unicidad en un PUT: ignora a la propia categoría para no dar un 409 falso. */
    boolean existePorCodigoEnOtra(String codigo, Long id);

    boolean existePorNombreEnOtra(String nombre, Long id);
}
