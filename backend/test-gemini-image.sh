#!/bin/bash
# Create a dummy 1x1 black JPEG image
echo -n -e '\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\'\ ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xd2\x8a\x28\xa0\x0f\xff\xd9' > dummy.jpg
B64=$(base64 -i dummy.jpg | tr -d '\n')
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=AIzaSyBEpZemMpU0NNfakwE_A9xYdwWxi4-JKGs" \
-H "Content-Type: application/json" \
-d "{
  \"contents\": [
    {
      \"parts\": [
        {
          \"text\": \"Berikan minimal 1-3 searchEvidence yang VALID dan NYATA. Kamu HARUS menggunakan informasi dari pencarian internet (Google Search Tool) yang kamu miliki.\\nJANGAN pernah mengarang atau berhalusinasi membuat URL atau judul berita palsu. Hanya gunakan referensi yang benar-benar kamu temukan dari hasil pencarian internet! JSON format: { \\\"searchEvidence\\\": [ { \\\"title\\\": \\\"...\\\", \\\"url\\\": \\\"...\\\" } ] }\"
        },
        {
          \"inlineData\": {
            \"mimeType\": \"image/jpeg\",
            \"data\": \"$B64\"
          }
        }
      ]
    }
  ],
  \"tools\": [
    {
      \"googleSearch\": {}
    }
  ],
  \"generationConfig\": {
    \"temperature\": 0.1,
    \"maxOutputTokens\": 2048
  }
}"
