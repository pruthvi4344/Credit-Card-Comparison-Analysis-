package com.creditcard.comparison.controller;

import com.creditcard.comparison.index.PageRanker;
import com.creditcard.comparison.model.CardCatalogItem;
import com.creditcard.comparison.service.CardCatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PageRankingController {

    private final CardCatalogService cardCatalogService;
    private final PageRanker pageRanker = new PageRanker();

    public PageRankingController(CardCatalogService cardCatalogService) {
        this.cardCatalogService = cardCatalogService;
    }

    @GetMapping("/rank")
    public Map<String, Object> rank(@RequestParam String keyword) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        List<Map<String, Object>> rankings = new ArrayList<>();

        for (CardCatalogItem card : cardCatalogService.getAllCards()) {
            String searchableText = String.join(" ",
                    safe(card.getTitle()),
                    safe(card.getBank()),
                    safe(card.getAnnualFees()),
                    safe(card.getPurchaseInterestRate()),
                    safe(card.getCashInterestRate()),
                    safe(card.getProductValueProp()),
                    safe(card.getProductBenefits())
            );

            int occurrences = pageRanker.countFrequency(searchableText, normalizedKeyword);
            if (occurrences <= 0) {
                continue;
            }

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("cardName", card.getTitle());
            item.put("bank", card.getBank());
            item.put("occurrences", occurrences);
            item.put("applyUrl", card.getDetailsUrl());
            item.put("annualFees", card.getAnnualFees());
            rankings.add(item);
        }

        rankings.sort(Comparator
                .comparingInt((Map<String, Object> item) -> (Integer) item.get("occurrences"))
                .reversed()
                .thenComparing(item -> String.valueOf(item.get("cardName"))));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("keyword", normalizedKeyword);
        response.put("rankings", rankings);
        response.put("count", rankings.size());
        response.put("message", rankings.isEmpty()
                ? "No cards matched the given keyword."
                : "Card rankings generated successfully.");
        return response;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
