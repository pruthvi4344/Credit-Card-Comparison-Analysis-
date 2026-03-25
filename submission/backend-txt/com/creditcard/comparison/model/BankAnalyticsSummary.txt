package com.creditcard.comparison.model;

import java.util.List;

public class BankAnalyticsSummary {

    private int totalBanks;
    private int totalCards;
    private double averageAnnualFeeAcrossBanks;
    private double averagePurchaseRateAcrossBanks;
    private List<BankAnalyticsItem> banks;

    public BankAnalyticsSummary() {
    }

    public BankAnalyticsSummary(
            int totalBanks,
            int totalCards,
            double averageAnnualFeeAcrossBanks,
            double averagePurchaseRateAcrossBanks,
            List<BankAnalyticsItem> banks
    ) {
        this.totalBanks = totalBanks;
        this.totalCards = totalCards;
        this.averageAnnualFeeAcrossBanks = averageAnnualFeeAcrossBanks;
        this.averagePurchaseRateAcrossBanks = averagePurchaseRateAcrossBanks;
        this.banks = banks;
    }

    public int getTotalBanks() {
        return totalBanks;
    }

    public void setTotalBanks(int totalBanks) {
        this.totalBanks = totalBanks;
    }

    public int getTotalCards() {
        return totalCards;
    }

    public void setTotalCards(int totalCards) {
        this.totalCards = totalCards;
    }

    public double getAverageAnnualFeeAcrossBanks() {
        return averageAnnualFeeAcrossBanks;
    }

    public void setAverageAnnualFeeAcrossBanks(double averageAnnualFeeAcrossBanks) {
        this.averageAnnualFeeAcrossBanks = averageAnnualFeeAcrossBanks;
    }

    public double getAveragePurchaseRateAcrossBanks() {
        return averagePurchaseRateAcrossBanks;
    }

    public void setAveragePurchaseRateAcrossBanks(double averagePurchaseRateAcrossBanks) {
        this.averagePurchaseRateAcrossBanks = averagePurchaseRateAcrossBanks;
    }

    public List<BankAnalyticsItem> getBanks() {
        return banks;
    }

    public void setBanks(List<BankAnalyticsItem> banks) {
        this.banks = banks;
    }
}
