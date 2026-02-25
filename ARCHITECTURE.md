# Architecture — Family Finance Dashboards

## Project Structure

```
Monthly/
├── index.html                  # Landing page (4-card hub)
├── demo-data.js                # Shared demo data + demo mode utilities
├── firebase-sync.js            # Shared Firebase auth + Firestore sync
│
├── Groceries/
│   └── index.html              # V1 Grocery Dashboard (HTML structure)
├── Expenses/
│   └── index.html              # V2 All Expenses Dashboard (HTML structure)
├── Scanner/
│   └── index.html              # Receipt Scanner (HTML structure)
├── Budget/
│   └── index.html              # V3 Budget Dashboard (HTML structure)
│
├── css/
│   ├── groceries.css           # V1 styles (~479 lines)
│   ├── expenses.css            # V2 styles (~425 lines)
│   ├── scanner.css             # Scanner styles (~169 lines)
│   └── budget.css              # V3 styles (~370 lines)
│
├── js/
│   ├── groceries.js            # V1 logic (~2,419 lines)
│   ├── expenses.js             # V2 logic (~2,059 lines)
│   ├── scanner.js              # Scanner logic (~1,364 lines)
│   └── budget.js               # V3 logic (~2,811 lines)
│
├── PRD.md                      # Product requirements document
├── ARCHITECTURE.md             # This file
├── CHANGELOG.md                # Commit history and refactoring notes
├── README.md                   # Repository readme
│
├── January_2026_Dashboard.html # Legacy V1 copy (deprecated)
└── expenses.html               # Legacy V2 copy (deprecated)
```

---

## Design Principles

1. **No build step** — Vanilla HTML/CSS/JS only. No npm, webpack, or transpilation.
2. **No backend** — All data processing happens client-side. No server required.
3. **Self-contained dashboards** — Each dashboard's HTML is the entry point, loading its own CSS and JS from shared directories.
4. **CDN dependencies** — All libraries loaded from CDN (Chart.js, SheetJS, PDF.js, Tesseract.js, Firebase, ExcelJS).
5. **Privacy-first** — Data stays in localStorage by default. Cloud sync is opt-in via Firebase auth.
6. **Progressive enhancement** — Works offline. Cloud sync, Gemini AI, and demo mode are additive features.

---

## Script Load Order

Each dashboard HTML loads scripts in this order:

```
1. CDN Libraries (Chart.js, XLSX, PDF.js, etc.)
2. demo-data.js          → defines DEMO_MODE, demo data, demoGet/demoSet, injectDemoBanner
3. [dashboard].css       → via <link> in <head>
4. [dashboard].js        → via <script> before </body>
5. firebase-sync.js      → loaded last, injects auth UI into .header
```

This order matters because:
- `demo-data.js` defines `DEMO_MODE` and `_demoStore` which the dashboard JS checks on init
- Dashboard JS defines rendering functions before Firebase calls `syncFromCloud()` which triggers re-render
- `firebase-sync.js` injects auth buttons into the `.header` div defined in the HTML

---

## Data Architecture

### Storage Layer

All dashboards use a common storage abstraction:

```javascript
function _get(key) {
  if (_isDemo) return demoGet(key);     // in-memory store
  return localStorage.getItem(key);      // persistent store
}
function _set(key, value) {
  if (_isDemo) { demoSet(key, value); return; }
  localStorage.setItem(key, value);
}
```

This allows demo mode to operate identically to normal mode without touching localStorage.

### localStorage Key Schema

#### Grocery Dashboard (V1)
| Key | Shape | Description |
|-----|-------|-------------|
| `grocery_months` | `["2026_01", "2026_02"]` | List of uploaded months |
| `grocery_activeMonth` | `"2026_01"` | Currently selected month |
| `data_{mk}` | `[{d, s, r, n, c, q, u, t, ng}, ...]` | Raw item data per month |
| `edits_{mk}` | `{"idx": {n, c, ng}, ...}` | Item edits per month |
| `grocery_theme` | `"dark"` / `"light"` | Theme preference (not synced) |

#### Expenses Dashboard (V2)
| Key | Shape | Description |
|-----|-------|-------------|
| `expenses_months` | `["2026_01", "2026_02"]` | List of imported months |
| `expenses_activeMonth` | `"2026_01"` | Currently selected month |
| `expenses_data_{mk}` | `[{id, date, description, merchant, category, amount, source, bank}, ...]` | Transactions per month |
| `expenses_edits_{mk}` | `{"id": {category, merchant}, ...}` | Transaction edits per month |
| `expenses_categoryRules` | `{"merchant": "category", ...}` | Learned categorization rules |
| `expenses_theme` | `"dark"` / `"light"` | Theme preference (not synced) |

