package com.creditcard.comparison.controller;

import com.creditcard.comparison.parser.HtmlParser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/html")
public class HtmlParserController {

    private final HtmlParser htmlParser;

    public HtmlParserController(HtmlParser htmlParser) {
        this.htmlParser = htmlParser;
    }

    @GetMapping("/parse")
    public Map<String, Object> parse(@RequestParam String url) {
        HtmlParser.ParseResult result = htmlParser.parseUrl(url);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("url", result.url());
        response.put("title", result.title());
        response.put("text", result.text());
        response.put("wordCount", result.wordCount());
        response.put("success", result.error() == null || result.error().isBlank());
        response.put("error", result.error());
        return response;
    }
}
