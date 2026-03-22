package com.creditcard.comparison.controller;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creditcard.comparison.crawler.WebCrawler;
import com.creditcard.comparison.index.FrequencyCounter;
import com.creditcard.comparison.index.PageRanker;

@RestController
@RequestMapping("/api")
public class FrequencyController {

    private final FrequencyCounter frequencyCounter;
    private final WebCrawler webCrawler;
    private final PageRanker pageRanker;

    public FrequencyController(FrequencyCounter frequencyCounter,
                               WebCrawler webCrawler,
                               PageRanker pageRanker) {
        this.frequencyCounter = frequencyCounter;
        this.webCrawler = webCrawler;
        this.pageRanker = pageRanker;
    }

    // ✅ EXISTING
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

    //  (Page Ranking)
    @GetMapping("/rank")
    public Map<String, Object> getRanking(@RequestParam("keyword") String keyword) {

        Map<String, String> pages = webCrawler.getCrawledPages();

        Map<String, Integer> ranked = pageRanker.rankPages(pages, keyword);

        List<Map<String, Object>> results = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : ranked.entrySet()) {
            Map<String, Object> page = new LinkedHashMap<>();
            page.put("url", entry.getKey());
            page.put("score", entry.getValue());
            results.add(page);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("keyword", keyword);
        response.put("results", results);

        return response;
    }

    // ✅ EXISTING
    @GetMapping("/search-frequency")
    public Map<String, Integer> getSearchFrequency() {
        return frequencyCounter.displaySearchHistory();
    }
}