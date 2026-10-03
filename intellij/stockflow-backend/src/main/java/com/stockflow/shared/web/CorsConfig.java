package com.stockflow.shared.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS: el navegador bloquea llamadas de http://localhost:5173 (React/Vite) a http://localhost:8080
 * porque son orígenes distintos. Postman no aplica CORS; por eso allí "funciona" sin esta clase.
 * Los orígenes permitidos se configuran por entorno; nunca se usa "*" con credenciales.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String[] origenesPermitidos;

    public CorsConfig(@Value("${stockflow.cors.allowed-origins}") String[] origenesPermitidos) {
        this.origenesPermitidos = origenesPermitidos;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(origenesPermitidos)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept")
                .exposedHeaders("Location")   // el frontend puede leer la URL del recurso creado (201)
                .maxAge(3600);
    }
}
