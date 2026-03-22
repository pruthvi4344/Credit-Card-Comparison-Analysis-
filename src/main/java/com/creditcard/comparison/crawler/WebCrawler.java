package com.creditcard.comparison.crawler;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;

import com.creditcard.comparison.model.CreditCard;
import com.creditcard.comparison.parser.HtmlParser;
@Service
public class WebCrawler {

    private static final String CHROME_DRIVER_PATH = "C:\\chromedriver\\chromedriver.exe";

    private static final Map<String, String> BANK_URLS = Map.of(
            "RBC", "https://www.rbcroyalbank.com/credit-cards/all-credit-cards.html#/all-cards",
            "CIBC", "https://www.cibc.com/en/personal-banking/credit-cards/all-credit-cards.html",
            "TD", "https://www.td.com/ca/en/personal-banking/products/credit-cards/browse-all",
            "SCOTIA", "https://www.scotiabank.com/ca/en/personal/credit-cards.html",
            "BMO", "https://www.bmo.com/main/personal/credit-cards/all-cards/"
    );

    private final Map<String, String> crawledPages = new ConcurrentHashMap<>();

    public Map<String, Object> startCrawling(List<String> requestedBanks) {
        List<String> banksToCrawl = resolveBanks(requestedBanks);
        Map<String, Object> response = new LinkedHashMap<>();
        List<Map<String, Object>> bankResults = new ArrayList<>();
        List<CreditCard> allCards = new ArrayList<>();

        System.setProperty("webdriver.chrome.driver", CHROME_DRIVER_PATH);

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--window-size=1600,1000");

        WebDriver driver = null;
        try {
            driver = new ChromeDriver(options);
            for (String bank : banksToCrawl) {
                String url = BANK_URLS.get(bank);
                Map<String, Object> bankResult = crawlBank(driver, bank, url);
                bankResults.add(bankResult);

                Object cards = bankResult.get("cards");
                if (cards instanceof Collection<?> collection) {
                    for (Object item : collection) {
                        if (item instanceof CreditCard creditCard) {
                            allCards.add(creditCard);
                        }
                    }
                }
            }
        } catch (Exception ex) {
            response.put("success", false);
            response.put("message", "Crawler failed to start: " + ex.getMessage());
            response.put("results", bankResults);
            response.put("cards", allCards);
            response.put("availableBanks", BANK_URLS.keySet());
            return response;
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }

        response.put("success", true);
        response.put("message", "Crawl completed for " + banksToCrawl.size() + " bank(s).");
        response.put("results", bankResults);
        response.put("cards", allCards);
        response.put("totalCards", allCards.size());
        response.put("availableBanks", BANK_URLS.keySet());
        return response;
    }

    private Map<String, Object> crawlBank(WebDriver driver, String bank, String url) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("bank", bank);
        result.put("sourceUrl", url);

        try {
            driver.get(url);
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
            wait.until(ExpectedConditions.presenceOfElementLocated(By.tagName("body")));

            String pageSource = driver.getPageSource();
            Document document = Jsoup.parse(pageSource, url);
            List<CreditCard> cards = extractCreditCards(bank, url, document);
            HtmlParser parser = new HtmlParser();
            String cleanText = parser.parseHtml(pageSource);
            crawledPages.put(bank, cleanText);

            result.put("status", "SUCCESS");
            result.put("pageTitle", driver.getTitle());
            result.put("cardCount", cards.size());
            result.put("cards", cards);
        } catch (Exception ex) {
            result.put("status", "FAILED");
            result.put("message", ex.getMessage());
            result.put("cardCount", 0);
            result.put("cards", List.of());
        }

