package com.creditcard.comparison.index;

import com.creditcard.comparison.exception.ResourceProcessingException;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class WordCompletionService {

    private static final String CSV_SPLIT_REGEX = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";

    // Trie is the right fit because this feature is fundamentally a prefix-search problem.
    private final TrieNode root = new TrieNode();
    private String loadError = "";

    @PostConstruct
    public void loadCSV() {
        try {
            ClassPathResource resource = new ClassPathResource("data/credit_cards.csv");
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));

            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                // Safe CSV split so commas inside quoted text do not break the title extraction.
                String[] columns = line.split(CSV_SPLIT_REGEX);

                if (columns.length > 0) {
                    String[] words = columns[0].split("\\s+");
                    for (String word : words) {
                        insertKeyword(word);
                    }
                }
            }

        } catch (Exception e) {
            loadError = "The database file credit_cards.csv does not exist or could not be loaded.";
        }
    }

    // Each node stores frequency so common completions can be ranked above rare ones.
    public void insertKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return;
        }

        keyword = normalize(keyword);
        TrieNode current = root;

        for (char ch : keyword.toCharArray()) {
            current.children.putIfAbsent(ch, new TrieNode());
            current = current.children.get(ch);
        }

        current.isWord = true;
        current.frequency++;
    }

    // Prefix walk + DFS returns all completions under the matching trie branch.
    public Map<String, Integer> autocomplete(String prefix, int limit) {
        ensureTrieAvailable();
        Map<String, Integer> result = new LinkedHashMap<>();

        if (prefix == null || prefix.isBlank()) {
            return result;
        }

        prefix = normalize(prefix);
        TrieNode current = root;

        for (char ch : prefix.toCharArray()) {
            if (!current.children.containsKey(ch)) {
                return result;
            }
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

    // Minimal trie node structure for prefix traversal.
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

    private void ensureTrieAvailable() {
        if (!loadError.isBlank()) {
            throw new ResourceProcessingException(loadError);
        }
    }
}
