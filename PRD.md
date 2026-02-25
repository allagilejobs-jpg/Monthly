# Product Requirements Document — Family Finance Dashboards

## Overview

Family Finance Dashboards is a suite of four web-based personal finance tools designed for family use. The application runs entirely in the browser with no backend server — data is stored in localStorage per device, with optional Firebase cloud sync for authenticated users. The dashboards are hosted on GitHub Pages as static HTML files.

**Live URL:** https://allagilejobs-jpg.github.io/Monthly/
**Repository:** https://github.com/allagilejobs-jpg/Monthly

---

## Problem Statement

Managing family finances across grocery shopping, general expenses, and budgeting is fragmented. Spreadsheets work but lack interactivity, visualization, and month-over-month comparison. Existing finance apps require subscriptions, share data with third parties, or don't match the family's specific categorization needs.

## Solution

A free, self-hosted, privacy-first finance dashboard suite that:
- Runs entirely in the browser (no server, no subscriptions)
- Keeps data on-device by default (optional cloud sync)
- Provides rich visualizations and drill-downs
- Supports multiple input methods (Excel upload, CSV/PDF bank statements, receipt scanning, manual entry)
- Works on desktop and mobile

---

## Products

### 1. Grocery Dashboard (V1)

**Purpose:** Track grocery and household spending by store, category, product, and trip.

**Input:** Monthly Excel files with itemized receipt data (Date, Store, Product, Category, Qty, Price, etc.)

**Core Features:**
- 8 tabs: Overview, Groceries, Toiletries, By Store, Trends, Trips, All Items, Compare
- KPI cards: total spend, item count, trip count, averages
- Clickable pie/doughnut/bar charts that filter to relevant data
- Trip view with individual receipt breakdowns
- Product detail view with price tracking across stores
- Category drill-down with daily spending charts
- Global search across products, stores, and categories
- Smart insights (9 auto-generated observations)
- Anomaly detection (unusual prices via z-score)
- Recurring purchase detection
- Spending streaks calendar heatmap
- Edit modal for recategorizing items (persisted in localStorage)
- Multi-month upload with Compare tab for month-over-month analysis
- Data manager for viewing/deleting stored months

**Accent Color:** Green (`#22c55e`)

### 2. All Expenses Dashboard (V2)

**Purpose:** Track all household spending from bank and credit card statements.

**Input:** CSV, PDF, or Excel bank/credit card statements. Auto-detects bank format (Chase, Bank of America, Wells Fargo, Capital One, Citi, generic).

**Core Features:**
- 6 tabs: Overview, By Category, By Merchant, Trends, All Transactions, Compare
- Auto-categorization with ~100 keyword rules + user-learned rules
- Merchant name cleaning (strips reference numbers, card suffixes, title-cases)
- 19 expense categories (Housing, Utilities, Groceries, Dining, Transportation, etc.)
- Merchant detail view with transaction history
- Category drill-down with daily chart and merchant breakdown
- Global search across merchants, categories, transactions
- Smart insights and anomaly detection
- Recurring expense detection (subscriptions, regular payments)
- 3-step upload modal: choose format, select file, review/preview, import
- Edit modal with "apply to all" and "remember rule" options
- Multi-month support with Compare tab

**Accent Color:** Blue (`#3b82f6`)

### 3. Receipt Scanner

**Purpose:** Scan grocery receipt photos using OCR, extract line items, and export to Excel or import directly into the Grocery Dashboard.

**Input:** Receipt photos (JPG, PNG, HEIC, WebP, BMP, TIFF) — supports bulk upload of up to 100 images.

**Core Features:**
- 4-step wizard: Upload, Processing, Review, Export
- Drag-and-drop bulk upload with thumbnail previews
- Offline OCR via Tesseract.js 5.x with image preprocessing (grayscale, contrast, threshold)
- Optional Gemini AI Vision for enhanced scanning
- Store detection from 20+ patterns (Walmart, Publix, Target, Costco, etc.)
- Abbreviation dictionary (~200 pre-seeded + fuzzy matching + learns from corrections)
- 22-category assignment matching Grocery Dashboard categories
- Per-receipt review with inline editing and low-confidence flags
- Excel export with 6 styled sheets (via ExcelJS)
- Direct dashboard import with merge/replace option

**Accent Color:** Orange (`#f97316`)

### 4. Budget Dashboard (V3)

**Purpose:** Plan monthly budgets, track income and expenses vs goals, monitor bank accounts and net worth.

