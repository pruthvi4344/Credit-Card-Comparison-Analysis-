# Study Notes: Frequency Counter, Search History, and Web Crawler

This document is for presentation and viva preparation. It explains the request flow, the main logic, the algorithms used, the files to show, and the likely questions you may get.

---

## 1. My Contribution Overview

My main backend contribution can be explained as:

- Frequency Counter
- Search History

I should also understand the Web Crawler because it is a core project feature and may be asked during demo or architecture discussion.

---

## 2. Frequency Counter: What the feature does

The Frequency Counter tells the user how many times a given word appears in the credit card dataset.

Example:

- User enters: `cashback`
- System checks the card data
- Output shows:
  - total number of occurrences
  - which cards contain that word
  - how many times it appears in each card

This feature uses the CSV dataset instead of crawling data for frequency lookup.

---

## 3. Search History: What the feature does

Search History keeps track of how many times users searched for a keyword.

Example:

- search `cashback`
- search `travel`
- search `cashback`

Stored result:

- `cashback -> 2`
- `travel -> 1`

This is useful because it shows popular search terms and can later support analytics.

---

## 4. Full User Journey for Frequency Counter

### Step 1: User enters a word in the frontend

File:

- `src/main/resources/static/frontend/src/pages/FrequencyPage.jsx`

The user types in the input box. The input value is stored in the React state variable:

- `word`

This happens here:

```jsx
onChange={e => setWord(e.target.value)}
```

If the user types `cashback`, then:

- `word = "cashback"`

### Step 2: User clicks the Count button

The button triggers:

```jsx
onClick={() => run()}
```

Inside `run()`:

```jsx
const t = (w || word).trim();
```

This means:

- if a term was passed directly, use it
- otherwise use the current `word`
- remove extra spaces

Then the frontend sends the API request:

```jsx
const data = await api.frequency(t);
```

### Step 3: Frontend calls the backend API

File:

- `src/main/resources/static/frontend/src/services/api.js`

The API call is:

```js
frequency: (word) => req(`/api/frequency?word=${encodeURIComponent(word)}`)
```

So if the user entered `cashback`, the backend receives:

```text
GET /api/frequency?word=cashback
```

### Step 4: Backend controller receives the word

File:

- `src/main/java/com/creditcard/comparison/controller/FrequencyController.java`

Method:

```java
@GetMapping("/frequency")
public Map<String, Object> getFrequency(@RequestParam("word") String word)
```

At this point:

- `word = "cashback"`

The controller now does two things:

1. update search history
2. get frequency counts

### Step 5: Search history is updated

Still in `FrequencyController.java`:

```java
frequencyCounter.updateSearchFrequency(word);
```

This calls the method in:

- `src/main/java/com/creditcard/comparison/index/FrequencyCounter.java`

Method:

```java
public void updateSearchFrequency(String keyword)
```

Logic:

1. normalize the keyword
2. check the `searchHistory` map
3. increment the counter

Code idea:

```java
searchHistory.put(normalizedKeyword, searchHistory.getOrDefault(normalizedKeyword, 0) + 1);
```

This uses:

- `HashMap<String, Integer>`

Reason:

- we only need direct lookup and count update
- HashMap is the simplest and most efficient structure for that

### Step 6: Frequency counting starts

Back in `FrequencyController.java`:

```java
Map<String, Integer> counts = frequencyCounter.countWordFrequency(word);
```

This calls:

```java
public Map<String, Integer> countWordFrequency(String keyword)
```

inside `FrequencyCounter.java`.

### Step 7: The keyword is normalized

In `FrequencyCounter.java`:

```java
String normalizedKeyword = normalizeKeyword(keyword);
```

The method:

```java
private String normalizeKeyword(String keyword) {
    if (keyword == null) {
        return "";
    }
    return keyword.toLowerCase(Locale.ENGLISH).replaceAll("[^a-z0-9]+", "").trim();
}
```

This means:

- convert to lowercase
- remove punctuation
- standardize the input

Examples:

- `CashBack` -> `cashback`
- `cash-back` -> `cashback`

This prevents mismatch due to case or punctuation.

### Step 8: The system does not scan the CSV every time

This is the most important part of your explanation.

The frequency feature uses a **prebuilt frequency index**.

That index is created once at startup in:

```java
@PostConstruct
public void buildFrequencyIndex()
```

So search requests are faster because the data is already organized.

### Step 9: How the frequency index is built

In `buildFrequencyIndex()`:

