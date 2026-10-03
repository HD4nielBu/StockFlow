package com.stockflow.product.domain.port.out;

import com.stockflow.product.domain.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoRepositoryPort {

    Producto guardar(Producto producto);

    /** Modifica un producto que ya existe; nunca crea uno nuevo. */
    Producto actualizar(Producto producto);

    /** Lanza ProductoEnUsoException si alguna FK (stock, movimientos, solicitudes) lo impide. */
    void eliminar(Long id);

    Optional<Producto> buscarPorId(Long id);

    List<Producto> listarPorCategoriaId(Long categoriaId);

    boolean existePorCodigo(String codigo);

    /** Unicidad en un PUT: ignora al propio producto para no dar un 409 falso. */
    boolean existePorCodigoEnOtro(String codigo, Long id);
}
