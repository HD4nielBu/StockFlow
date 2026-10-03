package com.stockflow.category.infrastructure.adapter.in.web;

import com.stockflow.category.domain.exception.CategoriaNoEncontradaException;
import com.stockflow.category.domain.port.in.ActualizarCategoriaUseCase;
import com.stockflow.category.domain.port.in.ConsultarCategoriaUseCase;
import com.stockflow.category.domain.port.in.EliminarCategoriaUseCase;
import com.stockflow.category.domain.port.in.RegistrarCategoriaUseCase;
import com.stockflow.category.infrastructure.adapter.in.web.dto.ActualizarCategoriaRequest;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CategoriaResponse;
import com.stockflow.category.infrastructure.adapter.in.web.dto.CrearCategoriaRequest;
import com.stockflow.category.infrastructure.adapter.in.web.mapper.CategoriaWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/** Adapter IN: depende de los Ports IN, nunca del JpaRepository. */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final RegistrarCategoriaUseCase registrar;
    private final ConsultarCategoriaUseCase consultar;
    private final ActualizarCategoriaUseCase actualizar;
    private final EliminarCategoriaUseCase eliminar;

    public CategoriaController(RegistrarCategoriaUseCase registrar, ConsultarCategoriaUseCase consultar,
                               ActualizarCategoriaUseCase actualizar, EliminarCategoriaUseCase eliminar) {
        this.registrar = registrar;
        this.consultar = consultar;
        this.actualizar = actualizar;
        this.eliminar = eliminar;
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> crear(@Valid @RequestBody CrearCategoriaRequest request) {
        var creada = registrar.registrar(CategoriaWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creada.getId()).toUri();
        return ResponseEntity.created(location).body(CategoriaWebMapper.toResponse(creada));
    }

    @GetMapping
    public List<CategoriaResponse> listar(@RequestParam(required = false) String nombre) {
        return consultar.listar(nombre).stream()
                .map(CategoriaWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponse> buscarPorId(@PathVariable Long id) {
        var categoria = consultar.buscarPorId(id)
                .orElseThrow(() -> new CategoriaNoEncontradaException(id));
        return ResponseEntity.ok(CategoriaWebMapper.toResponse(categoria));
    }

    /** PUT idempotente: repetir la misma petición deja el mismo estado. 200 / 400 / 404 / 409. */
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable Long id,
                                                        @Valid @RequestBody ActualizarCategoriaRequest request) {
        var actualizada = actualizar.actualizar(id, CategoriaWebMapper.toDomain(request));
        return ResponseEntity.ok(CategoriaWebMapper.toResponse(actualizada));
    }

    /** 204 sin cuerpo; 404 si no existe; 409 si tiene productos (FK sin CASCADE). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eliminar.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
