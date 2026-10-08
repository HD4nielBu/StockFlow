package com.stockflow.shared.web;

import java.time.Instant;
import java.util.Map;

/** Formato único de error para toda la API. */
public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
    public static ApiErrorResponse of(int status, String error, String message,
                                      String path, Map<String, String> fieldErrors) {
        return new ApiErrorResponse(Instant.now(), status, error, message, path,
                fieldErrors == null ? Map.of() : fieldErrors);
    }
}
