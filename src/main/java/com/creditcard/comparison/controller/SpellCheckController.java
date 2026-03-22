package com.creditcard.comparison.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creditcard.comparison.spellcheck.SpellCheckService;

@RestController
@RequestMapping("/api/spell")
@CrossOrigin("*")
public class SpellCheckController {

    private final SpellCheckService service;

    public SpellCheckController(SpellCheckService service) {
        this.service = service;
    }

    // ✅ API to check word
    @GetMapping("/check")
    public Map<String, Object> checkWord(@RequestParam String word) {

        Map<String, Object> response = new HashMap<>();

        boolean correct = service.isCorrect(word);

        response.put("word", word);
        response.put("correct", correct);

        if (!correct) {
            response.put("suggestions", service.getSuggestions(word));
        }

        return response;
    }
}