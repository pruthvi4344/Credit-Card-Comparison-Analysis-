package com.creditcard.comparison.controller;

import com.creditcard.comparison.exception.BadRequestException;
import com.creditcard.comparison.spellcheck.SpellCheckService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
public class SpellCheckController {

    private final SpellCheckService service;

    public SpellCheckController(SpellCheckService service) {
        this.service = service;
    }

    @GetMapping({"/api/spell/check", "/api/spellcheck"})
    public Map<String, Object> checkWord(@RequestParam String word) {
        if (word == null || word.trim().isEmpty()) {
            throw new BadRequestException("Word is required.");
        }

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
