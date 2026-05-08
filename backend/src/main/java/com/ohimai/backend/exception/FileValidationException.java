package com.ohimai.backend.exception;

/**
 * Custom exception untuk error validasi file.
 * Dilempar ketika file upload tidak memenuhi syarat validasi
 * (file kosong, MIME type tidak didukung, atau ukuran melebihi batas).
 */
public class FileValidationException extends RuntimeException {

    private final String errorCode;

    public FileValidationException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
