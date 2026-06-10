package com.ohimai.backend.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO untuk menyimpan data bukti/referensi pembanding dari hasil analisis.
 * Setiap bukti berisi judul, URL, domain, dan cuplikan paragraf.
 */
public class SearchEvidence {

    @JsonProperty("title")
    private String title;

    @JsonProperty("searchQuery")
    private String searchQuery;

    @JsonProperty("snippet")
    private String snippet;


    // === Constructors ===

    public SearchEvidence() {
    }

    public SearchEvidence(String title, String searchQuery, String snippet) {
        this.title = title;
        this.searchQuery = searchQuery;
        this.snippet = snippet;
    }

    // === Getters & Setters ===

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSearchQuery() {
        return searchQuery;
    }

    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }

    @JsonProperty("url")
    public String getUrl() {
        if (searchQuery != null) {
            try {
                return "https://www.google.com/search?q=" + java.net.URLEncoder.encode(searchQuery, "UTF-8");
            } catch (Exception e) {
                return "https://www.google.com/search?q=" + searchQuery.replace(" ", "+");
            }
        }
        return null;
    }

    @JsonProperty("domain")
    public String getDomain() {
        return "Google Search";
    }

    public String getSnippet() {
        return snippet;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }

}
