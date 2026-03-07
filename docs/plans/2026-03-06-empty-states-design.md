# Improved Empty States — Design

> Date: 2026-03-06
> Scope: V1 Groceries, V2 Expenses, Budget
> Style: Icon + title + subtitle + CTA button (consistent pattern)

## Pattern

Every empty state uses:
```
[emoji icon]
[Bold title]
[Muted subtitle with guidance]
[Primary CTA button]
```

Reuse V2's existing `.empty-state` CSS class across all dashboards.

## V1 Groceries

Top-level "no months" empty state already exists — polish to match pattern.

New per-tab guards (prevents crashes when month has 0 items):

| Tab | Icon | Title | Subtitle | CTA |
|-----|------|-------|----------|-----|
| Overview | 📊 | No Data to Show | Upload grocery data to see your spending overview. | + Upload Month |
| Groceries | 🛒 | No Grocery Items | Upload data or scan receipts to see grocery breakdowns. | + Upload Month |
| Non-Grocery | 🏷️ | No Non-Grocery Items | Items like toiletries and household supplies will appear here. | + Upload Month |
| By Store | 🏪 | No Store Data | Upload grocery data to see spending by store. | + Upload Month |
| Trends | 📈 | No Trend Data | Upload grocery data to see spending patterns over time. | + Upload Month |
| Trips | 🧾 | No Trips Found | Shopping trips are grouped by date and store from your data. | + Upload Month |
| All Items | 📋 | No Items Found | Upload grocery data to browse and filter all purchases. | + Upload Month |
| Compare | ⚖️ | Need More Data | Upload at least 2 months to compare spending side by side. | + Upload Month |

Each render function gets early return guard: if relevant data is empty, show empty state instead of running chart/table logic.

## V2 Expenses

Existing empty states are inconsistent. Changes:

| Tab | Change |
|-----|--------|
| By Category | Add upload CTA button |
| By Merchant | Add upload CTA button |
| Trends | Add upload CTA button |
| All Transactions | Add proper upload button alongside "add manually" link |
| Merchant detail | Add icon + subtitle |
| Category detail | Add icon + subtitle |

Overview and Compare already good — no changes.

## Budget

| Tab | Change |
|-----|--------|
| Annual Overview | Add "Go to Tracker" CTA button |

Everything else already solid.

## Demo Mode

Empty states never appear in demo mode — demo data always has content. No demo-specific work needed.
