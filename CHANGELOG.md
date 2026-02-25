# Changelog

All changes made by Clawdbot on **2026-02-24** (code cleanup session).

---

## Git Commits (in order)

### 1. `bd67d32` — Extract Groceries CSS
- Moved 480 lines of inline CSS from `Groceries/index.html` to `css/groceries.css`
- Added `<link rel="stylesheet" href="../css/groceries.css">` to HTML head

### 2. `dda8f76` — Extract Budget CSS
- Moved 344 lines of inline CSS from `Budget/index.html` to `css/budget.css`
- Added `<link rel="stylesheet" href="../css/budget.css">` to HTML head

### 3. `16e503c` — Extract Expenses CSS
- Moved 426 lines of inline CSS from `Expenses/index.html` to `css/expenses.css`
- Added `<link rel="stylesheet" href="../css/expenses.css">` to HTML head

### 4. `860fb58` — Extract Scanner CSS
- Moved 170 lines of inline CSS from `Scanner/index.html` to `css/scanner.css`
- Added `<link rel="stylesheet" href="../css/scanner.css">` to HTML head

### 5. `cf53554` — Extract Groceries JS
- Moved 2,419 lines of inline JavaScript from `Groceries/index.html` to `js/groceries.js`
- Added `<script src="../js/groceries.js"></script>` before closing body tag

### 6. `c636f6e` — Extract Budget JS
- Moved 2,811 lines of inline JavaScript from `Budget/index.html` to `js/budget.js`
- Added `<script src="../js/budget.js"></script>` before closing body tag

### 7. `2a84120` — Extract Expenses JS
- Moved 2,059 lines of inline JavaScript from `Expenses/index.html` to `js/expenses.js`
- Added `<script src="../js/expenses.js"></script>` before closing body tag

### 8. `d0093c7` — Extract Scanner JS
- Moved 1,364 lines of inline JavaScript from `Scanner/index.html` to `js/scanner.js`
- Added `<script src="../js/scanner.js"></script>` before closing body tag

### 9. `489ffed` — Fix Mobile Responsiveness (Part 1)
- **demo-data.js**: Reduced demo banner padding (10px → 8px), smaller font (13px → 12px)
- **demo-data.js**: Added responsive banner height (41px desktop, 60px mobile)
- **demo-data.js**: Added resize listener to adjust header position dynamically
- **css/budget.css**: Added mobile header fixes (smaller padding, wrapped layout)
- **css/budget.css**: Added mobile tab fixes (smaller font, tighter spacing)

### 10. `28974d0` — Fix Mobile Responsiveness (Part 2) + CHANGELOG
- **css/budget.css**: Centered logo on mobile, full-width header-left
- **css/budget.css**: Horizontal scrollable tabs (no awkward wrapping)
- **css/budget.css**: Smaller card padding (20px → 14px on mobile)
- **css/budget.css**: Smaller table font (13px → 11px) and cell padding
- **css/budget.css**: Compact button sizing for mobile
- **css/budget.css**: Larger touch targets for form inputs
- **CHANGELOG.md**: Created this file

---

## Summary of Changes

### Files Created
```
css/groceries.css    (479 lines)
css/budget.css       (351 lines) — includes mobile fixes
css/expenses.css     (425 lines)
css/scanner.css      (169 lines)
js/groceries.js      (2,419 lines)
js/budget.js         (2,811 lines)
js/expenses.js       (2,059 lines)
js/scanner.js        (1,364 lines)
CHANGELOG.md         (this file)
```

### Files Modified
```
Groceries/index.html   3,453 → 553 lines (-84%)
Budget/index.html      3,755 → 599 lines (-84%)
Expenses/index.html    2,684 → 198 lines (-93%)
Scanner/index.html     1,699 → 164 lines (-90%)
demo-data.js           (mobile responsiveness fixes)
```

### New Project Structure
```
Monthly/
├── css/
│   ├── groceries.css
│   ├── budget.css
│   ├── expenses.css
│   └── scanner.css
├── js/
│   ├── groceries.js
│   ├── budget.js
│   ├── expenses.js
│   └── scanner.js
├── Groceries/index.html
├── Budget/index.html
├── Expenses/index.html
├── Scanner/index.html
├── demo-data.js
├── firebase-sync.js
├── index.html
└── CHANGELOG.md
```

---

## Rollback Instructions

A backup was created before any changes:

```bash
# Backup branch
git checkout backup-before-cleanup

# Backup tag
git checkout v1.0-working

# To fully rollback and push:
git checkout backup-before-cleanup
git push -f origin main
```

---

## Notes for Claude Code

When continuing work on this project:
1. CSS is now in `css/` folder — edit there, not inline
2. JS is now in `js/` folder — edit there, not inline
3. HTML files are now just structure + content
4. Mobile styles are in `@media(max-width:480px)` blocks in each CSS file
5. Demo banner logic is in `demo-data.js` function `injectDemoBanner()`

---

*Last updated: 2026-02-24 23:30 EST by Clawdbot*
