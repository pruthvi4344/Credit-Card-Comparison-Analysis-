package com.creditcard.comparison.model;

public class BankAnalyticsItem {

    private String bank;
    private int cardCount;
    private int freeCardCount;
    private int premiumCardCount;
    private double averageAnnualFee;
    private double averagePurchaseRate;
    private double averageCashRate;
    private String mostCommonCategory;

    public BankAnalyticsItem() {
    }

    public BankAnalyticsItem(
            String bank,
            int cardCount,
            int freeCardCount,
            int premiumCardCount,
            double averageAnnualFee,
            double averagePurchaseRate,
            double averageCashRate,
            String mostCommonCategory
    ) {
        this.bank = bank;
        this.cardCount = cardCount;
        this.freeCardCount = freeCardCount;
        this.premiumCardCount = premiumCardCount;
        this.averageAnnualFee = averageAnnualFee;
        this.averagePurchaseRate = averagePurchaseRate;
        this.averageCashRate = averageCashRate;
        this.mostCommonCategory = mostCommonCategory;
    }

    public String getBank() {
        return bank;
    }

    public void setBank(String bank) {
        this.bank = bank;
    }

    public int getCardCount() {
        return cardCount;
    }

    public void setCardCount(int cardCount) {
        this.cardCount = cardCount;
    }

    public int getFreeCardCount() {
        return freeCardCount;
    }

    public void setFreeCardCount(int freeCardCount) {
        this.freeCardCount = freeCardCount;
    }

    public int getPremiumCardCount() {
        return premiumCardCount;
    }

    public void setPremiumCardCount(int premiumCardCount) {
        this.premiumCardCount = premiumCardCount;
    }

    public double getAverageAnnualFee() {
        return averageAnnualFee;
    }

    public void setAverageAnnualFee(double averageAnnualFee) {
        this.averageAnnualFee = averageAnnualFee;
    }

    public double getAveragePurchaseRate() {
        return averagePurchaseRate;
    }

    public void setAveragePurchaseRate(double averagePurchaseRate) {
        this.averagePurchaseRate = averagePurchaseRate;
    }

    public double getAverageCashRate() {
        return averageCashRate;
    }

    public void setAverageCashRate(double averageCashRate) {
        this.averageCashRate = averageCashRate;
    }

    public String getMostCommonCategory() {
        return mostCommonCategory;
    }

    public void setMostCommonCategory(String mostCommonCategory) {
        this.mostCommonCategory = mostCommonCategory;
    }
}