#### Budget Dashboard (V3)
| Key | Shape | Description |
|-----|-------|-------------|
| `budget_setup` | `{year, startMonth, categories: [{group, name, budget}], income: [{name, amount}], savings: [{name, amount}], bigExpenses: [{name, amount}]}` | Yearly budget config |
| `budget_months` | `["2026_01", "2026_02"]` | List of created months |
| `budget_activeMonth` | `"2026_01"` | Currently selected month |
| `budget_data_{mk}` | `[{id, date, category, description, paymentMethod, amount}, ...]` | Transactions per month |
| `budget_income_{mk}` | `{salary: {amount, date, desc}, sources: [...], other: [...]}` | Income per month |
| `budget_accounts_{mk}` | `[{id, type, name, amount, interestRate, notes}, ...]` | Account snapshots per month |
| `budget_theme` | `"dark"` / `"light"` | Theme preference (not synced) |

#### Scanner
| Key | Shape | Description |
|-----|-------|-------------|
| `scanner_abbrevDict` | `{"abbrev": "full name", ...}` | Learned abbreviation dictionary |
| `scanner_geminiKey` | `"API_KEY"` | Gemini API key (not synced) |
| `scanner_mode` | `"standard"` / `"gemini"` | Scan mode preference (not synced) |

---

## Firebase Sync Architecture

### Sync Flow

```
localStorage ──write──→ syncToCloud() ──→ Firestore (users/{uid}/data/{key})
                                              │
Firestore ──onSnapshot──→ syncFromCloud() ──→ localStorage ──→ re-render
```

### Sync Rules

```javascript
// Keys that sync (by prefix match)
const SYNC_PREFIXES = [
  'grocery_months', 'grocery_activeMonth', 'data_', 'edits_',
  'expenses_months', 'expenses_activeMonth', 'expenses_data_', 'expenses_edits_', 'expenses_categoryRules',
  'scanner_abbrevDict',
  'budget_setup', 'budget_months', 'budget_activeMonth', 'budget_data_', 'budget_income_', 'budget_accounts_'
];

// Keys that NEVER sync (device-specific)
const NO_SYNC = ['grocery_theme', 'expenses_theme', 'budget_theme', 'scanner_mode', 'scanner_geminiKey', 'backup_data_'];
```

### Auth Gate
- Non-authenticated users see a semi-transparent overlay (95% opacity) with sign-in/sign-up forms
- Demo mode bypasses the auth gate entirely
- Auth UI is injected into the `.header` div by `firebase-sync.js`

---

## Demo Mode Architecture

### Activation Flow

```
Landing page → "Groceries Demo" button
  → sessionStorage.demo_mode = 'true'
  → redirect to /Groceries/?demo=true
    → demo-data.js detects ?demo=true → sets DEMO_MODE = true
    → seedDemoStore() populates _demoStore with sample data
    → dashboard JS reads _isDemo = true, uses demoGet/demoSet
    → injectDemoBanner() adds colored banner at top
    → demofyLinks() adds ?demo=true to navigation links
```

### Demo Data Store

```javascript
var _demoStore = {};               // in-memory key-value store
var DEMO_MODE = (URL has ?demo) || (sessionStorage.demo_mode === 'true');

function demoGet(key) { return _demoStore[key] || null; }
function demoSet(key, val) { _demoStore[key] = val; }
function demoRemove(key) { delete _demoStore[key]; }
```

### Demo Data Contents
- **DEMO_GROCERY_DATA**: 2 months, ~146 items with realistic grocery data
- **DEMO_EXPENSES_DATA**: 2 months, ~50 transactions across 19 categories
- **DEMO_BUDGET_DATA**: setup config + 2 months of transactions, income, and 4 bank accounts

### Demo Guards
- Upload/import actions show `showDemoUpgradePrompt()` modal instead of executing
- Data manager blocked in demo mode
- `_set()` and `_remove()` write to `_demoStore` only (no localStorage)
- Banner links to `/?signup=true` for conversion

---

## Dashboard Architecture Pattern

All four dashboards follow the same SPA pattern:

### Tab-Based Navigation

```javascript
function showView(id) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // Show selected view
  document.getElementById('view-' + id).classList.add('active');
  // Update tab highlight
  tabs[tabIndex].classList.add('active');
  // Render the view
  renderFunctions[id]();
}
```

### Month Context

```javascript
function buildMonthContext(monthKey) {
  // monthKey format: "YYYY_MM" (e.g., "2026_01")
  return {
    year: 2026, month: 1,
    monthName: "January", monthAbbr: "Jan",
    monthKey: "2026_01",
    daysInMonth: 31
  };
}
```

### Chart Management

```javascript
let charts = {};  // all active Chart.js instances

function destroyAllCharts() {
  Object.values(charts).forEach(c => c.destroy());
  charts = {};
}
// Called before re-rendering to prevent canvas reuse errors
```

### Render Pipeline

