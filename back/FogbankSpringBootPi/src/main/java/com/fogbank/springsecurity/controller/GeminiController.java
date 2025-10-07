package com.fogbank.springsecurity.controller;

import com.fogbank.springsecurity.services.impl.GeminiServicee;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge=3600)

public class GeminiController {

    private final GeminiServicee geminiServicee;

    @PostMapping("/ask")
    public String askGeminiAPI(@RequestBody ChatRequest request) {
        return geminiServicee.askGemini(request.getPrompt());
    }

    // Request DTO class
    public static class ChatRequest {
        private String prompt;

        public String getPrompt() {
            return prompt;
        }

        public void setPrompt(String prompt) {
            this.prompt = prompt;
        }
    }
}
