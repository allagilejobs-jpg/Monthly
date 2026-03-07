# Improved Empty States — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add consistent empty states (icon + title + subtitle + CTA) to all dashboard tabs, fixing crash bugs in V1 and improving V2/Budget consistency.

**Architecture:** Each render function gets an early-return guard that checks if relevant data is empty. If empty, inject a standardized `.empty-state` HTML block and return before any chart/table logic runs. Reuse existing `.empty-state` CSS from `css/shared.css`.

**Tech Stack:** Vanilla JS, existing CSS classes from `css/shared.css`

---

### Task 1: Add empty-state-btn to shared.css

**Files:**
- Modify: `css/shared.css:141-168` (empty-state section)

**Step 1: Add btn class**

V2 Expenses has `.empty-state-btn` in `css/expenses.css:458-463` but it's not in `shared.css`. Add it so V1 and Budget can use it too.

After line 153 (`.empty-state-text` closing `}`), before `.empty-state-hint`, add:

```css
.empty-state-btn {
  background: rgba(59,130,246,0.2); color: var(--blue); border: 1px solid rgba(59,130,246,0.3);
  border-radius: 10px; padding: 12px 28px; font-size: 15px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.empty-state-btn:hover { background: rgba(59,130,246,0.3); transform: translateY(-2px); }
```

Also add in the `@media (min-width:769px)` block after `.empty-state-hint`:
```css
.empty-state-btn { font-size: 16px; padding: 14px 32px; }
```

**Step 2: Commit**

```
feat: add empty-state-btn class to shared.css
```

---

### Task 2: Add empty state helper to V1 Groceries

**Files:**
- Modify: `js/groceries.js` — add helper function near other utilities (~line 161)

**Step 1: Add helper function**

After the `lbBadge()` function (line 161), add:

```javascript
function emptyState(icon, title, text, btnLabel, btnAction) {
  return '<div class="empty-state"><div class="empty-state-icon">' + icon + '</div><div class="empty-state-title">' + title + '</div><div class="empty-state-text">' + text + '</div>' + (btnLabel ? '<button class="empty-state-btn" onclick="' + btnAction + '">' + btnLabel + '</button>' : '') + '</div>';
}
```

**Step 2: Commit**

```
feat: add emptyState() helper to groceries.js
```

---

### Task 3: Add empty state guards to V1 render functions

**Files:**
- Modify: `js/groceries.js` — add guards at top of each render function

**Step 1: renderOverview() — line 1179**

After `function renderOverview() {`, add:

```javascript
  if (!activeData || activeData.length === 0) {
    document.getElementById("kpi-overview").innerHTML = '';
    document.getElementById("view-overview").querySelector('.card-grid, .kpi-grid')?.insertAdjacentHTML('afterend', '');
    var ov = document.getElementById("view-overview");
    ov.innerHTML = emptyState('&#128202;', 'No Data to Show', 'Upload grocery data to see your spending overview.', '+ Upload Month', 'openUploadModal()');
    return;
  }
```

**Step 2: renderGroceries() — line 1508**

After `function renderGroceries() {`, add:

```javascript
  if (!groceries || groceries.length === 0) {
    document.getElementById("kpi-grocery").innerHTML = '';
    document.getElementById("view-groceries").querySelectorAll('.card').forEach(c => c.style.display = 'none');
    document.getElementById("view-groceries").insertAdjacentHTML('beforeend', emptyState('&#128722;', 'No Grocery Items', 'Upload data or scan receipts to see grocery breakdowns.', '+ Upload Month', 'openUploadModal()'));
    return;
  }
```

Wait — this approach of inserting HTML into existing views is fragile because the views have static HTML content (charts, tables). A cleaner approach: each view div has child elements; we can hide all children and insert the empty state, then on next render (when data exists), the normal flow restores them.

Actually, the simplest approach: since `renderAll()` wraps each call in try/catch AND the render functions replace innerHTML of their target elements, the cleanest pattern is to just set the innerHTML of each view's key container. Let me re-examine.

The render functions write into specific sub-elements (kpi grids, chart canvases, tables). The views themselves (`#view-overview`, etc.) contain static HTML structure. So the best approach is:

For each render function, at the top:
1. Check if data is empty
2. If empty, clear the KPI area and any other dynamic areas, then insert the empty state into a designated spot
3. Return early

But inserting and removing inline is messy. The cleanest pattern used by Budget: have a hidden `<div id="xxx-empty" class="empty-state hidden">` in the HTML, and toggle visibility. But this requires HTML changes.

**Simplest approach that works:** Each render function already sets innerHTML of specific elements. We can just set the entire view's innerHTML to the empty state when data is empty. The next time `renderAll()` runs with data, it will call the render function again which will write real content.

But wait — the views have static HTML (canvases, table structures). If we overwrite innerHTML, we lose those elements and the render functions would need to recreate them.

**Best approach:** Add a single empty-state overlay div per view. Show/hide it. When visible, it covers the content via CSS.

Actually, let me just use the pattern V1 already uses for the top-level empty state: we only need guards in the render functions to **prevent crashes** and show a message. Since the top-level guard already handles "no months loaded," these per-tab guards only fire when a month is loaded but has 0 items in a category (e.g., no non-grocery items). So instead of replacing the whole view, we can target the specific dynamic containers.

Let me simplify. For each render function:

```javascript
if (relevantData.length === 0) {
  document.getElementById("target-element").innerHTML = emptyState(...);
  return;
}
```

Where `target-element` is the KPI grid or main table that the function writes to.

**Step 1: renderOverview()**

