package com.stockflow.producto.domain;

import java.util.Optional;

public interface ProductoRepository {
    Producto guardar(Producto producto);
    Optional<Producto> buscarPorId(Long id);
    Optional<Producto> buscarPorCodigo(String codigo);
}