package com.creditcard.comparison.invertedindex;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class InvertedIndexService {

    // word -> set of card names
    private final Map<String, Set<String>> index = new HashMap<>();

    // AUTO LOAD CSV WHEN PROJECT STARTS
    @PostConstruct
    public void loadCSV() {

        String filePath = "src/main/resources/data/credit_cards.csv";

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {

            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {

                // skip empty lines
                if (line.trim().isEmpty()) continue;

                // skip header
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // split CSV safely (handles quotes also)
                String[] data = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

                // ✅ FIX: prevent crash
                if (data.length < 7) {
                    System.out.println("⚠ Skipping bad row: " + line);
                    continue;
                }

                String id = data[0].trim(); // Card Name

                // combine useful fields
                String text = (data[5] + " " + data[6]).toLowerCase();

                addDocument(id, text);
            }

            System.out.println("✅ CSV Loaded into Inverted Index");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // add words into inverted index
    public void addDocument(String id, String text) {

        String[] words = text.split("\\W+");

        for (String word : words) {

            if (word.isEmpty()) continue;

            index.computeIfAbsent(word, k -> new HashSet<>()).add(id);
        }
    }

    // search single word
    public Set<String> search(String word) {
        return index.getOrDefault(word.toLowerCase(), Collections.emptySet());
    }
}