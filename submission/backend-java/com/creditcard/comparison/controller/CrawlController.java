package com.creditcard.comparison.controller;

import com.creditcard.comparison.crawler.WebCrawler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CrawlController {

    private final WebCrawler webCrawler;

    public CrawlController(WebCrawler webCrawler) {
        this.webCrawler = webCrawler;
    }

    @GetMapping("/crawl")
    public Map<String, Object> crawl(@RequestParam(required = false) List<String> banks) {
        return webCrawler.startCrawling(banks);
    }
}
