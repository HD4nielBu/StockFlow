package com.stockflow.product.domain.port.in;

import com.stockflow.product.domain.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ConsultarProductoUseCase {

    Optional<Producto> buscarPorId(Long id);

    List<Producto> listarPorCategoria(Long categoriaId);
}
