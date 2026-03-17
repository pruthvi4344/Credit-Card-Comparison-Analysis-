package com.creditcard.comparison.index;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class WordCompletionService {

    private final TrieNode root = new TrieNode();

    // ✅ LOAD CSV
    @PostConstruct
    public void loadCSV() {
        try {
            ClassPathResource resource = new ClassPathResource("data/credit_cards.csv");

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream())
            );

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {

                // skip header
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // ✅ SPLIT CSV LINE
                String[] columns = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

                if (columns.length > 0) {
                    String cardTitle = columns[0]; // Card Title column

                    // ✅ BREAK INTO WORDS
                    String[] words = cardTitle.split("\\s+");

                    for (String word : words) {
                        insertKeyword(word);
                    }
                }
            }

            System.out.println("✅ CSV Loaded Successfully into Trie");

        } catch (Exception e) {
            System.out.println("❌ Error loading CSV: " + e.getMessage());
        }
    }

    // INSERT WORD
    public void insertKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) return;

        keyword = normalize(keyword);
        TrieNode current = root;

        for (char ch : keyword.toCharArray()) {
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }

        current.isWord = true;
        current.frequency++;
    }

    // AUTOCOMPLETE
    public Map<String, Integer> autocomplete(String prefix, int limit) {
        Map<String, Integer> result = new LinkedHashMap<>();

        if (prefix == null || prefix.isBlank()) return result;

        prefix = normalize(prefix);
        TrieNode current = root;

        for (char ch : prefix.toCharArray()) {
            if (!current.children.containsKey(ch)) return result;
            current = current.children.get(ch);
        }

        List<Suggestion> list = new ArrayList<>();
        dfs(prefix, current, list);

        list.sort((a, b) -> Integer.compare(b.frequency, a.frequency));

        for (int i = 0; i < Math.min(limit, list.size()); i++) {
            result.put(list.get(i).word, list.get(i).frequency);
        }

        return result;
    }

    private void dfs(String word, TrieNode node, List<Suggestion> list) {
        if (node.isWord) {
            list.add(new Suggestion(word, node.frequency));
        }

        for (Map.Entry<Character, TrieNode> entry : node.children.entrySet()) {
            dfs(word + entry.getKey(), entry.getValue(), list);
        }
    }

    private String normalize(String keyword) {
        return keyword.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    // INNER CLASSES
    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isWord;
        int frequency;
    }

    static class Suggestion {
        String word;
        int frequency;

        Suggestion(String word, int frequency) {
            this.word = word;
            this.frequency = frequency;
        }
    }
}