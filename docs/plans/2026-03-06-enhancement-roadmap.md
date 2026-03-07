# Monthly Spend — Enhancement Roadmap & Backlog

> Last updated: 2026-03-06
> Purpose: Working backlog + roadmap for picking features session by session

## Legend

| Effort | Meaning |
|--------|---------|
| Small | 1 session, < 200 lines |
| Medium | 1-2 sessions, moderate complexity |
| Large | Multi-session, architectural changes or external dependencies |

**Status:** `Done` · `Planned` · `Idea`

---

## Completed

| # | Feature | Dashboard | Description |
|---|---------|-----------|-------------|
| — | Undo for Destructive Actions | All | Undo stack with toast + 6s countdown for deleteMonth, deleteTx, deleteAcct |
| — | Recurring Expense Management | V2 | Toggle tracking, expected amounts, missing/changed alerts, status badges |
| — | Import Preview/Validation | V1, V2 | Validation warnings (missing cat, $0, duplicates), expandable review table |
| — | Price Inflation Tracking | V1 | Cross-month comparison, Overview insight card, Product Detail bar chart |
| — | Bulk Actions | V2, Budget | Checkboxes + floating action bar for bulk delete/recategorize with undo |
| — | Homepage Content | Homepage | "How It Works" steps, 6 feature cards, FAQ accordion |
| — | Sync Conflict Resolution | Firebase | Timestamps, conflict detection, Keep Local/Use Cloud/Smart Merge dialog |
| — | Weighed Items Support | V1 | Auto-detection, "lb" badge, filtering, quantity exclusion |

---

## Phase 1: Data Foundation & Export

*Get data in and out reliably — the basics that everything else builds on.*

| # | Feature | Dashboard | Effort | Status | Description |
|---|---------|-----------|--------|--------|-------------|
| 1 | Export Current View to CSV/Excel | V1, V2, Budget | Small | Planned | "Export" button on any filtered table — downloads what you see |
| 2 | localStorage Quota Handling | All | Small | Planned | Detect when storage is near-full, warn user, offer cleanup of old months |
| 3 | Split Transactions | V2, Budget | Medium | Planned | Split one transaction across multiple categories (e.g., $150 Costco → Groceries + Supplies) |
| 4 | Manual Transaction Entry | V1 | Small | Planned | "+ Add Item" button on V1 (V2/Budget already have this) |
| 5 | Scanner → Budget Integration | Scanner | Medium | Planned | Scanner currently only exports to V1; add export path to Budget dashboard |
| 6 | Import/Export Category Rules | V2 | Small | Planned | Download/upload learned merchant→category mappings as JSON |

## Phase 2: Intelligence & Insights

*Make the data smarter — predictions, patterns, and recommendations.*

