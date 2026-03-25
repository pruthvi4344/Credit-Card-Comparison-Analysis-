package com.creditcard.comparison.spellcheck;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SpellCheckService {

    private static final String CSV_SPLIT_REGEX = ",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)";

    // HashSet gives us fast exact lookup before we do the more expensive typo scoring step.
    private final Set<String> dictionary = new HashSet<>();

    // Load the dictionary once at startup so suggestions stay cheap during requests.
    public SpellCheckService() {
        loadWordsFromCSV();
    }

    // The CSV is the source of truth for domain words users are likely to type in this project.
    private void loadWordsFromCSV() {
        try {
            InputStream is = getClass().getResourceAsStream("/data/credit_cards.csv");
            if (is == null) {
                throw new IllegalStateException("credit_cards.csv could not be loaded for spell check.");
            }
            BufferedReader br = new BufferedReader(new InputStreamReader(is));

            String line;
            br.readLine();

            while ((line = br.readLine()) != null) {
                // Safe CSV split so quoted commas inside descriptions do not break the row.
                String[] cols = line.split(CSV_SPLIT_REGEX);

                if (cols.length < 8) {
                    continue;
                }

                addWords(cols[0]);
                addWords(cols[5]);
                addWords(cols[6]);
                addWords(cols[7]);
            }

        } catch (Exception e) {
            throw new IllegalStateException("Failed to initialize spell check dictionary.", e);
        }
    }

    // Normalizing words up front keeps the dictionary consistent and avoids duplicate variants.
    private void addWords(String text) {
        if (text == null) {
            return;
        }

        text = text.toLowerCase();
        text = text.replaceAll("[^a-z ]", " ");

        String[] words = text.split("\\s+");

        for (String w : words) {
            if (w.length() > 2) {
                dictionary.add(w);
            }
        }
    }

    // Exact match is the first cheap check before suggestion generation.
    public boolean isCorrect(String word) {
        if (word == null || word.isBlank()) {
            return false;
        }
        return dictionary.contains(word.toLowerCase());
    }

    // Suggestions are ranked with Levenshtein edit distance because this is a typo-correction problem.
    public List<String> getSuggestions(String input) {
        if (input == null || input.isBlank()) {
            return List.of();
        }
        final String wordInput = input.toLowerCase();
        List<String> result = new ArrayList<>();

        for (String word : dictionary) {
            int dist = editDistance(wordInput, word);
            if (dist <= 2) {
                result.add(word);
            }
        }

        // Fewer edits means a closer suggestion, so we sort ascending by distance.
        result.sort((a, b) -> editDistance(wordInput, a) - editDistance(wordInput, b));
        return result.size() > 5 ? result.subList(0, 5) : result;
    }

    // Standard dynamic-programming Levenshtein distance with insert/delete/replace cost = 1.
    private int editDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) {
            for (int j = 0; j <= b.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
                }
            }
        }

        return dp[a.length()][b.length()];
    }
}
