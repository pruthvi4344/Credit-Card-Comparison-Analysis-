package com.creditcard.comparison.model;

public class CreditCard {

    private String bank;
    private String name;
    private String detailsUrl;
    private String sourceUrl;
    private String imageUrl;
    private String annualFees;
    private String purchaseInterestRate;
    private String cashInterestRate;
    private String productValueProp;
    private String productBenefits;

    public CreditCard() {
    }

    public CreditCard(String bank, String name, String detailsUrl, String sourceUrl) {
        this.bank = bank;
        this.name = name;
        this.detailsUrl = detailsUrl;
        this.sourceUrl = sourceUrl;
    }

    public CreditCard(
            String bank,
            String name,
            String detailsUrl,
            String sourceUrl,
            String imageUrl,
            String annualFees,
            String purchaseInterestRate,
            String cashInterestRate,
            String productValueProp,
            String productBenefits
    ) {
        this.bank = bank;
        this.name = name;
        this.detailsUrl = detailsUrl;
        this.sourceUrl = sourceUrl;
        this.imageUrl = imageUrl;
        this.annualFees = annualFees;
        this.purchaseInterestRate = purchaseInterestRate;
        this.cashInterestRate = cashInterestRate;
        this.productValueProp = productValueProp;
        this.productBenefits = productBenefits;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAnnualFees() {
        return annualFees;
    }

    public void setAnnualFees(String annualFees) {
        this.annualFees = annualFees;
    }

    public String getPurchaseInterestRate() {
        return purchaseInterestRate;
    }

    public void setPurchaseInterestRate(String purchaseInterestRate) {
        this.purchaseInterestRate = purchaseInterestRate;
    }

    public String getCashInterestRate() {
        return cashInterestRate;
    }

    public void setCashInterestRate(String cashInterestRate) {
        this.cashInterestRate = cashInterestRate;
    }

    public String getProductValueProp() {
        return productValueProp;
    }

    public void setProductValueProp(String productValueProp) {
        this.productValueProp = productValueProp;
    }

    public String getProductBenefits() {
        return productBenefits;
    }

    public void setProductBenefits(String productBenefits) {
        this.productBenefits = productBenefits;
    }
}
