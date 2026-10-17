package com.stockflow.location.infrastructure.adapter.in.web;

import com.stockflow.location.domain.exception.UbicacionNoEncontradaException;
import com.stockflow.location.domain.model.TipoUbicacion;
import com.stockflow.location.domain.port.in.ConsultarUbicacionUseCase;
import com.stockflow.location.domain.port.in.RegistrarUbicacionUseCase;
import com.stockflow.location.infrastructure.adapter.in.web.dto.CrearUbicacionRequest;
import com.stockflow.location.infrastructure.adapter.in.web.dto.UbicacionResponse;
import com.stockflow.location.infrastructure.adapter.in.web.mapper.UbicacionWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/** Adapter IN del módulo location: depende de los Ports IN, nunca del JpaRepository. */
@RestController
@RequestMapping("/api/ubicaciones")
public class UbicacionController {

    private final RegistrarUbicacionUseCase registrar;
    private final ConsultarUbicacionUseCase consultar;

    public UbicacionController(RegistrarUbicacionUseCase registrar, ConsultarUbicacionUseCase consultar) {
        this.registrar = registrar;
        this.consultar = consultar;
    }

    /** 201 / 400 / 409 (código repetido o segundo almacén central). */
    @PostMapping
    public ResponseEntity<UbicacionResponse> crear(@Valid @RequestBody CrearUbicacionRequest request) {
        var creada = registrar.registrar(UbicacionWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creada.getId()).toUri();
        return ResponseEntity.created(location).body(UbicacionWebMapper.toResponse(creada));
    }

    /** Filtro opcional por tipo: ?tipo=DEPOSITO. Un tipo inexistente produce 400. */
    @GetMapping
    public List<UbicacionResponse> listar(@RequestParam(required = false) TipoUbicacion tipo) {
        return consultar.listar(tipo).stream()
                .map(UbicacionWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UbicacionResponse> buscarPorId(@PathVariable Long id) {
        var ubicacion = consultar.buscarPorId(id)
                .orElseThrow(() -> new UbicacionNoEncontradaException(id));
        return ResponseEntity.ok(UbicacionWebMapper.toResponse(ubicacion));
    }
}
