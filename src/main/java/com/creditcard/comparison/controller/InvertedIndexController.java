package com.creditcard.comparison.controller;

import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creditcard.comparison.invertedindex.InvertedIndexService;

@RestController
@RequestMapping("/api/index")
@CrossOrigin
public class InvertedIndexController {

    private final InvertedIndexService service;

    public InvertedIndexController(InvertedIndexService service) {
        this.service = service;
    }

    // ADD DOCUMENT
    @GetMapping("/add")
    public String add(@RequestParam String id, @RequestParam String text) {
        service.addDocument(id, text);
        return "Document added!";
    }

    // SEARCH WORD
    @GetMapping("/search")
    public Set<String> search(@RequestParam String word) {
        return service.search(word);
    }
}