package com.creditcard.comparison.index;
import java.util.regex.*;
import java.util.*;

public class PatternFinder {

    // Extract credit card names (simple example)
    public static List<String> extractCardNames(String text) {
        List<String> results = new ArrayList<>();
        Pattern pattern = Pattern.compile("(Visa|MasterCard|Amex|American Express)");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            results.add(matcher.group());
        }
        return results;
    }

    // Extract interest rates like 12.99%
    public static List<String> extractInterestRates(String text) {
        List<String> results = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\d{1,2}\\.\\d{1,2}%");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            results.add(matcher.group());
        }
        return results;
    }

    // Extract cashback percentages
    public static List<String> extractCashback(String text) {
        List<String> results = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\d+%");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            results.add(matcher.group());
        }
        return results;
    }

    // Extract URLs
    public static List<String> extractURLs(String text) {
        List<String> results = new ArrayList<>();
        Pattern pattern = Pattern.compile("https?://[\\w.-]+(?:\\.[\\w\\.-]+)+[/\\w\\.-]*");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            results.add(matcher.group());
        }
        return results;
    }

    public static void main(String[] args) {
        String sample = "Visa card offers 5% cashback with 12.99% interest. Visit https://bank.com";

        System.out.println("Cards: " + extractCardNames(sample));
        System.out.println("Rates: " + extractInterestRates(sample));
        System.out.println("Cashback: " + extractCashback(sample));
        System.out.println("URLs: " + extractURLs(sample));
    }
}