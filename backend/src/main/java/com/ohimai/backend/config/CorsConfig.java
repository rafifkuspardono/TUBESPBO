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

        // Izinkan semua origin frontend (termasuk localhost dan Vercel)
        config.setAllowedOriginPatterns(List.of("*"));

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
