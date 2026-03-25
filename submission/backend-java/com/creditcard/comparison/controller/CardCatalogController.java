package com.creditcard.comparison.controller;

import com.creditcard.comparison.model.CardCatalogItem;
import com.creditcard.comparison.service.CardCatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CardCatalogController {

    private final CardCatalogService cardCatalogService;

    public CardCatalogController(CardCatalogService cardCatalogService) {
        this.cardCatalogService = cardCatalogService;
    }

    @GetMapping("/cards")
    public List<CardCatalogItem> getAllCards() {
        return cardCatalogService.getAllCards();
    }
}
