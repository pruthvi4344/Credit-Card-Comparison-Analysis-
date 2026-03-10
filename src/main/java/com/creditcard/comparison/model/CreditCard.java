package com.creditcard.comparison.model;

public class CreditCard {

    private String bank;
    private String name;
    private String detailsUrl;
    private String sourceUrl;

    public CreditCard() {
    }

    public CreditCard(String bank, String name, String detailsUrl, String sourceUrl) {
        this.bank = bank;
        this.name = name;
        this.detailsUrl = detailsUrl;
        this.sourceUrl = sourceUrl;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDetailsUrl() {
        return detailsUrl;
    }

    public void setDetailsUrl(String detailsUrl) {
        this.detailsUrl = detailsUrl;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }
}