At top of `renderOverview()` (after `function renderOverview() {`), add:

```javascript
  if (!activeData || activeData.length === 0) {
    document.getElementById("kpi-overview").innerHTML = emptyState('&#128202;', 'No Data to Show', 'Upload grocery data to see your spending overview.', '+ Upload Month', 'openUploadModal()');
    return;
  }
```

**Step 2: renderGroceries()**

At top of `renderGroceries()`, add:

```javascript
  if (!groceries || groceries.length === 0) {
    document.getElementById("kpi-grocery").innerHTML = emptyState('&#128722;', 'No Grocery Items', 'Upload data or scan receipts to see grocery breakdowns.', '+ Upload Month', 'openUploadModal()');
    return;
  }
```

**Step 3: renderNonGroceries()**

At top of `renderNonGroceries()`, add:

```javascript
  if (!nonGroceries || nonGroceries.length === 0) {
    document.getElementById("kpi-nongrocery").innerHTML = emptyState('&#127991;&#65039;', 'No Non-Grocery Items', 'Items like toiletries and household supplies will appear here.', '+ Upload Month', 'openUploadModal()');
    document.getElementById("table-nongrocery-all").innerHTML = '';
    return;
  }
```

**Step 4: renderStores()**

At top of `renderStores()`, add:

```javascript
  if (!activeData || activeData.length === 0) {
    document.getElementById("view-stores").querySelector('.card')?.insertAdjacentHTML('afterbegin', emptyState('&#127978;', 'No Store Data', 'Upload grocery data to see spending by store.', '+ Upload Month', 'openUploadModal()'));
    return;
  }
```

Actually — `renderStores()` writes to a chart canvas and dynamically builds store cards. Let me check the exact target elements.

---

I realize writing all the exact code inline in a plan doc is getting unwieldy because each render function has different target elements. Let me write the plan at a higher level with the exact pattern, and implement directly.

**Step 1-8: Add early-return guard to each of the 8 render functions**

Pattern for each:
```javascript
function renderXxx() {
  if (!relevantData || relevantData.length === 0) {
    targetElement.innerHTML = emptyState(icon, title, text, '+ Upload Month', 'openUploadModal()');
    return;
  }
  // ... existing code
}
```

| Function | Guard condition | Target element | Icon | Title |
|----------|----------------|----------------|------|-------|
| renderOverview | `activeData.length === 0` | `#kpi-overview` | 📊 | No Data to Show |
| renderGroceries | `groceries.length === 0` | `#kpi-grocery` | 🛒 | No Grocery Items |
| renderNonGroceries | `nonGroceries.length === 0` | `#kpi-nongrocery` | 🏷️ | No Non-Grocery Items |
| renderStores | `activeData.length === 0` | `#chart-store-container` | 🏪 | No Store Data |
| renderTrends | `activeData.length === 0` | `#kpi-trends` (or first card in view) | 📈 | No Trend Data |
| renderTrips | `activeData.length === 0` | `#kpi-trips` | 🧾 | No Trips Found |
| renderAllItems | `activeData.length === 0` | items table area | 📋 | No Items Found |
| renderCompare | `< 2 months` | compare container | ⚖️ | Need More Data |

**Step 9: Commit**

```
feat: add empty state guards to all V1 grocery render functions
```

---

### Task 4: Improve V2 Expenses empty states

**Files:**
- Modify: `js/expenses.js` — lines 2193, 2215, 2284, 2426, 2897, 2968

**Step 1: Add CTA buttons to By Category, By Merchant, Trends**

Lines 2193, 2215, 2284 — append `<button class="empty-state-btn" onclick="openUploadModal()">Upload a Statement</button>` before the closing `</div>`.

**Step 2: Add upload button to All Transactions**

Line 2426 — add `<button class="empty-state-btn" onclick="openUploadModal()">Upload a Statement</button>` after the "add manually" link.

**Step 3: Improve Merchant/Category detail empty states**

Lines 2897 and 2968 — replace minimal empty states with full icon + title + text:

```javascript
container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#128194;</div><div class="empty-state-title">No Transactions Found</div><div class="empty-state-text">No transactions match this selection.</div></div>';
```

**Step 4: Commit**

```
feat: add CTA buttons and icons to V2 expense empty states
```

---

### Task 5: Improve Budget annual overview empty state

**Files:**
- Modify: `Budget/index.html:312-314`

**Step 1: Add CTA button**

Change:
```html
<div id="annual-empty" class="empty-state hidden">
  <p>Add transactions in the Monthly Tracker to see your annual overview.</p>
</div>
```

To:
```html
<div id="annual-empty" class="empty-state hidden">
  <p>Add transactions in the Monthly Tracker to see your annual overview.</p>
  <button class="btn btn-primary" onclick="showView('tracker')">Go to Tracker</button>
</div>
```

**Step 2: Commit**

```
feat: add CTA button to Budget annual overview empty state
```

---

### Task 6: Polish V1 top-level empty state

**Files:**
- Modify: `js/groceries.js:473-474`

**Step 1: Replace inline styles with CSS classes**

Replace the inline-styled empty state with the `emptyState()` helper:

```javascript
main.innerHTML = emptyState('&#128722;', 'No Grocery Data Yet', 'Upload an Excel file or import from the Receipt Scanner to get started.', '+ Upload Month', 'openUploadModal()');
```

**Step 2: Commit**

```
refactor: use emptyState() helper for V1 top-level empty state
```

---

### Task 7: Final commit and push

Verify all dashboards load correctly with and without data, then push.
