package com.creditcard.comparison.parser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;

@Service
public class HtmlParser {

    public ParseResult parseUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return new ParseResult("", "", "", 0, "URL is required.");
        }

        String targetUrl = url.trim();

        try {
            Document doc = Jsoup.connect(targetUrl)
                    .userAgent("Mozilla/5.0")
                    .timeout(8000)
                    .get();

            // Remove obvious noise first so the output is closer to the visible page content.
            doc.select("script, style, noscript").remove();

            String title = doc.title() == null ? "" : doc.title().trim();
            String text = doc.body() == null ? "" : doc.body().text().replaceAll("\\s+", " ").trim();
            int wordCount = text.isBlank() ? 0 : text.split("\\s+").length;

            return new ParseResult(targetUrl, title, text, wordCount, "");
        } catch (Exception e) {
            return new ParseResult(targetUrl, "", "", 0, "Failed to parse URL: " + e.getMessage());
        }
    }

    public record ParseResult(String url, String title, String text, int wordCount, String error) {
    }
}
