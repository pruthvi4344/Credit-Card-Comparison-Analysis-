package com.creditcard.comparison.controller;

import com.creditcard.comparison.crawler.WebCrawler;
import com.creditcard.comparison.index.FrequencyCounter;
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
    private final WebCrawler webCrawler;

    public FrequencyController(FrequencyCounter frequencyCounter, WebCrawler webCrawler) {
        this.frequencyCounter = frequencyCounter;
        this.webCrawler = webCrawler;
    }

    @GetMapping("/frequency")
    public Map<String, Object> getFrequency(@RequestParam("word") String word) {
        frequencyCounter.updateSearchFrequency(word);

        Map<String, String> pages = webCrawler.getCrawledPages();
        Map<String, Integer> counts = frequencyCounter.countWordFrequency(word, pages);

        List<Map<String, Object>> pageResults = new ArrayList<>();
        int totalCount = 0;

        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            int count = entry.getValue();
            totalCount += count;

            Map<String, Object> pageResult = new LinkedHashMap<>();
            pageResult.put("url", entry.getKey());
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
        return frequencyCounter.displaySearchHistory();
    }
}
