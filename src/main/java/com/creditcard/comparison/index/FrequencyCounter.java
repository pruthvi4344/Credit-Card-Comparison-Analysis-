package com.creditcard.comparison.index;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class FrequencyCounter {

    private final HashMap<String, Integer> searchHistory = new HashMap<>();

    public Map<String, Integer> countWordFrequency(String keyword, Map<String, String> pages) {
        HashMap<String, Integer> frequencyByPage = new HashMap<>();
        String normalizedKeyword = normalizeKeyword(keyword);

        if (normalizedKeyword.isEmpty() || pages == null || pages.isEmpty()) {
            return frequencyByPage;
        }

        for (Map.Entry<String, String> pageEntry : pages.entrySet()) {
            String pageName = pageEntry.getKey();
            String pageContent = pageEntry.getValue();
            int count = 0;

            if (pageContent != null && !pageContent.isBlank()) {
                String[] words = pageContent.toLowerCase(Locale.ENGLISH).split("[^a-z0-9]+");
                for (String word : words) {
                    if (normalizedKeyword.equals(word)) {
                        count++;
                    }
                }
            }

            frequencyByPage.put(pageName, count);
        }

        return frequencyByPage;
    }

    public void updateSearchFrequency(String keyword) {
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
}
