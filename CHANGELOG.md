# Changelog

## 2026-03-25 — 60-Day Content Calendar + Carousels

### Added 60-Day Content Calendar (`su/content-calendar-60day.md`)
Complete content plan from March 26 - May 24, 2026 with platform indicators.

**📅 Three Phases:**
- **Phase 1 (Mar 26-31):** Pre-April Build-Up — Trending topics, myth-busters
- **Phase 2 (Apr 1-30):** Autism Acceptance Month — Full daily content, WAAD hero
- **Phase 3 (May 1-24):** Post-April Momentum — Summer prep, continued growth

**🎨 Ready-to-Post Carousels Created:**
1. **Day 1:** "3 Things TikTok Gets WRONG About Autism" (5 slides)
2. **Day 2:** "Acceptance vs. Awareness — Why Language Matters" (5 slides)
3. **Day 3:** "Glass Child Syndrome" (6 slides)
4. **Day 8:** "World Autism Acceptance Day" HERO content (6 slides)

**📱 Platform-Specific Content:**
- Each carousel has TikTok captions (3-5 hashtags)
- Each carousel has Instagram captions (10-15 hashtags)
- Clear indicators: 📱 TikTok / 📸 Instagram / 🔄 Both

**Files Added:**
- `su/content-calendar-60day.md` — Full 60-day calendar
- `su/content/index.html` — Content hub with preview grid
- `su/content/day-01-tiktok-myths/` — 5 HTML templates + 5 PNGs + captions
- `su/content/day-02-acceptance-vs-awareness/` — 5 HTML templates + 5 PNGs + captions
- `su/content/day-03-glass-child/` — 6 HTML templates + 6 PNGs + captions
- `su/content/day-08-waad/` — 6 HTML templates + 6 PNGs + captions

**Commits:** c3850ab, d4c54f6

---

## 2026-03-22 — Spectrum Spotlight Series

### Added `/su/spotlight-series.html` — 8-Week Celebrity Autism Series
Complete content package featuring famous autistic people and celebrity autism parents.

**🌟 Icons on the Spectrum (7 posts):**
- Temple Grandin — Scientist & Autism Advocate
- Anthony Hopkins — Oscar-winning Actor
- Greta Thunberg — Climate Activist
- Bella Ramsey — Actor (The Last of Us)
- Dan Aykroyd — Comedian/Actor (Ghostbusters)
- Sia — Grammy-winning Singer
- Elon Musk — Entrepreneur

**💜 Autism Parents in the Spotlight (7 posts):**
- Holly Robinson Peete — Son RJ
- Toni Braxton — Son Diezel
- Tisha Campbell — Son Xen
- Shawn Stockman (Boyz II Men) — Daughter Micah
- JWoww (Jenni Farley) — Son Greyson
- Sylvester Stallone — Son Seargeoh
- Tommy Hilfiger — Daughter

**Features:**
- Editable post templates (1080x1080)
- Full captions with researched quotes and hashtags
- Download & copy functionality
- 8-week posting schedule included
- Two distinct designs (blue for icons, purple for parents)

*Updated: 2026-03-22 15:45 EST by Clawdbot*

---

## 2026-03-22 — Story Templates & Calendar Update

### Added `/su/story-templates.html` — 8 Instagram Story Templates
- **1080x1920px** (9:16 ratio) — perfect for IG/TikTok stories
- All templates editable in-browser with contenteditable
- Export all as PNG with one click
- Templates included:
  - 💡 Quick Tip — actionable advice
  - 📊 Poll/Question — engagement builders
  - 🔔 New Post Alert — drive traffic to feed
  - 💬 Quote/Affirmation — emotional connection
  - ⚖️ This or That — fun engagement polls
  - 🎬 Behind the Scenes — authenticity (add your own photos)
  - 💜 Daily Reminder — encouragement
  - 🔗 Link/Resource — promote downloads

### Added Story Graphics
- `su/graphics/story-quick-tip.png`
- `su/graphics/story-poll.png`
- `su/graphics/story-new-post.png`
- `su/graphics/story-quote.png`
- `su/graphics/story-this-or-that.png`
- `su/graphics/story-behind-scenes.png`
- `su/graphics/story-reminder.png`
- `su/graphics/story-link.png`

### Updated `/su/calendar.html` — 30-Day Content Calendar
- Added **story section** to all 30 days
- Each day now has 3-5 story ideas with:
  - Timing (AM/Noon/PM)
  - Template type to use
  - Specific content/copy
- Story content complements main feed posts
- Added story legend indicator (purple)

### Updated Navigation
- All SU pages now include Stories link in nav
- Updated index.html with new nav structure

*Updated: 2026-03-22 00:05 EST by Clawdbot*

---

## 2026-03-21 — Spectrum Unlocked Marketing Page

### Added `/su/editor.html` — Interactive Template Editor
- Live in-browser editing (click any text to change it)
- Download as 1080x1080 PNG with one click
- Uses html2canvas for client-side rendering
- All 8 templates editable

