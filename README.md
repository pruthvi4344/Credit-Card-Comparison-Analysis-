# 💳 Credit Card Comparison Analysis

## 📌 Project Overview

This project analyzes and compares different **credit card offerings** from multiple providers (CIBC, RBC, TD, Scotiabank, Capital One, etc.).
It extracts data using a **web crawler**, processes and indexes information, and recommends the best credit card based on user preferences.

This is a **Java (Spring Boot) backend project** developed as a group assignment for applying data structures and algorithms in a real system.

---

## 🛠 Technologies Used

* Java (Latest LTS)
* Spring Boot
* Maven
* JSoup (HTML Parsing)
* Git & GitHub
* VS Code / Eclipse

---

## 📁 Project Structure

```
comparison/
│
├── src/main/java/com/creditcard/comparison/
│   ├── controller/        # REST APIs
│   ├── crawler/           # Web crawling logic
│   ├── parser/            # HTML parsing & extraction
│   ├── index/             # Inverted index & search
│   ├── recommendation/    # Recommendation engine
│   ├── spellcheck/        # Spell checking
│   ├── model/             # Data models
│   ├── util/              # Utilities & regex validation
│   └── ComparisonApplication.java
│
├── src/main/resources/
│   └── application.properties
│
├── data/                  # Crawled HTML / extracted text
├── pom.xml
└── README.md
```

---

## ⚙️ Requirements

Make sure the following are installed:

* Java (JDK 21 or latest) → `java -version`
* Maven → `mvn -version`
* Git
* VS Code

---

## 🚀 Setup Instructions (For Team Members)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/pruthvi4344/Credit-Card-Comparison-Analysis-.git
cd comparison
```

---

### 2️⃣ Install Dependencies

```bash
mvn clean install
```

---

### 3️⃣ Run Project

```bash
mvn spring-boot:run
```

---

### 4️⃣ Open in Browser

```
http://localhost:8080
```

You should see:

```
Credit Card Comparison System is Running 🚀
```

---

## 🌐 GitHub Workflow (Important)

### Create Your Branch

all the branches are created for all members

```bash
git checkout -b feature-name
```

### Commit & Push

```bash
git add .
git commit -m "Feature update"
git push origin feature-name
```

Then create **Pull Request → Merge to main**
---

## 🧪 Testing

```bash
mvn test

---

## ⭐ Notes

* Each member must work in **separate branch**
* Do NOT push directly to `main`
* Always pull latest changes before working:

```bash
git pull origin main
```

---