**Input:** Manual entry via forms + optional Excel import + optional bank statement upload (CSV/PDF/Excel).

**Core Features:**
- 6 tabs: Setup, Monthly Tracker, Bank Accounts, Annual Overview, Trends, Net Worth
- **Setup:** yearly budget configuration with 18 standard + 25 extra category slots, income sources, savings/investment/debt accounts, big annual expenses, computed totals
- **Monthly Tracker:** transaction CRUD, 4 KPIs (budget/spent/remaining/% used), Budget vs Actual table with progress bars and color-coded ratings (Under/On/Over), income tracker, spending pie chart, transaction search/filter
- **Bank Accounts:** account CRUD (Checking/Savings/Investing/Credit Card/Loan/Other), monthly balance snapshots, copy-from-previous-month, 3 KPIs
- **Annual Overview:** 12-month computed grid with income/savings/expenses sections, summary totals, Income vs Expenses trend chart, category stacked bar
- **Trends:** daily spending chart, cumulative spending, category trends, top categories, day-of-week analysis, anomaly detection, recurring expense detection
- **Net Worth:** computed from Bank Accounts across months, net worth trend line, investment trend, account type breakdown doughnut
- Bulk statement upload modal (multi-file, auto-format detection)
- Excel import/export matching Budget Template V3.xlsx format

**Accent Color:** Purple (`#a855f7`)

---

## Shared Features (All Dashboards)

### Theme Toggle
- Dark mode by default (dark background, light text)
- Light mode toggle (persisted in localStorage per dashboard)

### Demo Mode
- Accessible from landing page without sign-up
- In-memory data store (`_demoStore`) — no localStorage writes
- Purple/green/blue banner indicating demo mode
- "Upgrade" prompts when users try to upload/edit in demo mode
- Sample data: 2 months of realistic transactions per dashboard

### Authentication & Cloud Sync
- Firebase Authentication (email/password + Google sign-in)
- Firestore cloud sync for authenticated users
- Auth gate overlay on dashboards with sign-in/sign-up forms
- Sync prefixes define which localStorage keys replicate to cloud
- Device-specific keys (theme, scanner settings) excluded from sync

### Navigation
- Landing page with 4-card hub (2x2 grid)
- Header links between all dashboards
- Footer links on every dashboard
- Demo mode link transformation (appends `?demo=true`)

### Mobile Responsiveness
- CSS breakpoints at 900px and 480px
- Responsive tables with horizontal scroll
- Touch-friendly button sizes
- Compact headers and tabs on mobile
- Responsive demo banner height

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Hosting | GitHub Pages (static files, no server) |
| Build tools | None — vanilla HTML/CSS/JS |
| Frameworks | None — CDN-loaded libraries only |
| Data storage | localStorage (default), Firestore (authenticated) |
| Privacy | All processing client-side, no data sent to servers (except optional Firebase sync and optional Gemini API) |
| Browser support | Modern browsers (Chrome, Firefox, Safari, Edge) |
| Offline capability | Full functionality offline (except cloud sync and Gemini OCR) |
| Performance | Instant load, no build step, CDN-cached libraries |

---

## CDN Dependencies

| Library | Version | Used By | Purpose |
|---------|---------|---------|---------|
| Chart.js | 4.4.7 | All dashboards | Charts and visualizations |
| SheetJS (xlsx) | 0.18.5 | Groceries, Expenses, Budget | Excel file parsing |
| PDF.js | 3.11.174 | Expenses, Budget | PDF bank statement parsing |
| ExcelJS | 4.4.0 | Scanner | Styled Excel export |
| Tesseract.js | 5.x | Scanner | Offline OCR |
| Firebase | 11.4.0 | All | Auth + Firestore sync |

---

## User Personas

### Primary: Family Finance Manager
- Tracks monthly grocery spending in detail
- Uploads bank statements monthly to monitor all expenses
- Sets monthly budget targets and monitors progress
- Wants month-over-month comparisons and trends
- Prefers dark-themed, data-rich dashboards

### Secondary: Quick Scanner
- Takes photos of receipts after shopping trips
- Bulk uploads and processes receipt images
- Exports to Excel for record-keeping or imports into Grocery Dashboard

---

## Success Metrics

- All 4 dashboards functional with demo data
- Excel/CSV/PDF import working for supported bank formats
- Receipt OCR producing usable item extraction
- Budget vs Actual tracking with color-coded ratings
- Month-over-month comparison across all dashboards
- Mobile-responsive layouts at all breakpoints
- Cloud sync working for authenticated users
