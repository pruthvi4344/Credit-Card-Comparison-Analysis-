package com.creditcard.comparison.index;
import java.util.regex.*;

public class DataValidation {

    // Validate Credit Card Number (Visa, MasterCard, Amex basic)
    public static boolean isValidCardNumber(String cardNumber) {
        String regex = "^(4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$";
        return Pattern.matches(regex, cardNumber);
    }

    // Validate CVV (3 or 4 digits)
    public static boolean isValidCVV(String cvv) {
        return Pattern.matches("^[0-9]{3,4}$", cvv);
    }

    // Validate Expiry Date (MM/YY)
    public static boolean isValidExpiry(String expiry) {
        return Pattern.matches("^(0[1-9]|1[0-2])/\\d{2}$", expiry);
    }

    // Validate Email
    public static boolean isValidEmail(String email) {
        String regex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.matches(regex, email);
    }

    public static void main(String[] args) {
        System.out.println(isValidCardNumber("4111111111111111")); // true
        System.out.println(isValidCVV("123")); // true
        System.out.println(isValidExpiry("12/25")); // true
        System.out.println(isValidEmail("test@gmail.com")); // true
    }
}