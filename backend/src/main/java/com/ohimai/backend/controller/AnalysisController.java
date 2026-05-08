package com.ohimai.backend.controller;

import com.ohimai.backend.dto.AnalysisResponse;
import com.ohimai.backend.service.AnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller untuk endpoint analisis gambar berita.
 * Menerima file gambar via multipart/form-data dan mengembalikan
 * hasil analisis dalam format JSON.
 *
 * Endpoint: POST /api/v1/analysis/upload
 */
@RestController
@RequestMapping("/api/v1/analysis")
public class AnalysisController {

    private static final Logger logger = LoggerFactory.getLogger(AnalysisController.class);

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    /**
     * Endpoint utama untuk menerima upload gambar screenshot berita
     * dan mengembalikan hasil analisis verifikasi.
     *
     * @param file File gambar dari request multipart/form-data
     * @return ResponseEntity berisi AnalysisResponse (JSON)
     */
    @PostMapping("/upload")
    public ResponseEntity<AnalysisResponse> uploadAndAnalyze(
            @RequestParam("file") MultipartFile file) {

        logger.info("Received upload request: filename={}, size={} bytes, type={}",
                file.getOriginalFilename(), file.getSize(), file.getContentType());

        // Delegasikan seluruh proses ke service layer
        AnalysisResponse result = analysisService.analyzeImage(file);

        logger.info("Analysis completed successfully for file: {}", file.getOriginalFilename());

        return ResponseEntity.ok(result);
    }

    /**
     * Health check endpoint untuk memastikan API berjalan.
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("{\"status\":\"UP\",\"service\":\"OHIM AI Backend\"}");
    }
}
