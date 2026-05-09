package com.ohimai.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO untuk menyimpan data bukti/referensi pembanding dari hasil analisis.
 * Setiap bukti berisi judul, URL, domain, dan cuplikan paragraf.
 */
public class SearchEvidence {

    @JsonProperty("title")
    private String title;

    @JsonProperty("url")
    private String url;

    @JsonProperty("domain")
    private String domain;

    @JsonProperty("snippet")
    private String snippet;


    // === Constructors ===

    public SearchEvidence() {
    }

    public SearchEvidence(String title, String url, String domain, String snippet) {
        this.title = title;
        this.url = url;
        this.domain = domain;
        this.snippet = snippet;
    }

    // === Getters & Setters ===

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getSnippet() {
        return snippet;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }

}
