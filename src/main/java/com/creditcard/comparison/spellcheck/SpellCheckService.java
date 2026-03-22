package com.creditcard.comparison.spellcheck;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class SpellCheckService {

    // Store all unique words
    private Set<String> dictionary = new HashSet<>();

    // Constructor → runs automatically
    public SpellCheckService() {
        loadWordsFromCSV();
    }

    // ✅ Load useful words from CSV
    private void loadWordsFromCSV() {
        try {
            InputStream is = getClass().getResourceAsStream("/data/credit_cards.csv");
            BufferedReader br = new BufferedReader(new InputStreamReader(is));

            String line;

            // skip header
            br.readLine();

            while ((line = br.readLine()) != null) {

                // Proper CSV split (handles quotes)
                String[] cols = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

                if (cols.length < 8) continue;

                addWords(cols[0]); // Card Title
                addWords(cols[5]); // Value Prop
                addWords(cols[6]); // Benefits
                addWords(cols[7]); // Bank Name
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ✅ Clean and store words
    private void addWords(String text) {
        if (text == null) return;

        text = text.toLowerCase();

        // remove symbols, numbers, URLs
        text = text.replaceAll("[^a-z ]", " ");

        String[] words = text.split("\\s+");

        for (String w : words) {
            if (w.length() > 2) { // ignore small words like 'a', 'to'
                dictionary.add(w);
            }
        }
    }

    // ✅ Check if word exists
    public boolean isCorrect(String word) {
        return dictionary.contains(word.toLowerCase());
    }

    // ✅ Suggest similar words (TOP 5)
    public List<String> getSuggestions(String input) {

        final String wordInput = input.toLowerCase();

        List<String> result = new ArrayList<>();

        for (String word : dictionary) {
            int dist = editDistance(wordInput, word);

            if (dist <= 2) {
                result.add(word);
            }
        }

        // sort by closest match
        result.sort((a, b) ->
                editDistance(wordInput, a) - editDistance(wordInput, b)
        );

        // return only top 5
        return result.size() > 5 ? result.subList(0, 5) : result;
    }

    // ✅ Edit Distance (Levenshtein)
    private int editDistance(String a, String b) {

        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) {
            for (int j = 0; j <= b.length(); j++) {

                if (i == 0) dp[i][j] = j;
                else if (j == 0) dp[i][j] = i;

                else if (a.charAt(i - 1) == b.charAt(j - 1))
                    dp[i][j] = dp[i - 1][j - 1];

                else
                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                            Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }

        return dp[a.length()][b.length()];
    }
}