package com.creditcard.comparison.controller;


import com.creditcard.comparison.index.WordCompletionService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")   // VERY IMPORTANT
@CrossOrigin(origins = "*")
public class WordCompletionController {

    private final WordCompletionService service;

    public WordCompletionController(WordCompletionService service) {
        this.service = service;
    }

    // THIS matches your api.js
    @GetMapping("/complete")
    public List<String> complete(@RequestParam String prefix) {

        Map<String, Integer> result = service.autocomplete(prefix, 5);

        return new ArrayList<>(result.keySet());
    }
}