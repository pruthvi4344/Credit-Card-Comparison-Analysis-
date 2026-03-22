package com.creditcard.comparison.model;

public class CardCatalogItem {

    private String title;
    private String imageUrl;
    private String annualFees;
    private String purchaseInterestRate;
    private String cashInterestRate;
    private String productValueProp;
    private String productBenefits;
    private String bank;
    private String detailsUrl;

    public CardCatalogItem() {
    }

    public CardCatalogItem(
            String title,
            String imageUrl,
            String annualFees,
            String purchaseInterestRate,
            String cashInterestRate,
            String productValueProp,
            String productBenefits,
            String bank,
            String detailsUrl
    ) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.annualFees = annualFees;
        this.purchaseInterestRate = purchaseInterestRate;
        this.cashInterestRate = cashInterestRate;
        this.productValueProp = productValueProp;
        this.productBenefits = productBenefits;
        this.bank = bank;
        this.detailsUrl = detailsUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public String getDetailsUrl() {
        return detailsUrl;
    }

    public void setDetailsUrl(String detailsUrl) {
        this.detailsUrl = detailsUrl;
    }
}
