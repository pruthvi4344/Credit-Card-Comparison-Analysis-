package com.creditcard.comparison.index;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class PageRanker {

    public Map<String, Integer> rankPages(Map<String, String> pages, String keyword) {

        Map<String, Integer> ranking = new HashMap<>();

        for (Map.Entry<String, String> entry : pages.entrySet()) {
            String page = entry.getKey();
            String content = entry.getValue();

            int count = countFrequency(content, keyword);
            ranking.put(page, count);
        }

        return sortByValue(ranking);
    }

    private int countFrequency(String text, String keyword) {
        if (text == null) return 0;

        String[] words = text.toLowerCase().split("\\W+");
        int count = 0;

        for (String word : words) {
            if (word.equals(keyword.toLowerCase())) {
                count++;
            }
        }

        return count;
    }

    private Map<String, Integer> sortByValue(Map<String, Integer> map) {
        List<Map.Entry<String, Integer>> list = new ArrayList<>(map.entrySet());

        list.sort((a, b) -> b.getValue() - a.getValue());

        Map<String, Integer> result = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : list) {
            result.put(entry.getKey(), entry.getValue());
        }

        return result;
    }
}