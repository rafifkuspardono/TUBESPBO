package com.ohimai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Konfigurasi CORS (Cross-Origin Resource Sharing).
 * Mengizinkan frontend (localhost:5173) untuk mengakses API backend.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Izinkan origin frontend (Vite dev server)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174"
        ));

        // Izinkan semua HTTP methods yang dibutuhkan
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Izinkan semua headers
        config.setAllowedHeaders(List.of("*"));

        // Izinkan credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // Cache preflight request selama 1 jam
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
