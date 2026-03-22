package com.creditcard.comparison.controller;

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
        RegexValidator.ValidationResult result = regexValidator.validate(request == null ? null : request.input(), request == null ? null : request.pattern());
        return Map.of(
                "input", result.input(),
                "pattern", result.pattern(),
                "valid", result.valid(),
                "error", result.error() == null ? "" : result.error()
        );
    }

    @PostMapping("/pattern")
    public Map<String, Object> findPattern(@RequestBody PatternRequest request) {
        RegexValidator.PatternResult result = regexValidator.findPatterns(request == null ? null : request.text(), request == null ? null : request.type());
        return Map.of(
                "type", result.type(),
                "pattern", result.pattern(),
                "matches", result.matches(),
                "count", result.matches().size()
        );
    }

    public record ValidateRequest(String input, String pattern) {
    }

    public record PatternRequest(String text, String type) {
    }
}
