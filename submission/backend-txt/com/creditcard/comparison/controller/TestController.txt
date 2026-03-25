package com.creditcard.comparison.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/test")
    public String testConnection() {
        return "Frontend and Backend Connected Successfully 🚀";
    }
}