        return result;
    }

    public Map<String, String> getCrawledPages() {
        return new LinkedHashMap<>(crawledPages);
    }

    private List<CreditCard> extractCreditCards(String bank, String sourceUrl, Document document) {
        LinkedHashMap<String, CreditCard> uniqueCards = new LinkedHashMap<>();
        Elements links = document.select(
                "a[href*='credit-card'], a[href*='credit-cards'], a[href*='cards/'], a[href*='card-details']"
        );

        for (Element link : links) {
            String name = normalize(link.text());
            String href = link.absUrl("href");

            if (!isCandidateCard(name, href, sourceUrl)) {
                continue;
            }

            uniqueCards.putIfAbsent(
                    href.isBlank() ? bank + ":" + name : href,
                    new CreditCard(bank, name, href.isBlank() ? sourceUrl : href, sourceUrl)
            );
        }

        if (uniqueCards.isEmpty()) {
            Elements headings = document.select("h1, h2, h3, h4");
            for (Element heading : headings) {
                String name = normalize(heading.text());
                if (!containsCardKeyword(name)) {
                    continue;
                }

                uniqueCards.putIfAbsent(
                        bank + ":" + name,
                        new CreditCard(bank, name, sourceUrl, sourceUrl)
                );
            }
        }

        return new ArrayList<>(uniqueCards.values());
    }

    private boolean isCandidateCard(String name, String href, String sourceUrl) {
        if (name.isBlank()) {
            return false;
        }

        String lowerName = name.toLowerCase(Locale.ENGLISH);
        String lowerHref = href.toLowerCase(Locale.ENGLISH);
        String lowerSource = sourceUrl.toLowerCase(Locale.ENGLISH);

        if (name.length() < 4 || name.length() > 120) {
            return false;
        }

        if (!lowerHref.isBlank() && !lowerHref.contains(extractHostKeyword(lowerSource))) {
            return false;
        }

        if (isNoiseName(lowerName) || isNoiseHref(lowerHref)) {
            return false;
        }

        return containsProductSignal(lowerName, lowerHref);
    }

    private boolean isNoiseName(String lowerName) {
        return lowerName.contains("learn more")
                || lowerName.contains("see details")
                || lowerName.contains("apply now")
                || lowerName.contains("compare")
                || lowerName.contains("contact")
                || lowerName.contains("support")
                || lowerName.contains("faq")
                || lowerName.contains("frequently asked questions")
                || lowerName.contains("disclaimer")
                || lowerName.contains("resource")
                || lowerName.contains("calculator")
                || lowerName.contains("statement")
                || lowerName.contains("payment")
                || lowerName.contains("protection")
                || lowerName.contains("help me choose")
                || lowerName.contains("credit card information")
                || lowerName.contains("travel cards")
                || lowerName.contains("rewards cards")
                || lowerName.contains("cash back cards")
                || lowerName.contains("low interest cards")
                || lowerName.contains("student cards")
                || lowerName.contains("business cards")
                || lowerName.equals("credit cards")
                || lowerName.equals("view all credit cards")
                || lowerName.endsWith(" cards");
    }

    private boolean isNoiseHref(String lowerHref) {
        return lowerHref.contains("#legal")
                || lowerHref.contains("language-toggle")
                || lowerHref.contains("/tools/")
                || lowerHref.contains("/cardholders/")
                || lowerHref.contains("/product-advice/")
                || lowerHref.contains("/services/")
                || lowerHref.contains("/documentation")
                || lowerHref.contains("/faq")
                || lowerHref.contains("/frequently-asked-questions")
                || lowerHref.contains("/optional-add-on-services");
    }

    private boolean containsProductSignal(String lowerName, String lowerHref) {
        return lowerName.contains("visa")
                || lowerName.contains("mastercard")
                || lowerName.contains("amex")
                || lowerName.contains("american express")
                || lowerName.contains("world elite")
                || lowerName.contains("world ")
                || lowerName.contains("infinite")
                || lowerName.contains("platinum")
                || lowerName.contains("gold")
                || lowerName.contains("cash back")
                || lowerName.contains("cashback")
                || lowerName.contains("low rate")
                || lowerName.contains("avion")
                || lowerName.contains("aeroplan")
                || lowerName.contains("passport")
                || lowerName.contains("momentum")
                || lowerName.contains("scene")
                || lowerName.contains("bonvoy")
                || lowerName.contains("dividend")
                || lowerName.contains("eclipse")
                || lowerHref.matches(".*/credit-cards?/[^/?#]+/[^/?#]+.*")
                || lowerHref.matches(".*/credit-cards?/[^/?#]+-[^/?#]+.*");
    }

    private boolean containsCardKeyword(String value) {
        String lower = value.toLowerCase(Locale.ENGLISH);
        return lower.contains("card")
                || lower.contains("visa")
                || lower.contains("mastercard")
                || lower.contains("amex")
                || lower.contains("cash back")
                || lower.contains("cashback")
                || lower.contains("rewards")
                || lower.contains("avion")
                || lower.contains("aeroplan");
    }

    private String extractHostKeyword(String sourceUrl) {
        if (sourceUrl.contains("rbcroyalbank")) {
            return "rbcroyalbank";
        }
        if (sourceUrl.contains("cibc")) {
            return "cibc";
        }
        if (sourceUrl.contains("td.com")) {
            return "td.com";
        }
        if (sourceUrl.contains("scotiabank")) {
            return "scotiabank";
        }
        if (sourceUrl.contains("bmo")) {
            return "bmo";
        }
        return "";
    }

    private String normalize(String value) {
        return value == null ? "" : value.replaceAll("\\s+", " ").trim();
    }

    private List<String> resolveBanks(List<String> requestedBanks) {
        if (requestedBanks == null || requestedBanks.isEmpty()) {
            return List.of("RBC");
        }

        for (String entry : requestedBanks) {
            if (entry == null || entry.isBlank()) {
                continue;
            }

            for (String value : entry.split(",")) {
                String normalized = value.trim().toUpperCase(Locale.ENGLISH);
                if (BANK_URLS.containsKey(normalized)) {
                    return List.of(normalized);
                }
            }
        }

        return List.of("RBC");
    }
}
