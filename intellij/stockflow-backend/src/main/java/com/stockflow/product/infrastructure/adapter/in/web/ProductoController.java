package com.stockflow.product.infrastructure.adapter.in.web;

import com.stockflow.product.domain.exception.ProductoNoEncontradoException;
import com.stockflow.product.domain.port.in.ActualizarProductoUseCase;
import com.stockflow.product.domain.port.in.ConsultarProductoUseCase;
import com.stockflow.product.domain.port.in.EliminarProductoUseCase;
import com.stockflow.product.domain.port.in.RegistrarProductoUseCase;
import com.stockflow.product.infrastructure.adapter.in.web.dto.ActualizarProductoRequest;
import com.stockflow.product.infrastructure.adapter.in.web.dto.CrearProductoRequest;
import com.stockflow.product.infrastructure.adapter.in.web.dto.ProductoResponse;
import com.stockflow.product.infrastructure.adapter.in.web.mapper.ProductoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final RegistrarProductoUseCase registrar;
    private final ConsultarProductoUseCase consultar;
    private final ActualizarProductoUseCase actualizar;
    private final EliminarProductoUseCase eliminar;

    public ProductoController(RegistrarProductoUseCase registrar,
                              ConsultarProductoUseCase consultar,
                              ActualizarProductoUseCase actualizar,
                              EliminarProductoUseCase eliminar) {
        this.registrar = registrar;
        this.consultar = consultar;
        this.actualizar = actualizar;
        this.eliminar = eliminar;
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody CrearProductoRequest request) {
        var creado = registrar.registrar(ProductoWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.getId()).toUri();
        return ResponseEntity.created(location).body(ProductoWebMapper.toResponse(creado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> buscarPorId(@PathVariable Long id) {
        var producto = consultar.buscarPorId(id)
                .orElseThrow(() -> new ProductoNoEncontradoException(id));
        return ResponseEntity.ok(ProductoWebMapper.toResponse(producto));
    }

    /** Listado completo del catálogo, ordenado por código. 200 (lista vacía si no hay productos). */
    @GetMapping
    public List<ProductoResponse> listar() {
        return consultar.listarTodos().stream()
                .map(ProductoWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoResponse> listarPorCategoria(@PathVariable Long categoriaId) {
        return consultar.listarPorCategoria(categoriaId).stream()
                .map(ProductoWebMapper::toResponse)
                .toList();
    }

    /** PUT idempotente: 200 / 400 / 404 (producto o categoría) / 409 (código) / 422 (categoría inactiva). */
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long id,
                                                       @Valid @RequestBody ActualizarProductoRequest request) {
        var actualizado = actualizar.actualizar(id, ProductoWebMapper.toDomain(request));
        return ResponseEntity.ok(ProductoWebMapper.toResponse(actualizado));
    }

    /** 204 sin cuerpo; 404 si no existe; 409 si ya tiene stock o movimientos. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eliminar.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
