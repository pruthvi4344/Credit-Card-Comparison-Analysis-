package com.creditcard.comparison.parser;

import java.io.File;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.creditcard.comparison.invertedindex.InvertedIndexService;

import jakarta.annotation.PostConstruct;

@Service
public class HtmlParserService {

    @Autowired
    private InvertedIndexService indexService;

    @PostConstruct
    public void parseHTML() {

        try {
            File file = new File("src/main/resources/data/cards.html");

            Document doc = Jsoup.parse(file, "UTF-8");

            Elements cards = doc.select(".card");

            for (Element card : cards) {

                String title = card.select("h2").text();
                String text = card.select(".text").text();

                // send to inverted index
                indexService.addDocument(title, text);

                System.out.println("Parsed: " + title);
            }

            System.out.println("✅ HTML Parsed and Indexed");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}