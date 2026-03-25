package com.creditcard.comparison.service;

import com.creditcard.comparison.model.BankAnalyticsItem;
import com.creditcard.comparison.model.BankAnalyticsSummary;
import com.creditcard.comparison.model.CardCatalogItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BankAnalyticsService {

    private final CardCatalogService cardCatalogService;

    public BankAnalyticsService(CardCatalogService cardCatalogService) {
        this.cardCatalogService = cardCatalogService;
    }

    public BankAnalyticsSummary getSummary() {
        List<CardCatalogItem> cards = cardCatalogService.getAllCards();

        Map<String, List<CardCatalogItem>> byBank = cards.stream()
                .filter(card -> card.getBank() != null && !card.getBank().isBlank())
                .collect(Collectors.groupingBy(CardCatalogItem::getBank, LinkedHashMap::new, Collectors.toList()));

        List<BankAnalyticsItem> bankItems = new ArrayList<>();

        for (Map.Entry<String, List<CardCatalogItem>> entry : byBank.entrySet()) {
            List<CardCatalogItem> bankCards = entry.getValue();
            bankItems.add(new BankAnalyticsItem(
                    entry.getKey(),
                    bankCards.size(),
                    (int) bankCards.stream().filter(card -> parseMoney(card.getAnnualFees()) == 0).count(),
                    (int) bankCards.stream().filter(card -> parseMoney(card.getAnnualFees()) >= 200).count(),
                    round(average(bankCards.stream().map(CardCatalogItem::getAnnualFees).mapToDouble(this::parseMoney).filter(value -> value >= 0).toArray())),
                    round(average(bankCards.stream().map(CardCatalogItem::getPurchaseInterestRate).mapToDouble(this::parseRate).filter(value -> value >= 0).toArray())),
                    round(average(bankCards.stream().map(CardCatalogItem::getCashInterestRate).mapToDouble(this::parseRate).filter(value -> value >= 0).toArray())),
                    detectTopCategory(bankCards)
            ));
        }

        bankItems.sort(Comparator.comparingInt(BankAnalyticsItem::getCardCount).reversed().thenComparing(BankAnalyticsItem::getBank));

        double averageFeeAcrossBanks = average(bankItems.stream().mapToDouble(BankAnalyticsItem::getAverageAnnualFee).filter(value -> value >= 0).toArray());
        double averagePurchaseAcrossBanks = average(bankItems.stream().mapToDouble(BankAnalyticsItem::getAveragePurchaseRate).filter(value -> value >= 0).toArray());

        return new BankAnalyticsSummary(
                bankItems.size(),
                cards.size(),
                round(averageFeeAcrossBanks),
                round(averagePurchaseAcrossBanks),
                bankItems
        );
    }

    private String detectTopCategory(List<CardCatalogItem> cards) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("Travel", 0);
        counts.put("Cashback", 0);
        counts.put("Student", 0);
        counts.put("Business", 0);
        counts.put("Premium", 0);

        for (CardCatalogItem card : cards) {
            String blob = (card.getTitle() + " " + card.getProductValueProp() + " " + card.getProductBenefits())
                    .toLowerCase(Locale.ENGLISH);
            if (blob.contains("travel") || blob.contains("avion") || blob.contains("aeroplan")) {
                counts.computeIfPresent("Travel", (key, value) -> value + 1);
            }
            if (blob.contains("cash back") || blob.contains("cashback")) {
                counts.computeIfPresent("Cashback", (key, value) -> value + 1);
            }
            if (blob.contains("student")) {
                counts.computeIfPresent("Student", (key, value) -> value + 1);
            }
            if (blob.contains("business")) {
                counts.computeIfPresent("Business", (key, value) -> value + 1);
            }
            if (blob.contains("infinite") || blob.contains("world elite") || blob.contains("privilege") || parseMoney(card.getAnnualFees()) >= 200) {
                counts.computeIfPresent("Premium", (key, value) -> value + 1);
            }
        }

        return counts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .filter(entry -> entry.getValue() > 0)
                .map(Map.Entry::getKey)
                .orElse("General");
    }

    private double parseMoney(String value) {
        if (value == null || value.isBlank()) {
            return -1;
        }
        String cleaned = value.replace(",", "");
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\\d+(\\.\\d+)?").matcher(cleaned);
        return matcher.find() ? Double.parseDouble(matcher.group()) : -1;
    }

    private double parseRate(String value) {
        if (value == null || value.isBlank()) {
            return -1;
        }
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("\\d+(\\.\\d+)?").matcher(value);
        return matcher.find() ? Double.parseDouble(matcher.group()) : -1;
    }

    private double average(double[] values) {
        if (values.length == 0) {
            return 0;
        }
        double total = 0;
        for (double value : values) {
            total += value;
        }
        return total / values.length;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
