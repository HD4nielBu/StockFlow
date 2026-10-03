package com.stockflow.shared.web;

import com.stockflow.shared.domain.exception.ConflictoNegocioException;
import com.stockflow.shared.domain.exception.RecursoNoEncontradoException;
import com.stockflow.shared.domain.exception.ReglaNegocioException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Traduce excepciones a respuestas HTTP uniformes.
 * (Adelanto mínimo del Cap. 08 para que las pruebas 400/404/409 del Cap. 06-07 funcionen.)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> validacion(MethodArgumentNotValidException ex,
                                                       HttpServletRequest request) {
        Map<String, String> errores = new LinkedHashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            errores.putIfAbsent(fe.getField(), fe.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, "Datos de entrada inválidos", request, errores);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> jsonInvalido(HttpMessageNotReadableException ex,
                                                         HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST,
                "JSON mal formado o valor no permitido (revisa enums y números)", request, null);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse> tipoInvalido(MethodArgumentTypeMismatchException ex,
                                                         HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST,
                "El parámetro '" + ex.getName() + "' tiene un formato inválido", request, null);
    }

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ApiErrorResponse> noEncontrado(RecursoNoEncontradoException ex,
                                                         HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request, null);
    }

    @ExceptionHandler(ConflictoNegocioException.class)
    public ResponseEntity<ApiErrorResponse> conflicto(ConflictoNegocioException ex,
                                                      HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), request, null);
    }

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ApiErrorResponse> reglaNegocio(ReglaNegocioException ex,
                                                         HttpServletRequest request) {
        return build(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage(), request, null);
    }

    /** Última línea de defensa: la base de datos rechazó el dato (UNIQUE, FK, CHECK). */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> integridad(DataIntegrityViolationException ex,
                                                       HttpServletRequest request) {
        log.warn("Violación de integridad: {}", ex.getMostSpecificCause().getMessage());
        return build(HttpStatus.CONFLICT,
                "La operación viola una restricción de la base de datos", request, null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> inesperado(Exception ex, HttpServletRequest request) {
        // Errores propios de Spring MVC (ruta inexistente 404, método no permitido 405, etc.)
        // traen su propio status: no son errores internos.
        if (ex instanceof ErrorResponse errorSpring) {
            var status = HttpStatus.valueOf(errorSpring.getStatusCode().value());
            return build(status, errorSpring.getBody().getDetail(), request, null);
        }
        log.error("Error inesperado en {}", request.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", request, null);
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String message,
                                                   HttpServletRequest request,
                                                   Map<String, String> errores) {
        var body = ApiErrorResponse.of(status.value(), status.getReasonPhrase(), message,
                request.getRequestURI(), errores);
        return ResponseEntity.status(status).body(body);
    }
}
