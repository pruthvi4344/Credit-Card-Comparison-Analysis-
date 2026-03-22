package com.creditcard.comparison.controller;

import com.creditcard.comparison.invertedindex.InvertedIndexService;
import com.creditcard.comparison.model.CardCatalogItem;
import com.creditcard.comparison.service.CardCatalogService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin
public class InvertedIndexController {

    private final InvertedIndexService service;
    private final CardCatalogService cardCatalogService;

    public InvertedIndexController(InvertedIndexService service, CardCatalogService cardCatalogService) {
        this.service = service;
        this.cardCatalogService = cardCatalogService;
    }

    @GetMapping("/api/index/add")
    public String add(@RequestParam String id, @RequestParam String text) {
        service.addDocument(id, text);
        return "Document added!";
    }

    @GetMapping("/api/index/search")
    public Set<String> searchIndexedWord(@RequestParam String word) {
        return service.search(word);
    }

    @GetMapping("/api/search")
    public Map<String, Object> searchForFrontend(@RequestParam("keyword") String keyword) {
        Set<String> matches = service.search(keyword);
        List<CardCatalogItem> cards = cardCatalogService.findByTitles(new ArrayList<>(matches));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("keyword", keyword);
        response.put("results", cards);
        response.put("count", cards.size());
        return response;
    }
}
