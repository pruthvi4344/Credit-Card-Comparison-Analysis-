package com.creditcard.comparison.invertedindex;

import com.creditcard.comparison.exception.ResourceProcessingException;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class InvertedIndexService {

    private static final String CSV_SPLIT_REGEX = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";

    // Inverted index shape: token -> set of card titles containing that token.
    private final Map<String, Set<String>> index = new HashMap<>();
    private String loadError = "";

    // Build the index once when the app starts so keyword lookup stays fast later.
    @PostConstruct
    public void loadCSV() {
        String filePath = "src/main/resources/data/credit_cards.csv";

        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            boolean firstLine = true;

            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }

                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // Safe CSV split so commas inside quoted text do not corrupt the row.
                String[] data = line.split(CSV_SPLIT_REGEX);

                if (data.length < 7) {
                    System.out.println("Skipping bad row: " + line);
                    continue;
                }

                String id = data[0].trim();

                // Descriptive text gives better retrieval than indexing only the title.
                String text = (data[5] + " " + data[6]).toLowerCase();
                addDocument(id, text);
            }
        } catch (Exception e) {
            loadError = "The database file credit_cards.csv does not exist or could not be loaded.";
        }
    }

    // Tokenization is simple here because exact keyword retrieval matters more than linguistic parsing.
    public void addDocument(String id, String text) {
        String[] words = text.split("\\W+");

        for (String word : words) {
            if (word.isEmpty()) {
                continue;
            }
            index.computeIfAbsent(word, ignored -> new HashSet<>()).add(id);
        }
    }

    // Search is just a direct map lookup once the index has already been built.
    public Set<String> search(String word) {
        ensureIndexAvailable();
        return index.getOrDefault(word.toLowerCase(), Collections.emptySet());
    }

    private void ensureIndexAvailable() {
        if (!loadError.isBlank()) {
            throw new ResourceProcessingException(loadError);
        }
    }
}
