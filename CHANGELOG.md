# Changelog

## 2026-02-24 — Code Cleanup & Mobile Fixes (by Clawdbot)

### 🧹 Code Cleanup — CSS Extraction
Moved inline `<style>` blocks from HTML files into separate CSS files:

| Page | Lines Removed | New File |
|------|---------------|----------|
| Groceries | 480 | `css/groceries.css` |
| Budget | 344 | `css/budget.css` |
| Expenses | 426 | `css/expenses.css` |
| Scanner | 170 | `css/scanner.css` |

### 🧹 Code Cleanup — JS Extraction
Moved inline `<script>` blocks from HTML files into separate JS files:

| Page | Lines Removed | New File |
|------|---------------|----------|
| Groceries | 2,419 | `js/groceries.js` |
| Budget | 2,811 | `js/budget.js` |
| Expenses | 2,059 | `js/expenses.js` |
| Scanner | 1,364 | `js/scanner.js` |

### 📱 Mobile Responsiveness Fixes
- **Demo banner**: Smaller padding, responsive height (41px desktop, 60px mobile)
- **Header**: Centered logo on mobile, wrapped nav links
- **Tabs**: Horizontal scroll on mobile instead of wrap
- **Cards**: Smaller padding and margins
- **Tables**: Smaller font and cell padding
- **Buttons**: Compact sizing for mobile
- **Forms**: Larger touch targets (14px font, 8px padding)

### 📁 New Project Structure
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
├── Groceries/index.html  (553 lines, was 3,453)
├── Budget/index.html     (599 lines, was 3,755)
├── Expenses/index.html   (198 lines, was 2,684)
└── Scanner/index.html    (164 lines, was 1,699)
```

### 🔒 Backup
Before cleanup, a backup was created:
- Branch: `backup-before-cleanup`
- Tag: `v1.0-working`

To rollback if needed:
```bash
git checkout backup-before-cleanup
git push -f origin main
```

---

*This cleanup was performed by Clawdbot to improve code organization without changing functionality.*