1. get all cards from CSV using `CardCatalogService`
2. combine important text fields into one string
3. split the text into words
4. count words per card
5. store them in the main index

Relevant fields combined:

- title
- annual fee
- purchase interest rate
- cash interest rate
- product value proposition
- product benefits
- bank

This code builds the combined text:

```java
String combinedText = String.join(" ",
    safe(card.getTitle()),
    safe(card.getAnnualFees()),
    safe(card.getPurchaseInterestRate()),
    safe(card.getCashInterestRate()),
    safe(card.getProductValueProp()),
    safe(card.getProductBenefits()),
    safe(card.getBank())
).toLowerCase(Locale.ENGLISH);
```

Then words are split like this:

```java
String[] words = combinedText.split("[^a-z0-9]+");
```

This removes punctuation and separators.

Then per-card word counts are stored in:

```java
Map<String, Integer> perCardCounts = new HashMap<>();
```

Finally, those counts are inserted into the global frequency index:

```java
frequencyIndex
    .computeIfAbsent(entry.getKey(), ignored -> new LinkedHashMap<>())
    .put(cardKey, entry.getValue());
```

### Step 10: Actual frequency index structure

Conceptually, the structure is:

```text
word -> (card -> count)
```

Example:

```text
"cashback" -> {
   "RBC Cash Back Mastercard||url1" -> 3,
   "BMO CashBack Card||url2" -> 2
}
```

So when the user searches `cashback`, the backend directly looks up:

- `frequencyIndex.get("cashback")`

instead of re-reading the full CSV.

### Step 11: The result is returned to the controller

The method returns:

```java
Map<String, Integer>
```

where:

- key = card key
- value = occurrence count

### Step 12: Controller builds the API response

In `FrequencyController.java`, each result is converted into a frontend-friendly object.

For each card:

- get the count
- get the card details using `getCardByKey(...)`
- build a JSON response entry

The response includes:

- title
- bank
- url
- annual fees
- count

Then the final API response includes:

- searched word
- total count
- page/card results

### Step 13: Frontend displays the result

Back in `FrequencyPage.jsx`, the result is stored in:

```jsx
setResult({ word: t, count, pages });
```

The frontend shows:

- total occurrences
- number of matched items
- per-card breakdown

---

## 5. Frequency Counter Algorithm Used

### Final Algorithm

- HashMap-based preprocessed frequency index

### Why this was chosen

- Frequency lookup is an exact-word search problem
- HashMap gives fast direct access by key
- It is simpler and more suitable than Trie for exact counting

### Compared idea

- HashMap vs Trie

### Why Trie was not chosen

- Trie is better for prefix matching
- Frequency counter needs exact word lookup, not prefix suggestion

---

## 6. Search History Algorithm Used

### Final Algorithm

- HashMap with increment-based counting

### Why this was chosen

- each searched keyword just needs:
  - exact lookup
  - count increment

This is efficient and easy to maintain.

---

## 7. Files to Show for My Contribution

These are the best files to open during explanation.

### Main backend files

1. `src/main/java/com/creditcard/comparison/index/FrequencyCounter.java`

Show:

- `buildFrequencyIndex()`
- `countWordFrequency(...)`
- `updateSearchFrequency(...)`
- `displaySearchHistory()`

This is the most important file for your contribution.

2. `src/main/java/com/creditcard/comparison/controller/FrequencyController.java`

Show:

- `getFrequency(...)`
- `getSearchFrequency()`

This proves how the request enters the backend.

3. `src/main/resources/data/credit_cards.csv`

Show:

- this is the actual dataset used to build the frequency index

### Support files if needed

4. `src/main/resources/static/frontend/src/pages/FrequencyPage.jsx`

Show:

- input state
- `run()` function
- how frontend calls the API

5. `src/main/resources/static/frontend/src/services/api.js`

Show:

- `/api/frequency`
- `/api/search-frequency`

---

## 8. Simple Speaking Version for Frequency Counter

Use this in presentation:

> My contribution was Frequency Counter and Search History.  
> When the user enters a keyword on the frontend, the request goes to the frequency API in the backend.  
> The controller first updates the search history count, then calls the frequency counter service.  
> The frequency counter uses a prebuilt HashMap index created from the CSV dataset at application startup.  
> Instead of scanning the full dataset every time, it directly looks up the keyword and returns occurrence counts for each matching card.  
> The result is then shown in the frontend as total occurrences and per-card breakdown.

---

## 9. Web Crawler: What the feature does

The Web Crawler fetches credit card data from supported bank websites.

Supported banks in the current code:

