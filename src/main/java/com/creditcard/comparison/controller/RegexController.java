package com.creditcard.comparison.controller;

import com.creditcard.comparison.exception.BadRequestException;
import com.creditcard.comparison.util.RegexValidator;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/regex")
public class RegexController {

    private final RegexValidator regexValidator;

    public RegexController(RegexValidator regexValidator) {
        this.regexValidator = regexValidator;
    }

    @PostMapping("/validate")
    public Map<String, Object> validate(@RequestBody ValidateRequest request) {
        if (request == null || request.input() == null || request.input().trim().isEmpty()) {
            throw new BadRequestException("Validation input is required.");
        }

        RegexValidator.ValidationResult result = regexValidator.validate(
                request.input(),
                request.pattern(),
                request.type()
        );
        return Map.of(
                "input", result.input(),
                "pattern", result.pattern(),
                "type", result.type(),
                "valid", result.valid(),
                "error", result.error() == null ? "" : result.error()
        );
    }

    @PostMapping("/pattern")
    public Map<String, Object> findPattern(@RequestBody PatternRequest request) {
        if (request == null || request.text() == null || request.text().trim().isEmpty()) {
            throw new BadRequestException("Pattern input text is required.");
        }

        RegexValidator.PatternResult result = regexValidator.findPatterns(request.text(), request.type());
        return Map.of(
                "type", result.type(),
                "pattern", result.pattern(),
                "matches", result.matches(),
                "count", result.matches().size()
        );
    }

    public record ValidateRequest(String input, String pattern, String type) {
    }

    public record PatternRequest(String text, String type) {
    }
}