### Added `/su` directory
- **su/index.html** — Dashboard showcasing Spectrum Unlocked marketing package
  - Stats overview (8 templates, 16 blog posts, 8 PDFs, 5 docs)
  - Social media graphics gallery
  - Marketing documents list
  - Site content checklist
  - Next steps / recommendations
  
- **su/graphics/** — 8 social media templates (1080x1080 PNG)
  - 01-quote.png — Quote post template
  - 02-tip.png — Quick tip template
  - 03-list.png — Numbered list template
  - 04-myth.png — Myth vs Truth template
  - 05-resource.png — Resource promo template
  - 06-emotional.png — Emotional support template
  - 07-carousel.png — Carousel cover template
  - 08-story.png — Story template (1080x1920)

---

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

---

## 2026-03-03 — Store Detail Pages

### `TBD` — Add Store Detail View

**New Feature: Clickable Store Pages**

Each vendor/store option in the Groceries dashboard is now clickable and has its own dedicated detail page, similar to how Category Detail and Product Detail pages work.

**Changes Made:**

- **Groceries/index.html**: Added new `view-store-detail` section with back button and content container

- **js/groceries.js**:
  - Added `showStoreDetail(storeName, source)` function (~170 lines) that renders:
    - Header with store name, color, and stats
    - KPIs: Total spent, Shopping trips, Items purchased, Top category
    - Type breakdown (Groceries/Toiletries/Other) with click-through
    - Category pie chart for the store
    - Daily spending bar chart for the store
    - Trip history table (clickable to trip detail)
    - Categories table (clickable to category detail)
    - Top products table (clickable to product detail)
    - Full items table with all purchases
  - Added `goToTripFromStore(tripKey)` helper function
  - Updated store breakdown rows to navigate to `showStoreDetail()` instead of filtering items
  - Updated store pie chart click handler to navigate to store detail
  - Updated store bar chart click handler to navigate to store detail
  - Updated toiletry store chart click handler to navigate to store detail
  - Updated `showCategoryDetail` backMap to include 'store-detail'
  - Updated `showProductDetail` backMap to include 'store-detail'
  - Added arrow indicator to store breakdown rows

**User Experience:**
- Click any store in the "By Store" tab → opens Store Detail page
- Click any store in pie/bar charts → opens Store Detail page
- Navigate seamlessly between Store → Category → Product → Trip views
- Back buttons correctly return to the source view

*Updated: 2026-03-03 19:10 EST by Clawdbot*

---

## 2026-03-25 — Sensory Hacks Batch + Cron Automation

### Added `/su/sensory-hacks/` — 10 Sensory Hack Templates
Complete batch of Tuesday Tips sensory hack posts:
1. 🎧 Headphones — Noise buffer strategy
2. 🛏️ Weighted Blanket — Deep pressure input
3. 🕶️ Sunglasses Indoors — Light sensitivity
4. 🌀 Fidget Rotation — Keep fidgets effective
5. ⏱️ Transition Countdown — Visual timers
6. 🏕️ Calm Corner — Regulation station
7. 🎒 Sensory Go-Bag — Be prepared
8. 🤗 Compression Clothing — Wearable hugs
9. 🌊 White Noise — Sound masking
10. 🍬 Oral Sensory Input — Chewing is calming

Each hack has HTML template + exported PNG (1080x1920 story format).

### Added Cron Jobs for Content Automation
- **SU Weekly Content Brainstorm** — Sundays @ 8 PM
- **SU Daily Posting Reminder** — Every day @ 9 AM  
- **SU Content Research** — Wednesdays @ 12 PM

All cron jobs auto-push to GitHub after saving files.

### Added Folders
- `su/weekly-ideas/` — Weekly brainstorm outputs
- `su/research/` — Content research outputs

*Updated: 2026-03-25 06:50 EST by Clawdbot*

---

## 2026-03-25 — Navigation & Guides Update

### Added `/su/guides.html` — Comprehensive How-To Guide
Full documentation with context and explanations:
- 🗺️ Content Overview — links to all sections
- 📐 Instagram Sizes — 2026 best practices
- 🔄 Posting Workflow — daily routine
- 🎨 Using Templates — editor walkthrough
- 🧠 Sensory Hacks — series explanation
- ⭐ Spotlight Series — icons + parents
- 📱 Story Templates — all 8 formats
- 🤖 Automation — cron job details

### Added `/su/sensory-hacks/index.html`
Browseable gallery of all 10 sensory hacks with:
- Preview images
- Download PNG links
- Edit Template links
- Descriptions

### Added Placeholder Pages
- `su/weekly-ideas/index.html` — for Sunday cron outputs
- `su/research/index.html` — for Wednesday cron outputs

### Updated Navigation (All Pages)
New nav bar across all SU pages:
🏠 Dashboard | 📁 Content | 📅 Calendar | ✨ Create | 🎨 Editor | 🧠 Sensory | ⭐ Spotlight | 📱 Stories | 📖 Guides

*Commit: fed4ccc — 2026-03-25 06:53 EST by Clawdbot*
