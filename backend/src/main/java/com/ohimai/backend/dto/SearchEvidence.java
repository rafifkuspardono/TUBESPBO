package com.ohimai.backend.dto;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnore;
=======
>>>>>>> 399dbd0f6060f8863f6901d045dcd799793c3407
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO untuk menyimpan data bukti/referensi pembanding dari hasil analisis.
<<<<<<< HEAD
 * Setiap bukti berisi judul, URL Google Search (bukan halusinasi AI), domain, dan cuplikan.
 *
 * Flow:
 * 1. Gemini mengembalikan "searchQuery" (kata kunci pencarian).
 * 2. Backend mengonversi searchQuery menjadi URL Google Search yang valid.
 * 3. Frontend menerima url (Google Search) dan domain (google.com).
=======
 * Setiap bukti berisi judul, URL, domain, dan cuplikan paragraf.
>>>>>>> 399dbd0f6060f8863f6901d045dcd799793c3407
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

<<<<<<< HEAD
    /**
     * Field ini hanya digunakan saat parsing respons Gemini (write-only).
     * Gemini mengisi "searchQuery" dan backend mengubahnya menjadi Google Search URL.
     * Field ini tidak akan muncul di respons API ke frontend.
     */
    @JsonIgnore
    private String searchQuery;

=======
>>>>>>> 399dbd0f6060f8863f6901d045dcd799793c3407
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
<<<<<<< HEAD

    // searchQuery: diisi Gemini, diproses backend, tidak dikirim ke frontend
    @JsonProperty("searchQuery")
    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }

    @JsonIgnore
    public String getSearchQuery() {
        return searchQuery;
    }
=======
>>>>>>> 399dbd0f6060f8863f6901d045dcd799793c3407
}
