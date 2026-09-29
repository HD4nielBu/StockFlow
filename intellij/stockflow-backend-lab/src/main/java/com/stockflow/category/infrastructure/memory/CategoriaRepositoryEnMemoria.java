package com.stockflow.category.infrastructure.memory;

import com.stockflow.category.domain.Categoria;
import com.stockflow.category.domain.port.CategoriaRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Implementación en memoria. Usa Map porque la operación más frecuente es
 * buscar por id (clave -> valor), igual que una PK. LinkedHashMap conserva
 * el orden de inserción para listar.
 */
public class CategoriaRepositoryEnMemoria implements CategoriaRepository {

    private final Map<Long, Categoria> datos = new LinkedHashMap<>();

    @Override
    public Categoria guardar(Categoria categoria) {
        datos.put(categoria.getId(), categoria);
        return categoria;
    }

    @Override
    public Optional<Categoria> buscarPorId(Long id) {
        return Optional.ofNullable(datos.get(id));
    }

    @Override
    public List<Categoria> listarTodas() {
        return new ArrayList<>(datos.values());
    }

    @Override
    public boolean existePorCodigo(String codigo) {
        return datos.values().stream()
                .anyMatch(c -> c.getCodigo().equalsIgnoreCase(codigo));
    }
}
