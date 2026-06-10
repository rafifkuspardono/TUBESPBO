package com.ohimai.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Komponen untuk mengelola daftar API Key Gemini (Sistem Fallback).
 * Jika satu API key habis limitnya, sistem akan otomatis merotasi ke key berikutnya.
 */
@Component
public class GeminiApiKeyManager {

    private static final Logger logger = LoggerFactory.getLogger(GeminiApiKeyManager.class);

    @Value("${gemini.api.keys}")
    private String keysString;

    private List<String> apiKeys;
    private final AtomicInteger currentIndex = new AtomicInteger(0);

    @PostConstruct
    public void init() {
        if (keysString == null || keysString.isBlank()) {
            throw new IllegalArgumentException("gemini.api.keys tidak boleh kosong di application.properties");
        }
        
        // Pisahkan berdasarkan koma dan hilangkan whitespace
        this.apiKeys = Arrays.stream(keysString.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (apiKeys.isEmpty()) {
            throw new IllegalArgumentException("Tidak ada API key yang valid yang ditemukan di konfigurasi.");
        }
        
        logger.info("Berhasil memuat {} Gemini API Key.", apiKeys.size());
    }

    /**
     * Mengambil API key yang saat ini sedang aktif.
     * @return String API Key
     */
    public String getCurrentKey() {
        int index = currentIndex.get() % apiKeys.size();
        return apiKeys.get(index);
    }

    /**
     * Memutar (rotate) ke API key berikutnya di dalam list.
     * Dipanggil ketika key saat ini terkena Rate Limit (429).
     */
    public void rotateKey() {
        int oldIndex = currentIndex.get() % apiKeys.size();
        int newIndex = currentIndex.incrementAndGet() % apiKeys.size();
        
        logger.warn("Mengganti API Key! Key ke-{} terkena limit. Beralih ke Key ke-{}.", (oldIndex + 1), (newIndex + 1));
    }
    
    /**
     * Mengembalikan jumlah total key yang tersedia
     */
    public int getTotalKeys() {
        return apiKeys != null ? apiKeys.size() : 0;
    }
}
