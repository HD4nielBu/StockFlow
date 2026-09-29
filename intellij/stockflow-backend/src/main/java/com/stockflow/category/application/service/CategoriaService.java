package com.stockflow.category.application.service;

import com.stockflow.category.domain.exception.CategoriaDuplicadaException;
import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.category.domain.port.in.RegistrarCategoriaUseCase;
import com.stockflow.category.domain.port.out.CategoriaRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService implements RegistrarCategoriaUseCase, ConsultarCategoriaUseCase {

    private final CategoriaRepositoryPort repositoryPort;

    public CategoriaService(CategoriaRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    @Transactional
    public Categoria registrar(Categoria categoria) {
        // Respeta uq_categoria_codigo y uq_categoria_nombre antes de llegar a la base
        if (repositoryPort.existePorCodigo(categoria.getCodigo())) {
            throw new CategoriaDuplicadaException(categoria.getCodigo());
        }
        if (repositoryPort.existePorNombre(categoria.getNombre())) {
            throw new CategoriaDuplicadaException(categoria.getNombre());
        }
        return repositoryPort.guardar(categoria);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> listar(String nombre) {
        return repositoryPort.listar(nombre);
    }
}
