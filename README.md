# Family Finance Dashboards

A suite of four browser-based personal finance tools for tracking groceries, expenses, budgets, and net worth. No backend, no subscriptions — runs entirely in the browser with data stored locally.

**Live:** https://allagilejobs-jpg.github.io/Monthly/

---

## Dashboards

### Grocery Dashboard
Track grocery and household spending by store, category, product, and trip. Upload monthly Excel files with itemized receipt data for rich breakdowns and month-over-month comparison.

### All Expenses Dashboard
Import bank and credit card statements (CSV, PDF, Excel) to track all household spending. Auto-detects bank format (Chase, Bank of America, Wells Fargo, Capital One, Citi) and auto-categorizes transactions across 19 categories.

### Receipt Scanner
Scan grocery receipt photos using offline OCR (Tesseract.js). Bulk upload up to 100 images, review extracted items, then export to Excel or import directly into the Grocery Dashboard.

### Budget Dashboard
Plan monthly budgets, enter transactions manually, track income vs expenses with Budget vs Actual ratings, monitor bank accounts, and view net worth trends over time. Supports optional bank statement upload.

---

## Features

- Dark/light theme toggle
- Mobile-responsive design
- Demo mode with sample data (no sign-up required)
- Firebase authentication with cloud sync
- Multi-month data with Compare views
- Global search, smart insights, anomaly detection
- Clickable charts that drill down into filtered views
- Excel import/export across all dashboards

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML, CSS, JavaScript |
| Charts | Chart.js 4.4.7 |
| Excel | SheetJS 0.18.5 / ExcelJS 4.4.0 |
| PDF Parsing | PDF.js 3.11.174 |
| OCR | Tesseract.js 5.x |
| Auth & Sync | Firebase 11.4.0 (Auth + Firestore) |
| Hosting | GitHub Pages |

No build tools, no frameworks, no npm — just static files served from GitHub Pages.

---

## Project Structure

```
├── index.html              Landing page
├── Groceries/index.html    Grocery Dashboard
├── Expenses/index.html     All Expenses Dashboard
├── Scanner/index.html      Receipt Scanner
├── Budget/index.html       Budget Dashboard
├── css/                    Extracted stylesheets
├── js/                     Extracted JavaScript
├── demo-data.js            Shared demo data & utilities
├── firebase-sync.js        Shared Firebase auth & sync
├── PRD.md                  Product requirements
├── ARCHITECTURE.md         Technical architecture
└── CHANGELOG.md            Commit history
```

---

## Getting Started

**Try the demo** — no setup needed:
https://allagilejobs-jpg.github.io/Monthly/

Click any demo button on the landing page to explore with sample data.

**Run locally:**
1. Clone the repo
2. Open `index.html` in a browser (or use any local server)
3. No install or build step required

---

## Documentation

- [PRD.md](PRD.md) — Product requirements and feature specs
- [ARCHITECTURE.md](ARCHITECTURE.md) — Technical architecture, data models, and design decisions
- [CHANGELOG.md](CHANGELOG.md) — Detailed commit history and refactoring notes
