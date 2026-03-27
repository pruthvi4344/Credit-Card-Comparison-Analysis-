package com.creditcard.comparison.controller;

import com.creditcard.comparison.exception.BadRequestException;
import com.creditcard.comparison.index.FrequencyCounter;
import com.creditcard.comparison.model.CardCatalogItem;
import com.creditcard.comparison.service.CardCatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FrequencyController {

    private final FrequencyCounter frequencyCounter;
    private final CardCatalogService cardCatalogService;

    public FrequencyController(FrequencyCounter frequencyCounter, CardCatalogService cardCatalogService) {
        this.frequencyCounter = frequencyCounter;
        this.cardCatalogService = cardCatalogService;
    }

    @GetMapping("/frequency")
    public Map<String, Object> getFrequency(@RequestParam("word") String word) {
        if (word == null || word.trim().isEmpty()) {
            throw new BadRequestException("Query word is required.");
        }

        frequencyCounter.updateSearchFrequency(word);

        Map<String, Integer> counts = frequencyCounter.countWordFrequency(word);

        List<Map<String, Object>> pageResults = new ArrayList<>();
        int totalCount = 0;

        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            int count = entry.getValue();
            totalCount += count;
            CardCatalogItem card = frequencyCounter.getCardByKey(entry.getKey());

            Map<String, Object> pageResult = new LinkedHashMap<>();
            pageResult.put("title", card != null ? card.getTitle() : entry.getKey());
            pageResult.put("bank", card != null ? card.getBank() : "");
            pageResult.put("url", card != null ? card.getDetailsUrl() : "");
            pageResult.put("annualFees", card != null ? card.getAnnualFees() : "");
            pageResult.put("count", count);
            pageResults.add(pageResult);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("word", word);
        response.put("count", totalCount);
        response.put("pages", pageResults);
        return response;
    }

    @GetMapping("/search-frequency")
    public Map<String, Integer> getSearchFrequency() {
        if (!cardCatalogService.isAvailable()) {
            throw new BadRequestException(cardCatalogService.getLoadError());
        }
        return frequencyCounter.displaySearchHistory();
    }
}