```
switchMonth(mk)
  → update ctx (month context)
  → load data from storage
  → destroyAllCharts()
  → renderAll()
    → renderOverview()    → KPIs + charts
    → renderCategories()  → tables + charts
    → renderTrends()      → time-series charts
    → render...()         → tab-specific content
```

---

## File Parsing Architecture

### V1 (Groceries) — Excel Only

```
Excel file → SheetJS → find "All Transactions" sheet → map rows to {d, s, r, n, c, q, u, t, ng}
```

### V2 (Expenses) — CSV, PDF, Excel

```
CSV:   text → detectBank(headers) → bank-specific column mapping → [{id, date, description, merchant, category, amount}]
PDF:   ArrayBuffer → PDF.js → text extraction → regex line matching → same output
Excel: ArrayBuffer → SheetJS → flexible header matching → same output
```

Bank detection: Matches header patterns for Chase, Bank of America, Wells Fargo, Capital One, Citi, or falls back to generic.

### V3 (Budget) — Manual + Statement Upload

```
Manual: form input → add to activeData[] → save to localStorage
CSV/PDF/Excel: same parsing as V2 → imported as budget transactions
Excel template: Budget Template V3.xlsx → populate setup + transactions + income + accounts
```

### Scanner — Receipt Images

```
Image files → Tesseract.js OCR (or Gemini Vision API)
  → raw text → line parsing → item extraction
  → abbreviation expansion → category assignment → store detection
  → review/edit UI → Excel export (ExcelJS) or Dashboard import (localStorage)
```

---

## CSS Architecture

### Theme System

Each dashboard uses CSS custom properties for theming:

```css
:root {
  --bg: #0f1117;           /* dark background */
  --card: #1a1b23;         /* card background */
  --card-border: #2a2b35;  /* card border */
  --text: #e4e4e7;         /* primary text */
  --text-muted: #71717a;   /* secondary text */
  --accent: #22c55e;       /* dashboard-specific accent */
}
body.light {
  --bg: #f5f5f7;
  --card: #ffffff;
  --card-border: #e4e4e7;
  --text: #1a1a2e;
  --text-muted: #71717a;
}
```

Accent colors: Green (V1), Blue (V2), Orange (Scanner), Purple (V3).

### Responsive Breakpoints

```css
@media (max-width: 900px) {
  /* Tablet: stack grids to 1 column, smaller fonts */
}
@media (max-width: 480px) {
  /* Mobile: compact headers, scrollable tabs, smaller padding */
}
```

---

## Shared Modules

### `demo-data.js`
- `DEMO_MODE` constant (auto-detected from URL/sessionStorage)
- `_demoStore` in-memory key-value store
- `demoGet()`, `demoSet()`, `demoRemove()` — demo storage functions
- `seedDemoStore()` — populates all demo data on load
- `injectDemoBanner(color)` — adds colored demo banner to top of page
- `showDemoUpgradePrompt(msg)` — modal for blocked actions in demo mode
- `demofyLinks()` — appends `?demo=true` to navigation links
- `DEMO_GROCERY_DATA`, `DEMO_EXPENSES_DATA`, `DEMO_BUDGET_DATA` — sample datasets

### `firebase-sync.js`
- Firebase initialization and configuration
- `syncToCloud()` — pushes all syncable localStorage keys to Firestore
- `syncFromCloud()` — listens for Firestore changes, writes to localStorage
- `shouldSync(key)` — checks if a key should be synced based on prefix rules
- Auth UI injection (sign-in/sign-up buttons, auth gate overlay)
- `openAuthModal()`, `switchAuthTab()` — auth flow management
- `updateAuthUI()` — shows/hides auth state in header

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| No frameworks (React, Vue, etc.) | Simplicity, no build step, GitHub Pages friendly, zero dependencies to manage |
| localStorage over IndexedDB | Simpler API, sufficient for transaction-level data, easy to inspect/debug |
| Per-month data keys | Prevents loading all data at once, enables month-level operations (delete, compare) |
| Inline HTML → extracted CSS/JS | Started inline for rapid prototyping, refactored to separate files for maintainability |
| Demo mode via in-memory store | Allows full interactivity without writing to localStorage or requiring auth |
| Firebase over custom backend | Zero server maintenance, free tier sufficient, built-in auth providers |
| Client-side PDF/OCR parsing | Privacy (no data leaves browser), offline capability, no API costs |
| Chart.js over D3 | Simpler API for standard chart types, smaller learning curve, good defaults |

---

## Deployment

- **Hosting:** GitHub Pages (auto-deploys from `main` branch)
- **CI/CD:** None — push to `main` triggers GitHub Pages build
- **Domain:** `allagilejobs-jpg.github.io/Monthly/`
- **Cache:** GitHub Pages CDN caching (may require cache-busting query params for immediate updates)
- **Rollback:** `git checkout backup-before-cleanup` or `git checkout v1.0-working`