- RBC
- CIBC
- TD
- SCOTIA
- BMO

The crawler:

1. opens the bank website
2. collects likely card links
3. visits each card detail page
4. extracts card information
5. stores results for the frontend

This feature uses:

- Selenium WebDriver
- ChromeDriver
- JSoup

---

## 10. Full Web Crawler Journey

### Step 1: Frontend requests crawling

The frontend calls:

```text
GET /api/crawl
```

or

```text
GET /api/crawl?banks=RBC
```

### Step 2: CrawlController receives the request

File:

- `src/main/java/com/creditcard/comparison/controller/CrawlController.java`

Method:

```java
@GetMapping("/crawl")
public Map<String, Object> crawl(@RequestParam(required = false) List<String> banks)
```

This passes the bank list to:

```java
webCrawler.startCrawling(banks);
```

### Step 3: WebCrawler decides which bank to crawl

File:

- `src/main/java/com/creditcard/comparison/crawler/WebCrawler.java`

Method:

```java
public Map<String, Object> startCrawling(List<String> requestedBanks)
```

It resolves the requested bank with:

- `resolveBanks(...)`

Current behavior:

- if no bank is given, it defaults to `RBC`
- only one bank is crawled at a time

### Step 4: Selenium browser session starts

Inside `startCrawling(...)`:

- `webdriver.chrome.driver` is configured
- `ChromeOptions` are set
- `ChromeDriver` is launched in headless mode

This allows the crawler to open real bank pages, including pages that rely on browser rendering.

### Step 5: The crawler opens the bank page

Method:

- `crawlBank(...)`

It does:

1. `driver.get(url)`
2. waits for page body to load
3. grabs the page source
4. parses it with JSoup

This is the point where Selenium and JSoup work together:

- Selenium loads the page
- JSoup parses the HTML

### Step 6: The crawler extracts likely credit card links

Method:

- `extractCreditCards(...)`

The crawler first looks for links that likely point to credit card products:

```java
"a[href*='credit-card'], a[href*='credit-cards'], a[href*='cards/'], a[href*='card-details']"
```

This is a heuristic approach.

Then each link is checked using:

- `isCandidateCard(...)`

This removes noisy links like:

- compare
- FAQ
- support
- learn more
- calculator
- legal/disclaimer pages

The crawler keeps links that contain product signals such as:

- Visa
- Mastercard
- Infinite
- Platinum
- Gold
- Cash Back
- Avion
- Aeroplan

### Step 7: Base card objects are created

For every good candidate, a `CreditCard` object is created with:

- bank
- card name
- details URL
- source URL

Class:

- `src/main/java/com/creditcard/comparison/model/CreditCard.java`

### Step 8: Detail-page enrichment begins

Method:

- `enrichCardsFromDetails(...)`

This loops through the extracted cards and visits each detail page to get richer information.

The code comments already describe it correctly:

- listing pages often do not contain all fields
- detail pages contain more structured information

### Step 9: Detail page fields are scraped

Method:

- `scrapeCardDetails(...)`

For each card, the crawler tries to extract:

- image URL
- annual fees
- purchase interest rate
- cash interest rate
- product value proposition
- product benefits

How fields are extracted:

- `extractImageUrl(...)`
- `findFirstMatch(...)`
- `extractValueProp(...)`
- `extractBenefits(...)`

The regular-expression-based extraction is mainly used for fee and interest values.

### Step 10: Cache is used to avoid repeated scraping

The crawler stores detail-page results in:

- `cardDetailsCache`

Type:

- `ConcurrentHashMap`

Why:

- if the same detail URL appears again, it does not scrape the same page again
- this saves time and reduces repeated work

### Step 11: Catalog fallback fills missing values

Method:

- `enrichCardFromCatalog(...)`

If some scraped fields are missing, the crawler tries to match that card against the CSV catalog using:

- `CardCatalogService.findBestMatch(...)`

Then missing fields are filled from CSV:

- image
- fees
- rates
- value proposition
- benefits

So the crawler is not fully dependent on CSV, but CSV still acts as a fallback for incomplete scraping.

### Step 12: Crawled page text is stored

In `crawlBank(...)`:

```java
crawledPages.put(bank, document.text());
```

This stores the visible page text by bank, which can support other features.

### Step 13: Final crawl result is returned

The backend response includes:

- success status
- page title
- card count
- card list
- total cards

This data is then displayed by the frontend crawler page.

---

## 11. Web Crawler Algorithm and Design Choice

### Main approach

- Selenium + JSoup + heuristic filtering + detail-page enrichment

