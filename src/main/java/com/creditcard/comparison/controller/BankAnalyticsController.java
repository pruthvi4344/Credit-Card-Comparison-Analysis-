package com.creditcard.comparison.controller;

import com.creditcard.comparison.model.BankAnalyticsSummary;
import com.creditcard.comparison.service.BankAnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class BankAnalyticsController {

    private final BankAnalyticsService bankAnalyticsService;

    public BankAnalyticsController(BankAnalyticsService bankAnalyticsService) {
        this.bankAnalyticsService = bankAnalyticsService;
    }

    @GetMapping("/banks")
    public BankAnalyticsSummary getBankAnalytics() {
        return bankAnalyticsService.getSummary();
    }
}
