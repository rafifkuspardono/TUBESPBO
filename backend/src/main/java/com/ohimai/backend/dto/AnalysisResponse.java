package com.ohimai.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Data Transfer Object (DTO) untuk respons hasil analisis gambar berita.
 * Struktur ini sesuai dengan format yang diharapkan oleh frontend React.
 *
 * Contoh JSON:
 * {
 *   "headline": "Teks Judul Berita Utama",
 *   "sourceNameInImage": "Nama Media",
 *   "dateInImage": "Tanggal jika ada",
 *   "mainTextExcerpt": "Kutipan isi",
 *   "mainClaim": "Klaim inti yang diuji",
 *   "detectedLanguage": "id/en",
 *   "verificationStatus": "MATCHED | PARTIALLY_MATCHED | NOT_MATCHED | INSUFFICIENT_EVIDENCE",
 *   "riskLevel": "LOW | MEDIUM | HIGH | UNKNOWN",
 *   "reasoningSummary": "Penjelasan singkat hasil analisis...",
 *   "finalVerdict": "KEMUNGKINAN_SESUAI | KEMUNGKINAN_TIDAK_SESUAI | BUKTI_TIDAK_CUKUP",
 *   "searchEvidence": [...]
 * }
 */
public class AnalysisResponse {

    @JsonProperty("headline")
    private String headline;

    @JsonProperty("sourceNameInImage")
    private String sourceNameInImage;

    @JsonProperty("dateInImage")
    private String dateInImage;

    @JsonProperty("mainTextExcerpt")
    private String mainTextExcerpt;

    @JsonProperty("mainClaim")
    private String mainClaim;

    @JsonProperty("detectedLanguage")
    private String detectedLanguage;

    @JsonProperty("verificationStatus")
    private String verificationStatus;

    @JsonProperty("riskLevel")
    private String riskLevel;

    @JsonProperty("reasoningSummary")
    private String reasoningSummary;

    @JsonProperty("finalVerdict")
    private String finalVerdict;

    @JsonProperty("searchEvidence")
    private List<SearchEvidence> searchEvidence;

    // === Constructors ===

    public AnalysisResponse() {
    }

    public AnalysisResponse(String headline, String sourceNameInImage, String dateInImage,
                            String mainTextExcerpt, String mainClaim, String detectedLanguage,
                            String verificationStatus, String riskLevel, String reasoningSummary,
                            String finalVerdict, List<SearchEvidence> searchEvidence) {
        this.headline = headline;
        this.sourceNameInImage = sourceNameInImage;
        this.dateInImage = dateInImage;
        this.mainTextExcerpt = mainTextExcerpt;
        this.mainClaim = mainClaim;
        this.detectedLanguage = detectedLanguage;
        this.verificationStatus = verificationStatus;
        this.riskLevel = riskLevel;
        this.reasoningSummary = reasoningSummary;
        this.finalVerdict = finalVerdict;
        this.searchEvidence = searchEvidence;
    }

    // === Getters & Setters ===

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getSourceNameInImage() {
        return sourceNameInImage;
    }

    public void setSourceNameInImage(String sourceNameInImage) {
        this.sourceNameInImage = sourceNameInImage;
    }

    public String getDateInImage() {
        return dateInImage;
    }

    public void setDateInImage(String dateInImage) {
        this.dateInImage = dateInImage;
    }

    public String getMainTextExcerpt() {
        return mainTextExcerpt;
    }

    public void setMainTextExcerpt(String mainTextExcerpt) {
        this.mainTextExcerpt = mainTextExcerpt;
    }

    public String getMainClaim() {
        return mainClaim;
    }

    public void setMainClaim(String mainClaim) {
        this.mainClaim = mainClaim;
    }

    public String getDetectedLanguage() {
        return detectedLanguage;
    }

    public void setDetectedLanguage(String detectedLanguage) {
        this.detectedLanguage = detectedLanguage;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getReasoningSummary() {
        return reasoningSummary;
    }

    public void setReasoningSummary(String reasoningSummary) {
        this.reasoningSummary = reasoningSummary;
    }

    public String getFinalVerdict() {
        return finalVerdict;
    }

    public void setFinalVerdict(String finalVerdict) {
        this.finalVerdict = finalVerdict;
    }

    public List<SearchEvidence> getSearchEvidence() {
        return searchEvidence;
    }

    public void setSearchEvidence(List<SearchEvidence> searchEvidence) {
<<<<<<< HEAD
        // Pastikan list selalu mutable agar bisa dimodifikasi di post-processing
        this.searchEvidence = searchEvidence != null ? new java.util.ArrayList<>(searchEvidence) : new java.util.ArrayList<>();
=======
        this.searchEvidence = searchEvidence;
>>>>>>> 399dbd0f6060f8863f6901d045dcd799793c3407
    }
}
