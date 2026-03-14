# Credit Card Comparison & Web Search Engine

## Overview

This project is a university group project built with:

- `Spring Boot` for the backend
- `React + Vite` for the frontend
- `Selenium + ChromeDriver` for web crawling

The system supports:

- crawling bank credit card pages
- keyword frequency counting
- search history tracking
- frontend dashboard integration

## Project Structure

```text
comparison/
|-- src/main/java/com/creditcard/comparison/
|   |-- config/
|   |-- controller/
|   |-- crawler/
|   |-- index/
|   |-- model/
|   |-- parser/
|   |-- recommendation/
|   |-- spellcheck/
|   |-- util/
|-- src/main/resources/
|   |-- application.properties
|   |-- static/
|   |   |-- frontend/
|-- data/
|-- pom.xml
|-- README.md
```

## Requirements

Install these on your PC before running the project:

- `Java JDK 21+`
- `Maven 3.9+`
- `Node.js 18+`
- `Git`
- `Google Chrome`
- `ChromeDriver`

Check installed versions:

```powershell
java -version
mvn -version
node -v
npm -v
git --version
```

## ChromeDriver Setup

This project currently uses this ChromeDriver path in the crawler:

```java
System.setProperty("webdriver.chrome.driver","C:\\chromedriver\\chromedriver.exe");
```

On a teammate PC:

1. Install ChromeDriver that matches the installed Chrome version.
2. Create folder `C:\chromedriver\`
3. Place `chromedriver.exe` inside that folder.

If the path is different on another machine, update it in:

- [WebCrawler.java](d:\Acc Proejct\comparison\src\main\java\com\creditcard\comparison\crawler\WebCrawler.java)

## Clone the Project

```powershell
git clone https://github.com/pruthvi4344/Credit-Card-Comparison-Analysis-.git
cd comparison
```

## Install Dependencies

Backend:

```powershell
mvn clean install
```

Frontend:

```powershell
cd src\main\resources\static\frontend
npm install
cd ..\..\..\..\..
```

## Run the Project

You need two terminals.

### Terminal 1: Run backend

From project root:

```powershell
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Terminal 2: Run frontend

```powershell
cd src\main\resources\static\frontend
npm run dev
```

Frontend usually runs on:

```text
http://localhost:3000
```

If Vite starts on another port, open the URL shown in the terminal.

## How to Use

1. Start backend
2. Start frontend
3. Open frontend in browser
4. First run the crawler
5. Then test frequency/search history features

Important:

- `Frequency Counter` depends on crawled page content
- `Search History` is populated after frequency/search requests

## Useful API Endpoints

```text
GET  /api/test
GET  /api/crawl?banks=RBC
GET  /api/frequency?word=cashback
GET  /api/search-frequency
```

Example:

```text
http://localhost:8080/api/frequency?word=cashback
```

## Git Workflow

Do not work directly on `main`.

Before writing code, always checkout your own branch first.

### First time setup

```powershell
git fetch origin
git checkout main
git pull origin main
git checkout -b your-name-feature
git push -u origin your-name-feature
```

### Every time before starting work

```powershell
git fetch origin
git checkout your-name-feature
git pull origin your-name-feature
```

If you need the latest `main` changes in your branch:

```powershell
git checkout main
git pull origin main
git checkout your-name-feature
git merge main
```

### Commit and push your work

```powershell
git checkout your-name-feature
git add .
git commit -m "Add frequency count feature"
git push origin your-name-feature
```

### Create Pull Request

After pushing:

1. Open GitHub
2. Create a Pull Request from your branch to `main`
3. Get it reviewed
4. Merge only through Pull Request

## Important Team Rules

- Always checkout your branch before working on code
- Never push directly to `main`
- Never commit unfinished broken code if avoidable
- Pull latest changes before starting work
- Use Pull Requests for merging to `main`

## Recommended Commands Summary

```powershell
git fetch origin
git checkout your-name-feature
git pull origin your-name-feature
```

```powershell
git add .
git commit -m "Your update message"
git push origin your-name-feature
```

## Troubleshooting

### `404` on frequency or search history

Restart the backend after pulling latest code:

```powershell
mvn spring-boot:run
```

### `Failed to fetch` in frontend

Check:

- backend is running on `localhost:8080`
- frontend is running
- no old backend instance is still running

### ChromeDriver error

Check:

- `chromedriver.exe` exists at `C:\chromedriver\chromedriver.exe`
- ChromeDriver version matches installed Chrome

## Team Note

Before starting any task:

```powershell
git checkout your-name-feature
```

Do not start coding on `main`.
