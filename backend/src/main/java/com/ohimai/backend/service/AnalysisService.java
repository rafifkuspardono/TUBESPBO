package com.ohimai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohimai.backend.dto.AnalysisResponse;
import com.ohimai.backend.dto.SearchEvidence;
import com.ohimai.backend.exception.FileValidationException;
import com.ohimai.backend.exception.GeminiApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Service utama yang menangani seluruh business logic analisis gambar berita.
 * Meliputi validasi file, penyusunan prompt, pemanggilan Gemini API,
 * dan normalisasi respons JSON.
 */
@Service
public class AnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AnalysisService.class);

    /** Ukuran maksimal file: 5MB dalam bytes */
    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    /** MIME types yang diizinkan */
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/jpg",
            "image/png"
    );

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final GeminiApiKeyManager apiKeyManager;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    public AnalysisService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper, GeminiApiKeyManager apiKeyManager) {
        // Fix untuk error "Failed to resolve": Memaksa Netty menggunakan system DNS resolver
        reactor.netty.http.client.HttpClient httpClient = reactor.netty.http.client.HttpClient.create()
                .resolver(io.netty.resolver.DefaultAddressResolverGroup.INSTANCE);

        this.webClient = webClientBuilder
                .clientConnector(new org.springframework.http.client.reactive.ReactorClientHttpConnector(httpClient))
                .build();
        this.objectMapper = objectMapper;
        this.apiKeyManager = apiKeyManager;
    }

    // =========================================================================
    //  PUBLIC METHOD — Entry point yang dipanggil oleh Controller
    // =========================================================================

    /**
     * Memproses file gambar yang diunggah: validasi → encode → panggil Gemini → parse respons.
     *
     * @param file File gambar dari request multipart
     * @return AnalysisResponse DTO berisi hasil analisis
     */
    public AnalysisResponse analyzeImage(MultipartFile file) {
        // Langkah 1: Validasi file
        validateFile_103012400206(file);

        // Langkah 2: Panggil Gemini API
        String rawJson = callGeminiAPI_103012400206(file);

        // Langkah 3: Parse respons menjadi DTO
        return parseGeminiResponse(rawJson);
    }

    // =========================================================================
    //  A. VALIDASI FILE (sesuai PRD section 4.A)
    // =========================================================================

    /**
     * Memvalidasi file yang diunggah sebelum diproses.
     * Pengecekan meliputi:
     * - File tidak boleh kosong (null atau size 0)
     * - MIME type hanya image/jpeg, image/jpg, image/png
     * - Ukuran maksimal 5MB
     *
     * @param file File yang akan divalidasi
     * @throws FileValidationException jika validasi gagal
     */
    public void validateFile_103012400206(MultipartFile file) {
        // Cek file kosong (null atau size 0)
        if (file == null || file.isEmpty() || file.getSize() == 0) {
            throw new FileValidationException(
                    "VALIDATION_FAILED",
                    "File tidak boleh kosong. Silakan unggah file gambar."
            );
        }

        // Cek MIME type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new FileValidationException(
                    "VALIDATION_FAILED",
                    "Tipe file tidak didukung. Hanya file JPG, JPEG, dan PNG yang diizinkan. "
                            + "Tipe yang diterima: " + (contentType != null ? contentType : "tidak diketahui")
            );
        }

        // Cek ukuran file (maks 5MB)
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileValidationException(
                    "FILE_TOO_LARGE",
                    "Ukuran file melebihi batas 5MB. Ukuran file Anda: "
                            + String.format("%.2f MB", file.getSize() / (1024.0 * 1024.0))
            );
        }

        logger.info("File validation passed: name={}, type={}, size={} bytes",
                file.getOriginalFilename(), contentType, file.getSize());
    }

    // =========================================================================
    //  B. PEMROSESAN PROMPT (sesuai PRD section 4.B)
    // =========================================================================

    /**
     * Menyusun instruksi prompt yang kaku untuk Gemini AI.
     * Prompt memaksa AI untuk:
     * - Hanya menjawab dalam format JSON murni
     * - Mengekstrak tanggal dan nama sumber media dari gambar
     * - Menentukan status verifikasi dan risk level
     * - Menyediakan array searchEvidence sebagai bukti pembanding
     *
     * @return String prompt yang siap dikirim ke Gemini
     */
    public String generatePrompt_103012400206() {
        return """
                Kamu adalah sistem verifikasi berita profesional. Analisis gambar screenshot berita berikut dengan sangat teliti.

                INSTRUKSI KAKU — WAJIB DIPATUHI:
                1. Jawab HANYA dalam format JSON murni. JANGAN tambahkan teks apapun di luar JSON.
                2. JANGAN gunakan markdown code block (```). Langsung tulis JSON-nya.
                3. Ekstrak semua informasi yang terlihat dari gambar screenshot berita.
                4. Lakukan analisis dan verifikasi terhadap klaim utama dalam berita tersebut.
                5. JANGAN mengarang atau membuat-buat URL/link artikel. Sebagai gantinya, berikan "searchQuery" berupa kata kunci pencarian yang relevan.

                FORMAT JSON YANG WAJIB DIKEMBALIKAN (ikuti struktur ini PERSIS):
                {
                  "headline": "Judul berita utama yang terlihat di gambar",
                  "sourceNameInImage": "Nama media/sumber yang terlihat di gambar (misal: CNN, Kompas, dll). Tulis 'Tidak terdeteksi' jika tidak terlihat.",
                  "dateInImage": "Tanggal yang terlihat di gambar. Tulis 'Tidak terdeteksi' jika tidak terlihat.",
                  "mainTextExcerpt": "Kutipan singkat isi berita utama dari gambar (maksimal 2-3 kalimat)",
                  "mainClaim": "Klaim inti/utama yang sedang diuji kebenarannya",
                  "detectedLanguage": "Kode bahasa yang terdeteksi: 'id' untuk Indonesia, 'en' untuk English, dll",
                  "verificationStatus": "Salah satu dari: MATCHED | PARTIALLY_MATCHED | NOT_MATCHED | INSUFFICIENT_EVIDENCE",
                  "riskLevel": "Salah satu dari: LOW | MEDIUM | HIGH | UNKNOWN",
                  "reasoningSummary": "Penjelasan singkat dan jelas tentang proses analisis dan alasan di balik keputusan verifikasi (2-4 kalimat)",
                  "finalVerdict": "Salah satu dari: KEMUNGKINAN_SESUAI | KEMUNGKINAN_TIDAK_SESUAI | BUKTI_TIDAK_CUKUP",
                  "searchEvidence": [
                    {
                      "searchQuery": "kata kunci pencarian",
                      "snippet": "Cuplikan singkat dari sumber referensi yang relevan"
                    }
                  ]
                }

                PANDUAN PENILAIAN:
                - MATCHED + LOW risk = Berita terverifikasi sesuai fakta
                - PARTIALLY_MATCHED + MEDIUM risk = Ada bagian yang sesuai, ada yang belum bisa diverifikasi
                - NOT_MATCHED + HIGH risk = Berita tidak sesuai fakta / berpotensi hoaks
                - INSUFFICIENT_EVIDENCE + UNKNOWN risk = Tidak cukup data untuk memverifikasi

                Berikan minimal 1-3 searchEvidence yang VALID dan NYATA. Kamu HARUS menggunakan informasi dari pencarian internet (Google Search Tool) yang kamu miliki.
                JANGAN pernah mengarang atau berhalusinasi membuat URL atau judul berita palsu. Hanya gunakan referensi yang benar-benar kamu temukan dari hasil pencarian internet!

                PENTING: Respons-mu HARUS berupa JSON valid. Tidak boleh ada teks tambahan sebelum atau sesudah JSON.
                """;
    }

    // =========================================================================
    //  C. KOMUNIKASI DENGAN GEMINI API (sesuai PRD section 4.C)
    // =========================================================================

    /**
     * Mengubah gambar menjadi Base64 string dan mengirimkannya bersama
     * teks instruksi ke endpoint Google Gemini API.
     *
     * @param file File gambar yang akan dianalisis
     * @return String respons mentah (raw JSON) dari Gemini
     * @throws GeminiApiException jika terjadi error saat memanggil API
     */
    private String callGeminiAPI_103012400206(MultipartFile file) {
        try {
            // Langkah A: Kompres Gambar agar tidak kena limit TPM
            logger.info("Compressing image to reduce token usage...");
            java.io.ByteArrayOutputStream outputStream = new java.io.ByteArrayOutputStream();
            net.coobird.thumbnailator.Thumbnails.of(file.getInputStream())
                    .size(1024, 1024)
                    .outputFormat("jpg")
                    .outputQuality(0.75)
                    .toOutputStream(outputStream);

            byte[] compressedBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(compressedBytes);
            String mimeType = "image/jpeg";

            logger.info("Image compressed: original_size={}KB, compressed_size={}KB",
                    file.getSize() / 1024, compressedBytes.length / 1024);

            String promptText = generatePrompt_103012400206();
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", promptText),
                                    Map.of("inlineData", Map.of(
                                            "mimeType", mimeType,
                                            "data", base64Image
                                    ))
                            ))
                    ),
                    "tools", List.of(
                            Map.of("googleSearch", Map.of())
                    ),
                    "generationConfig", Map.of(
                            "temperature", 0.1,
                            "maxOutputTokens", 8192
                    )
            );

            logger.info("Calling Gemini API: {}", geminiApiUrl);

            // Coba sebanyak jumlah API key yang tersedia
            int maxRetries = apiKeyManager.getTotalKeys();

            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    String currentKey = apiKeyManager.getCurrentKey();
                    String fullUrl = geminiApiUrl + "?key=" + currentKey;
                    logger.info("Attempt {}/{} calling Gemini API dengan Key...", attempt, maxRetries);

                    String response = webClient.post()
                            .uri(fullUrl)
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(requestBody)
                            .retrieve()
                            .onStatus(
                                status -> status.value() == 429 || status.value() == 503,
                                clientResponse -> clientResponse.bodyToMono(String.class)
                                    .flatMap(body -> reactor.core.publisher.Mono.error(
                                        new GeminiApiException("RATE_LIMIT", "HTTP " + clientResponse.statusCode() + ": " + body)
                                    ))
                            )
                            .onStatus(
                                status -> status.is4xxClientError() || status.is5xxServerError(),
                                clientResponse -> clientResponse.bodyToMono(String.class)
                                    .flatMap(body -> reactor.core.publisher.Mono.error(
                                        new GeminiApiException("API_ERROR", "HTTP " + clientResponse.statusCode() + ": " + body)
                                    ))
                            )
                            .bodyToMono(String.class)
                            .block();

                    logger.info("Gemini API response received on attempt {}", attempt);
                    return response;

                } catch (GeminiApiException e) {
                    if (e.getErrorCode().equals("RATE_LIMIT") && attempt < maxRetries) {
                        logger.warn("Rate limit hit pada percobaan ke-{}. Merotasi API Key...", attempt);
                        apiKeyManager.rotateKey();
                        // Tunggu sebentar (1 detik) sebelum retry dengan key baru
                        Thread.sleep(1000L);
                    } else {
                        throw e; // Lempar jika bukan 429 atau sudah habis retry
                    }
                }
            }

            throw new GeminiApiException("RATE_LIMIT", "Gemini API masih menolak request setelah " + maxRetries + " percobaan. Coba lagi dalam beberapa menit.");

        } catch (IOException e) {
            throw new GeminiApiException("FILE_READ_ERROR", "Gagal membaca file gambar: " + e.getMessage(), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new GeminiApiException("INTERRUPTED", "Request dibatalkan saat menunggu retry.", e);
        } catch (Exception e) {
            if (e instanceof GeminiApiException) throw (GeminiApiException) e;
            throw new GeminiApiException("GEMINI_API_ERROR", "Gagal berkomunikasi dengan Gemini API: " + e.getMessage(), e);
        }
    }

    // =========================================================================
    //  D. NORMALISASI RESPONS (sesuai PRD section 4.D)
    // =========================================================================

    /**
     * Mem-parsing respons mentah dari Gemini API ke dalam AnalysisResponse DTO.
     * Mengekstrak teks JSON dari struktur respons Gemini dan men-deserialize-nya.
     *
     * @param rawResponse Respons mentah dari Gemini API
     * @return AnalysisResponse DTO yang sudah dinormalisasi
     * @throws GeminiApiException jika parsing gagal
     */
    private AnalysisResponse parseGeminiResponse(String rawResponse) {
        try {
            if (rawResponse == null || rawResponse.isBlank()) {
                throw new GeminiApiException(
                        "EMPTY_RESPONSE",
                        "Gemini API mengembalikan respons kosong."
                );
            }

            // Parse struktur respons Gemini untuk mengambil teks dari candidates[0].content.parts[0].text
            JsonNode rootNode = objectMapper.readTree(rawResponse);
            JsonNode candidatesNode = rootNode.path("candidates");

            if (candidatesNode.isMissingNode() || !candidatesNode.isArray() || candidatesNode.isEmpty()) {
                throw new GeminiApiException(
                        "INVALID_RESPONSE",
                        "Respons Gemini tidak mengandung candidates yang valid."
                );
            }

            JsonNode firstCandidate = candidatesNode.get(0);
            String finishReason = firstCandidate.path("finishReason").asText("");
            
            JsonNode partsNode = firstCandidate.path("content").path("parts");
            
            if (partsNode.isMissingNode() || !partsNode.isArray() || partsNode.isEmpty() || partsNode.get(0) == null) {
                logger.error("Raw Gemini Response: {}", rawResponse);
                if ("SAFETY".equals(finishReason)) {
                    throw new GeminiApiException(
                            "SAFETY_VIOLATION",
                            "Analisis ditolak oleh sistem keamanan (Safety filter). Gambar atau teks mungkin mengandung unsur yang tidak diizinkan."
                    );
                }
                throw new GeminiApiException(
                        "INVALID_RESPONSE",
                        "Respons Gemini tidak mengandung teks. Finish reason: '" + finishReason + "'. Raw Response: " + rawResponse
                );
            }

            String textContent = partsNode.get(0).path("text").asText();

            if (textContent == null || textContent.isBlank()) {
                throw new GeminiApiException(
                        "EMPTY_CONTENT",
                        "Gemini mengembalikan teks kosong. Finish reason: '" + finishReason + "'. Raw Response: " + rawResponse
                );
            }

            // Bersihkan markdown code block jika ada (```json ... ```)
            String cleanedJson = cleanJsonResponse(textContent);
            logger.debug("Cleaned JSON from Gemini: {}", cleanedJson);

            // Deserialize JSON menjadi AnalysisResponse DTO
            return objectMapper.readValue(cleanedJson, AnalysisResponse.class);

        } catch (GeminiApiException e) {
            throw e;
        } catch (Exception e) {
            throw new GeminiApiException(
                    "PARSE_ERROR",
                    "Gagal mem-parsing respons dari Gemini API: " + e.getMessage(),
                    e
            );
        }
    }

    /**

     * Membersihkan respons teks dari Gemini yang mungkin mengandung
     * markdown code block (```json ... ```) atau karakter lain.
     *
     * @param rawText Teks mentah dari Gemini
     * @return String JSON yang sudah dibersihkan
     */
    private String cleanJsonResponse(String rawText) {
        String cleaned = rawText.trim();

        // Hapus markdown code block jika ada
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }

        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }

        return cleaned.trim();
    }
}
