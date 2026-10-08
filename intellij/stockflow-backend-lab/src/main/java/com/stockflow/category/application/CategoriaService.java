package com.stockflow.category.application;

import com.stockflow.category.domain.Categoria;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.exception.CodigoCategoriaDuplicadoException;
import com.stockflow.category.domain.port.CategoriaRepository;

import java.util.List;

/** Servicio Java puro: depende de la INTERFAZ, nunca de la implementación en memoria. */
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    public Categoria registrar(Categoria categoria) {
        if (repository.existePorCodigo(categoria.getCodigo())) {
            throw new CodigoCategoriaDuplicadoException(categoria.getCodigo());
        }
        return repository.guardar(categoria);
    }

    public Categoria obtener(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new CategoriaNoEncontradaException(id));
    }

    public List<Categoria> listar() {
        return repository.listarTodas();
    }
}
