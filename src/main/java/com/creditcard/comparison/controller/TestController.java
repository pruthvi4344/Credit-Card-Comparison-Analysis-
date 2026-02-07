package com.creditcard.comparison.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    @GetMapping("/")
    public String test() {
        return "Spring Boot + Java 21 working 🚀";
    }
}
