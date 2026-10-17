package com.stockflow.shared.web;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Datos de la documentación OpenAPI. springdoc genera la especificación leyendo los controllers:
 *   http://localhost:8080/swagger-ui.html  (interfaz para probar)
 *   http://localhost:8080/v3/api-docs      (especificación JSON)
 * Swagger UI es otro cliente HTTP, igual que Postman o requests.http: recorre el mismo camino
 * Controller -> caso de uso -> persistencia.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI stockFlowOpenApi() {
        return new OpenAPI().info(new Info()
                .title("StockFlow API (PA-06)")
                .version("0.1.0")
                .description("Inventario, solicitudes internas y movimientos de almacén. "
                        + "Errores con formato ApiErrorResponse: 400 validación, 404 no existe, "
                        + "409 conflicto, 422 regla de negocio, 500 error interno."));
    }
}
