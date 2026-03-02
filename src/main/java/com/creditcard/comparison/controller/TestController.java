package com.creditcard.comparison.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/hello")
    public String hello() {
        return "Backend Connected Successfully 🚀";
    }
}