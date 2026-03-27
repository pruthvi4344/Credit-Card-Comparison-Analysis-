package com.creditcard.comparison.index;

import com.creditcard.comparison.model.CardCatalogItem;
import com.creditcard.comparison.service.CardCatalogService;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

@Service
public class FrequencyCounter {

    private final CardCatalogService cardCatalogService;
    private final HashMap<String, Integer> searchHistory = new HashMap<>();

    // Precomputed structure: word -> (card -> count).
    private final Map<String, Map<String, Integer>> frequencyIndex = new HashMap<>();
    private final Map<String, CardCatalogItem> cardLookup = new LinkedHashMap<>();

    public FrequencyCounter(CardCatalogService cardCatalogService) {
        this.cardCatalogService = cardCatalogService;
    }

    @PostConstruct
    public void buildFrequencyIndex() {
        // We do the heavy counting once at startup instead of rescanning the whole CSV on every query.
        frequencyIndex.clear();
        cardLookup.clear();

        try {
            for (CardCatalogItem card : cardCatalogService.getAllCards()) {
                String cardKey = buildCardKey(card);
                cardLookup.put(cardKey, card);

                String combinedText = String.join(" ",
                        safe(card.getTitle()),
                        safe(card.getAnnualFees()),
                        safe(card.getPurchaseInterestRate()),
                        safe(card.getCashInterestRate()),
                        safe(card.getProductValueProp()),
                        safe(card.getProductBenefits()),
                        safe(card.getBank())
                ).toLowerCase(Locale.ENGLISH);

                String[] words = combinedText.split("[^a-z0-9]+");
                Map<String, Integer> perCardCounts = new HashMap<>();

                for (String word : words) {
                    if (word == null || word.isBlank()) {
                        continue;
                    }
                    perCardCounts.put(word, perCardCounts.getOrDefault(word, 0) + 1);
                }

                for (Map.Entry<String, Integer> entry : perCardCounts.entrySet()) {
                    frequencyIndex
                            .computeIfAbsent(entry.getKey(), ignored -> new LinkedHashMap<>())
                            .put(cardKey, entry.getValue());
                }
            }
        } catch (RuntimeException ignored) {
            // If the CSV is unavailable we keep an empty index and let request-time error handling surface the real cause.
        }
    }

    public Map<String, Integer> countWordFrequency(String keyword) {
        // Query-time work stays small because the index already holds the counts.
        Map<String, Integer> frequencyByCard = new LinkedHashMap<>();
        String normalizedKeyword = normalizeKeyword(keyword);

        if (normalizedKeyword.isEmpty()) {
            return frequencyByCard;
        }

        Map<String, Integer> indexedCounts = frequencyIndex.getOrDefault(normalizedKeyword, Map.of());
        frequencyByCard.putAll(new TreeMap<>(indexedCounts));
        return frequencyByCard;
    }

    public CardCatalogItem getCardByKey(String cardKey) {
        return cardLookup.get(cardKey);
    }

    public void updateSearchFrequency(String keyword) {
        // Search history is a running counter, so HashMap is the simplest correct structure here.
        String normalizedKeyword = normalizeKeyword(keyword);
        if (normalizedKeyword.isEmpty()) {
            return;
        }

        searchHistory.put(normalizedKeyword, searchHistory.getOrDefault(normalizedKeyword, 0) + 1);
    }

    public Map<String, Integer> displaySearchHistory() {
        return new LinkedHashMap<>(searchHistory);
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null) {
            return "";
        }
        return keyword.toLowerCase(Locale.ENGLISH).replaceAll("[^a-z0-9]+", "").trim();
    }

    private String buildCardKey(CardCatalogItem card) {
        return safe(card.getTitle()) + "||" + safe(card.getDetailsUrl());
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
