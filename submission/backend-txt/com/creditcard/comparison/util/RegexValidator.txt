package com.creditcard.comparison.util;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

@Component
public class RegexValidator {

    // Anchored patterns are used for validation because the whole input must match.
    private static final String DEFAULT_VALIDATE_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final String EMAIL_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final String PHONE_PATTERN = "^(?:\\+?\\d{1,3}[\\s.-]?)?(?:\\(?\\d{3}\\)?[\\s.-]?)\\d{3}[\\s.-]?\\d{4}$";
    private static final String URL_PATTERN = "(?:https?://|www\\.)[^\\s]+";

    public ValidationResult validate(String input, String customPattern, String type) {
        String safeInput = input == null ? "" : input.trim();
        String normalizedType = type == null ? "custom" : type.trim().toLowerCase();
        String patternText;

        if (customPattern != null && !customPattern.trim().isEmpty()) {
            patternText = customPattern.trim();
        } else {
            patternText = switch (normalizedType) {
                case "phone" -> PHONE_PATTERN;
                case "email" -> EMAIL_PATTERN;
                default -> DEFAULT_VALIDATE_PATTERN;
            };
        }

        try {
            // Matcher.matches() is the right choice for validation because partial matches are not enough.
            Pattern pattern = Pattern.compile(patternText);
            Matcher matcher = pattern.matcher(safeInput);
            boolean valid = matcher.matches();
            return new ValidationResult(safeInput, patternText, valid, normalizedType, null);
        } catch (PatternSyntaxException ex) {
            return new ValidationResult(safeInput, patternText, false, normalizedType, ex.getDescription());
        }
    }

    public PatternResult findPatterns(String text, String type) {
        String safeText = text == null ? "" : text;
        String normalizedType = type == null ? "email" : type.trim().toLowerCase();
        String patternText = switch (normalizedType) {
            case "phone" -> PHONE_PATTERN.replace("^", "").replace("$", "");
            case "url" -> URL_PATTERN;
            case "email" -> EMAIL_PATTERN.replace("^", "").replace("$", "");
            default -> throw new IllegalArgumentException("Unsupported pattern type: " + type);
        };

        // Pattern extraction is a scan problem, so find() is the right method here.
        Pattern pattern = Pattern.compile(patternText, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(safeText);
        Set<String> uniqueMatches = new LinkedHashSet<>();

        while (matcher.find()) {
            uniqueMatches.add(matcher.group());
        }

        return new PatternResult(normalizedType, patternText, new ArrayList<>(uniqueMatches));
    }

    public record ValidationResult(String input, String pattern, boolean valid, String type, String error) {
    }

    public record PatternResult(String type, String pattern, List<String> matches) {
    }
}
