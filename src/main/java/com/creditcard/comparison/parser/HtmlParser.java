package com.creditcard.comparison.parser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

public class HtmlParser {

    // Extract clean text from HTML page
    public String extractText(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(5000)
                    .get();

            // remove scripts and styles
            doc.select("script, style").remove();

            return doc.body().text();

        } catch (Exception e) {
            System.out.println("Error fetching: " + url);
            return "";
        }
    }
}