### Why this approach works

- bank sites are different and often dynamic
- Selenium is useful for loading the real rendered page
- JSoup is good for parsing HTML
- heuristic filtering helps remove noisy links
- detail-page enrichment gets richer card data

### Important note

This is not a strict graph crawler or BFS-style web crawler.
It is a **targeted domain crawler** focused on supported bank credit card pages.

That is the correct way to describe it in your report or viva.

---

## 12. Files to Show for Web Crawler

Main files:

1. `src/main/java/com/creditcard/comparison/controller/CrawlController.java`
2. `src/main/java/com/creditcard/comparison/crawler/WebCrawler.java`
3. `src/main/java/com/creditcard/comparison/model/CreditCard.java`
4. `src/main/java/com/creditcard/comparison/service/CardCatalogService.java`

If asked about frontend:

5. `src/main/resources/static/frontend/src/pages/CrawlerPage.jsx`
6. `src/main/resources/static/frontend/src/services/api.js`

---

## 13. Exception Handling in the Project

The project now includes centralized backend exception handling.

Files:

- `src/main/java/com/creditcard/comparison/exception/GlobalExceptionHandler.java`
- `src/main/java/com/creditcard/comparison/exception/ApiErrorResponse.java`
- `src/main/java/com/creditcard/comparison/exception/BadRequestException.java`
- `src/main/java/com/creditcard/comparison/exception/ResourceProcessingException.java`

What it does:

- invalid input returns `400 Bad Request`
- processing failure returns `500 Internal Server Error`
- the API returns a standard JSON error structure

Why this matters:

- backend errors are consistent
- easier to debug
- safer than returning ad hoc messages

Also note:

- some frontend pages still use preventive validation
- for example, the Frequency page blocks empty input before request
- so backend exception handling exists even if UI does not always trigger it

---

## 14. Likely Viva Questions and Answers

### Q1. Why did you use HashMap for frequency count?

Answer:

Because this feature needs exact keyword lookup and counting. HashMap gives direct access by key and is more suitable than Trie for exact frequency queries.

### Q2. Why not Trie for frequency count?

Answer:

Trie is better for prefix-based search like autocomplete. Frequency counting is an exact-word lookup problem, so HashMap is the better choice.

### Q3. What is the data source for frequency count?

Answer:

The data source is `credit_cards.csv` stored in the resources folder.

### Q4. Does frequency search scan the CSV every time?

Answer:

No. The frequency index is built once at startup using `@PostConstruct`. After that, queries directly look up the word from the precomputed index.

### Q5. How is search history stored?

Answer:

Search history is stored in a `HashMap<String, Integer>`, where the key is the keyword and the value is the search count.

### Q6. What happens when the same keyword is searched again?

Answer:

Its count is incremented by one in the search history map.

### Q7. What is the crawler doing exactly?

Answer:

It opens a supported bank page using Selenium, parses the loaded HTML using JSoup, filters likely card links, visits detail pages, extracts card attributes, and returns the structured results.

### Q8. Why use Selenium and JSoup together?

Answer:

Selenium loads dynamic pages like a real browser, while JSoup is better for parsing the resulting HTML and extracting content.

### Q9. Is the crawler fully independent from CSV?

Answer:

Mostly yes for crawling, but CSV is still used as a fallback to fill missing attributes when detail-page extraction is incomplete.

---

## 15. Very Short Presentation Script

> My contribution was Frequency Counter and Search History.  
> In the frontend, the user enters a keyword, and the request goes to the frequency API.  
> In the backend controller, I first update the search history counter and then call the frequency logic.  
> The frequency logic uses a prebuilt HashMap index from the CSV dataset, so it does not rescan all card data every time.  
> It returns the total occurrences and per-card counts, which are displayed in the UI.  
> I also understand the crawler flow: it uses Selenium to load bank pages, JSoup to parse HTML, heuristic filtering to find likely credit card links, and detail-page enrichment to extract full card information.

---

## 16. Best Order to Explain in Demo

For your part:

1. `FrequencyPage.jsx`
2. `api.js`
3. `FrequencyController.java`
4. `FrequencyCounter.java`
5. `credit_cards.csv`

For crawler:

1. `CrawlController.java`
2. `WebCrawler.java`
3. `CreditCard.java`
4. `CardCatalogService.java`

---

## 17. Final One-Line Summary

The frequency module uses a HashMap-based precomputed index for fast exact word counting and search history tracking, while the crawler uses Selenium and JSoup to collect and enrich credit card data from supported bank websites.
