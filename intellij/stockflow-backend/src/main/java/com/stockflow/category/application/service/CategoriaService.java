package com.stockflow.category.application.service;

import com.stockflow.category.domain.exception.CategoriaDuplicadaException;
import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.model.Categoria;
import com.stockflow.category.domain.port.in.ActualizarCategoriaUseCase;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.category.domain.port.in.EliminarCategoriaUseCase;
import com.stockflow.category.domain.port.in.RegistrarCategoriaUseCase;
import com.stockflow.category.domain.port.out.CategoriaRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService implements RegistrarCategoriaUseCase, ConsultarCategoriaUseCase,
        ActualizarCategoriaUseCase, EliminarCategoriaUseCase {

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
    @Transactional
    public Categoria actualizar(Long id, Categoria cambios) {
        // PUT no crea: si el id no existe es 404, nunca un INSERT
        if (repositoryPort.buscarPorId(id).isEmpty()) {
            throw new CategoriaNoEncontradaException(id);
        }
        if (repositoryPort.existePorCodigoEnOtra(cambios.getCodigo(), id)) {
            throw new CategoriaDuplicadaException(cambios.getCodigo());
        }
        if (repositoryPort.existePorNombreEnOtra(cambios.getNombre(), id)) {
            throw new CategoriaDuplicadaException(cambios.getNombre());
        }
        // La identidad sale de la ruta; el cuerpo sólo trae los campos editables
        return repositoryPort.actualizar(new Categoria(id, cambios.getCodigo(), cambios.getNombre(),
                cambios.getDescripcion(), cambios.isActivo()));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (repositoryPort.buscarPorId(id).isEmpty()) {
            throw new CategoriaNoEncontradaException(id);
        }
        // Si tiene productos, la FK fk_producto_categoria rechaza el DELETE (sin CASCADE)
        repositoryPort.eliminar(id);
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
