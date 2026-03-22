package com.creditcard.comparison.parser;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

@Component
public class HtmlParser {

    public String parseHtml(String html) {
        if (html == null || html.isBlank()) return "";

        Document doc = Jsoup.parse(html);

        // Remove scripts and styles
        doc.select("script, style").remove();

        return doc.text();
    }
}