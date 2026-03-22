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

    private static final String DEFAULT_VALIDATE_PATTERN = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    private static final String EMAIL_PATTERN = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
    private static final String PHONE_PATTERN = "(?:\\+?\\d{1,3}[\\s.-]?)?(?:\\(?\\d{3}\\)?[\\s.-]?)\\d{3}[\\s.-]?\\d{4}";
    private static final String URL_PATTERN = "(?:https?://|www\\.)[^\\s]+";

    public ValidationResult validate(String input, String customPattern) {
        String safeInput = input == null ? "" : input.trim();
        String patternText = (customPattern == null || customPattern.trim().isEmpty())
                ? DEFAULT_VALIDATE_PATTERN
                : customPattern.trim();

        try {
            Pattern pattern = Pattern.compile(patternText);
            Matcher matcher = pattern.matcher(safeInput);
            boolean valid = matcher.matches();
            return new ValidationResult(safeInput, patternText, valid, null);
        } catch (PatternSyntaxException ex) {
            return new ValidationResult(safeInput, patternText, false, ex.getDescription());
        }
    }

    public PatternResult findPatterns(String text, String type) {
        String safeText = text == null ? "" : text;
        String normalizedType = type == null ? "email" : type.trim().toLowerCase();
        String patternText = switch (normalizedType) {
            case "phone" -> PHONE_PATTERN;
            case "url" -> URL_PATTERN;
            case "email" -> EMAIL_PATTERN;
            default -> throw new IllegalArgumentException("Unsupported pattern type: " + type);
        };

        Pattern pattern = Pattern.compile(patternText, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(safeText);
        Set<String> uniqueMatches = new LinkedHashSet<>();

        while (matcher.find()) {
            uniqueMatches.add(matcher.group());
        }

        return new PatternResult(normalizedType, patternText, new ArrayList<>(uniqueMatches));
    }

    public record ValidationResult(String input, String pattern, boolean valid, String error) {
    }

    public record PatternResult(String type, String pattern, List<String> matches) {
    }
}
