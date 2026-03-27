package com.creditcard.comparison.service;

import com.creditcard.comparison.exception.ResourceProcessingException;
import com.creditcard.comparison.model.CardCatalogItem;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CardCatalogService {

    private final List<CardCatalogItem> cards = new ArrayList<>();
    private String loadError = "";

    @PostConstruct
    public void loadCards() {
        cards.clear();
        loadError = "";

        ClassPathResource resource = new ClassPathResource("data/credit_cards.csv");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)
        )) {
            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                String[] data = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
                if (data.length < 9) {
                    continue;
                }

                cards.add(new CardCatalogItem(
                        clean(data[0]),
                        clean(data[1]),
                        clean(data[2]),
                        clean(data[3]),
                        clean(data[4]),
                        clean(data[5]),
                        clean(data[6]),
                        clean(data[7]),
                        clean(data[8])
                ));
            }
        } catch (IOException ex) {
            loadError = "The database file credit_cards.csv does not exist or could not be loaded.";
        }
    }

    public List<CardCatalogItem> getAllCards() {
        ensureCatalogAvailable();
        return Collections.unmodifiableList(cards);
    }

    public Optional<CardCatalogItem> findBestMatch(String bank, String cardName, String detailsUrl) {
        ensureCatalogAvailable();
        String normalizedBank = normalize(bank);
        String normalizedName = normalize(cardName);
        String normalizedUrl = normalizeUrl(detailsUrl);

        return cards.stream()
                .filter(card -> normalize(card.getBank()).equals(normalizedBank))
                .filter(card -> isMatch(card, normalizedName, normalizedUrl))
                .findFirst();
    }

    public List<CardCatalogItem> findByTitles(List<String> titles) {
        ensureCatalogAvailable();
        if (titles == null || titles.isEmpty()) {
            return List.of();
        }

        List<String> normalizedTitles = titles.stream()
                .map(this::normalize)
                .filter(value -> !value.isBlank())
                .collect(Collectors.toList());

        List<CardCatalogItem> matched = new ArrayList<>();

        for (String normalizedTitle : normalizedTitles) {
            cards.stream()
                    .filter(card -> {
                        String cardTitle = normalize(card.getTitle());
                        return cardTitle.equals(normalizedTitle)
                                || cardTitle.contains(normalizedTitle)
                                || normalizedTitle.contains(cardTitle);
                    })
                    .findFirst()
                    .ifPresent(matched::add);
        }

        return matched;
    }

    private boolean isMatch(CardCatalogItem card, String normalizedName, String normalizedUrl) {
        String cardUrl = normalizeUrl(card.getDetailsUrl());
        if (!normalizedUrl.isBlank() && !cardUrl.isBlank() && normalizedUrl.equals(cardUrl)) {
            return true;
        }

        String cardTitle = normalize(card.getTitle());
        return !normalizedName.isBlank() && (
                cardTitle.equals(normalizedName)
                        || cardTitle.contains(normalizedName)
                        || normalizedName.contains(cardTitle)
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase(Locale.ENGLISH)
                .replace("*", "")
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private String normalizeUrl(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toLowerCase(Locale.ENGLISH).replaceAll("/+$", "");
    }

    private String clean(String value) {
        return value == null ? "" : value.replace("\"", "").trim();
    }

    public boolean isAvailable() {
        return loadError.isBlank();
    }

    public String getLoadError() {
        return loadError;
    }

    private void ensureCatalogAvailable() {
        if (!isAvailable()) {
            throw new ResourceProcessingException(loadError);
        }
    }
}
