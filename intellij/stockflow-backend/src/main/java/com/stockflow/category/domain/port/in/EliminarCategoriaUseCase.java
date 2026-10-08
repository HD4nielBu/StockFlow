package com.stockflow.category.domain.port.in;

/** Port IN: eliminar una categoría que todavía no tiene productos (DELETE). */
public interface EliminarCategoriaUseCase {

    void eliminar(Long id);
}
