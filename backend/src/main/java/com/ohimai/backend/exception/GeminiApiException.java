package com.ohimai.backend.exception;

/**
 * Custom exception untuk error saat berkomunikasi dengan Gemini API.
 * Dilempar ketika panggilan ke Google Gemini API gagal atau respons tidak valid.
 */
public class GeminiApiException extends RuntimeException {

    private final String errorCode;

    public GeminiApiException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public GeminiApiException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
