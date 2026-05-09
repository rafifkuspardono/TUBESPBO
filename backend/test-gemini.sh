#!/bin/bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=AIzaSyBEpZemMpU0NNfakwE_A9xYdwWxi4-JKGs" \
-H "Content-Type: application/json" \
-d '{
  "contents": [
    {
      "parts": [
        {
          "text": "Berikan minimal 1-3 searchEvidence yang VALID dan NYATA. Kamu HARUS menggunakan informasi dari pencarian internet (Google Search Tool) yang kamu miliki.\nJANGAN pernah mengarang atau berhalusinasi membuat URL atau judul berita palsu. Hanya gunakan referensi yang benar-benar kamu temukan dari hasil pencarian internet! JSON format: { \"searchEvidence\": [ { \"title\": \"...\", \"url\": \"...\" } ] }"
        }
      ]
    }
  ],
  "tools": [
    {
      "googleSearch": {}
    }
  ]
}'
