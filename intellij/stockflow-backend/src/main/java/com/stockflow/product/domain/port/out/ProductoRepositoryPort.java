package com.stockflow.product.domain.port.out;

import com.stockflow.product.domain.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoRepositoryPort {

    Producto guardar(Producto producto);

    Optional<Producto> buscarPorId(Long id);

    List<Producto> listarPorCategoriaId(Long categoriaId);

    boolean existePorCodigo(String codigo);
}