| # | Feature | Dashboard | Effort | Status | Description |
|---|---------|-----------|--------|--------|-------------|
| 7 | Spending Forecast | V2, Budget | Medium | Planned | "At current pace, you'll spend $X by month-end" projection on Overview |
| 8 | Budget/Spending Goals | V1, V2 | Medium | Planned | Per-category targets with progress bars (Budget has this; V1/V2 don't) |
| 9 | Seasonal Pattern Detection | V1, V2 | Medium | Idea | With 3+ months: "You typically spend more on groceries in December" |
| 10 | Merchant Alias System | V2 | Medium | Planned | Auto-merge "STBKS #1234" and "Starbucks" — suggest aliases, learn from edits |
| 11 | Shopping Efficiency Metrics | V1 | Small | Idea | Items per trip, cost per trip, avg days between shopping, best-value store |
| 12 | Bill Due Date Reminders | Budget | Medium | Idea | Track recurring bill dates, show "upcoming bills" card on Overview |
| 13 | Category Spending Velocity | V2, Budget | Small | Idea | "You've spent 80% of your Dining budget and it's only the 15th" alert cards |
| 14 | Smart Savings Suggestions | Budget | Medium | Idea | "You spent $X less on dining this month — move to savings?" prompts |

## Phase 3: Cross-Dashboard & Unified Experience

*Break the data silos — connect all three dashboards.*

| # | Feature | Dashboard | Effort | Status | Description |
|---|---------|-----------|--------|--------|-------------|
| 15 | Cross-Dashboard Summary | Homepage | Large | Planned | Unified "All Spending" overview — KPIs pulling from V1 + V2 + Budget |
| 16 | Unified Search | Homepage | Medium | Idea | Search across all dashboards from homepage — find any transaction/merchant/product |
| 17 | V1 ↔ V2 Data Linking | V1, V2 | Large | Idea | Match grocery store trips in V1 with bank transactions in V2, reconcile |
| 18 | Shared Category Taxonomy | All | Medium | Idea | Unified category system across dashboards so cross-dashboard views make sense |

## Phase 4: UI/UX Polish

*Improve the experience for new and returning users.*

| # | Feature | Dashboard | Effort | Status | Description |
|---|---------|-----------|--------|--------|-------------|
| 19 | Improved Empty States | All | Small | Planned | Guided first-time flow when no data exists — "Start here" with clear steps |
| 20 | Keyboard Shortcuts | All | Medium | Idea | Cmd/Ctrl+K search, arrow keys for months, Esc to close modals |
| 21 | Custom Category Management | V2, Budget | Medium | Idea | UI to add/rename/recolor/delete categories instead of hardcoded list |
| 22 | PDF Report Generation | V2, Budget | Large | Idea | Printable monthly summary — category breakdown, charts, totals — for taxes/records |
| 23 | Onboarding Tour | All | Medium | Idea | First-visit walkthrough highlighting key features with tooltips |
| 24 | Drag-and-Drop Reordering | Budget | Small | Idea | Reorder budget categories/items by dragging instead of delete-and-recreate |

## Phase 5: Advanced Features

*Power-user capabilities and long-term value.*

| # | Feature | Dashboard | Effort | Status | Description |
|---|---------|-----------|--------|--------|-------------|
| 25 | Tag/Label System | V2, Budget | Medium | Idea | Custom labels: "Business", "Personal", "Tax Deductible" — filter by tag |
| 26 | Multi-Month Budget Template | Budget | Small | Idea | Copy one month's budget config to multiple future months at once |
| 27 | Savings Goals Visualization | Budget | Medium | Idea | Named goals (Emergency Fund, Vacation) with progress bars and target dates |
| 28 | Year-over-Year Comparison | V1, V2 | Medium | Idea | Compare Jan 2025 vs Jan 2026 — same month across years |
| 29 | PWA / Service Worker | All | Large | Idea | Cache assets for offline use, add-to-homescreen on mobile |
| 30 | Real-Time Price Comparison | V1 | Large | Idea | Show cheaper prices at nearby stores — needs Cloudflare Worker backend |

## Phase 6: Fresh Ideas

*New ideas beyond the original backlog.*

| # | Feature | Dashboard | Effort | Status | Description |
|---|---------|-----------|--------|--------|-------------|
| 31 | Receipt Photo Gallery | Scanner, V1 | Medium | Idea | Save receipt images linked to transactions — tap a transaction to see the receipt |
| 32 | Spending Notifications | All | Medium | Idea | Browser notifications: "Budget exceeded", "Bill due tomorrow" |
| 33 | Family/Household Mode | All | Large | Idea | Multiple profiles under one account — track who spent what |
| 34 | Merchant Location Map | V2 | Large | Idea | Map view of where you spend money (geocoding from merchant names) |
| 35 | Subscription Tracker | V2, Budget | Medium | Idea | Auto-detect recurring charges, renewal calendar, total subscription cost |
| 36 | Expense Streaks & Gamification | All | Small | Idea | "5 days no dining out!" streaks, badges for hitting budget goals |
| 37 | Quick-Add Widget | V1, V2 | Small | Idea | Floating "+" button → quick form to log a transaction without navigating |
| 38 | Data Health Dashboard | All | Small | Idea | Data quality: missing categories, uncategorized items, duplicates, storage usage |
| 39 | Month-End Summary Report | All | Medium | Idea | Shareable summary (copy to clipboard or download) of the month's spending |
| 40 | Voice Receipt Entry | Scanner | Large | Idea | "Spent $12 at Starbucks on coffee" → parsed via Web Speech API |
