# Scan Results Summary - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a scan results summary to the Scanner Review panel showing counts and file lists for successful, failed, and removed receipts, with X buttons to remove receipts (with confirmation) and retry buttons for failed ones, all updating live.

**Architecture:** Add three tracking arrays (`successfulFiles`, `failedFiles`, `removedFiles`) populated during processing. Insert a new summary component above the existing review stats grid. The `renderReview()` function is extended to render this summary and re-render on remove/retry actions.

**Tech Stack:** Vanilla JS, CSS (matches existing scanner.css patterns), HTML generated in JS like existing review code.

---

### Task 1: Add tracking arrays and populate them during processing

**Files:**
- Modify: `js/scanner.js:1-8` (state section)
- Modify: `js/scanner.js:721-808` (startProcessing function)

**Step 1: Add new state variables at the top of scanner.js**

After line 6 (`let tesseractWorker = null;`), add:

```javascript
let scanMode = 'ai'; // already exists somewhere, just noting
let successfulFiles = []; // { name, itemCount, total }
let failedFiles = [];     // { name, reason, uploadIndex }
let removedFiles = [];    // { name, source } - source: 'successful' or 'failed'
```

**Step 2: Clear tracking arrays when processing starts**

In `startProcessing()`, after `extractedData = [];` (line 724), add:

```javascript
successfulFiles = [];
failedFiles = [];
removedFiles = [];
```

**Step 3: Populate tracking arrays during the processing loop**

Replace the try/catch block inside the processing loop (lines 768-783) with:

```javascript
    try {
      let items;
      if (useGemini) {
        items = await processWithGemini(uf, doAutoDetect);
      } else {
        items = await processWithTesseract(uf, doPreprocess, doAutoDetect);
      }
      if (items.length) {
        log(`  Found ${items.length} item(s)`, 'success');
        extractedData.push(...items);
        successfulFiles.push({ name: uf.name, itemCount: items.length, total: items.reduce((s, it) => s + (it.t || 0), 0) });
      } else {
        log(`  No items detected`, 'error');
        failedFiles.push({ name: uf.name, reason: 'No items detected', uploadIndex: i });
      }
    } catch(e) {
      log(`  Error: ${e.message}`, 'error');
      failedFiles.push({ name: uf.name, reason: e.message, uploadIndex: i });
    }
```

**Step 4: Allow transition to review even if some files failed**

Replace the condition at lines 802-807:

```javascript
  if (extractedData.length > 0 || failedFiles.length > 0) {
    setTimeout(() => {
      goToStep(3);
      renderReview();
    }, 1000);
  }
```

**Step 5: Commit**

```bash
git add js/scanner.js
git commit -m "feat(scanner): add tracking arrays for successful/failed/removed files"
```

---

### Task 2: Add CSS for the scan results summary component

**Files:**
- Modify: `css/scanner.css:110-111` (insert after `.review-stat .lbl` block, before `.receipt-group`)

**Step 1: Add scan results summary CSS**

Insert after line 110 (`.review-stat .lbl`) and before line 112 (`.receipt-group`):

```css
/* Scan results summary */
.scan-results-summary { margin-bottom:20px; }
.scan-results-badges { display:flex; gap:8px; margin-bottom:12px; }
.scan-badge { padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; cursor:pointer; transition:all .2s; border:1px solid transparent; }
.scan-badge:hover { filter:brightness(1.1); }
.scan-badge.success { background:rgba(34,197,94,0.15); color:var(--green); border-color:rgba(34,197,94,0.3); }
.scan-badge.failed { background:rgba(239,68,68,0.15); color:var(--red); border-color:rgba(239,68,68,0.3); }
.scan-badge.removed { background:rgba(113,113,122,0.15); color:var(--muted); border-color:rgba(113,113,122,0.3); }
.scan-badge .badge-count { font-weight:700; }

.scan-section { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:10px; overflow:hidden; }
.scan-section-header { padding:10px 16px; background:var(--surface2); cursor:pointer; display:flex; align-items:center; justify-content:space-between; font-size:13px; font-weight:600; }
.scan-section-header .sec-chevron { transition:transform .2s; color:var(--muted); font-size:10px; }
.scan-section-header.collapsed .sec-chevron { transform:rotate(-90deg); }
.scan-section-body { padding:0; }
.scan-section-body.collapsed { display:none; }

.scan-file-entry { display:flex; align-items:center; justify-content:space-between; padding:8px 16px; border-bottom:1px solid var(--border); font-size:13px; transition:background .2s; }
.scan-file-entry:last-child { border-bottom:none; }
.scan-file-entry:hover { background:rgba(249,115,22,0.05); }
.scan-file-info { display:flex; flex-direction:column; gap:2px; min-width:0; flex:1; }
.scan-file-name { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.scan-file-detail { font-size:11px; color:var(--muted); }
.scan-file-actions { display:flex; gap:6px; align-items:center; flex-shrink:0; margin-left:8px; }

.scan-btn-remove { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:var(--red); border-radius:6px; padding:4px 8px; cursor:pointer; font-size:12px; transition:all .2s; line-height:1; }
.scan-btn-remove:hover { background:rgba(239,68,68,0.3); }
.scan-btn-retry { background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.3); color:var(--blue); border-radius:6px; padding:4px 8px; cursor:pointer; font-size:12px; transition:all .2s; line-height:1; }
.scan-btn-retry:hover { background:rgba(59,130,246,0.3); }

.scan-confirm-row { display:flex; align-items:center; gap:8px; padding:8px 16px; background:rgba(239,68,68,0.08); border-bottom:1px solid var(--border); font-size:12px; color:var(--red); }
.scan-confirm-row button { padding:4px 10px; border-radius:4px; border:none; cursor:pointer; font-size:11px; font-weight:600; }
.scan-confirm-yes { background:var(--red); color:#fff; }
.scan-confirm-yes:hover { filter:brightness(1.1); }
.scan-confirm-no { background:var(--surface2); color:var(--text); border:1px solid var(--border) !important; }
.scan-confirm-no:hover { background:var(--surface); }

.scan-empty-state { padding:20px; text-align:center; color:var(--muted); font-size:13px; }
```

**Step 2: Add mobile responsive styles**

Inside the `@media(max-width:700px)` block (line 179), add:

```css
  .scan-results-badges { flex-wrap:wrap; }
  .scan-badge { font-size:12px; padding:5px 10px; }
  .scan-file-entry { padding:8px 12px; }
  .scan-file-name { font-size:12px; }
```

**Step 3: Add light theme overrides**

After line 176 (`body.light .theme-toggle:hover`), add:

```css
body.light .scan-section { background:#fff; }
body.light .scan-file-entry:hover { background:rgba(249,115,22,0.06); }
body.light .scan-confirm-row { background:rgba(239,68,68,0.06); }
```

**Step 4: Commit**

```bash
git add css/scanner.css
git commit -m "feat(scanner): add CSS for scan results summary component"
```

---

### Task 3: Add the scan results summary HTML container

**Files:**
- Modify: `Scanner/index.html:98-100` (panelReview section)

**Step 1: Add scan results summary div above reviewSummary**

Replace lines 98-100:

```html
  <div class="panel" id="panelReview">
    <div id="scanResultsSummary"></div>
    <div class="review-summary" id="reviewSummary"></div>
    <div id="reviewGroups"></div>
```

**Step 2: Commit**

```bash
git add Scanner/index.html
git commit -m "feat(scanner): add scan results summary container to review panel"
```

---

### Task 4: Implement renderScanSummary() function

**Files:**
- Modify: `js/scanner.js` (add new function before `renderReview`)

**Step 1: Add the renderScanSummary function**

Insert before the `renderReview()` function (before line 984):

```javascript
// ============================================================
// SCAN RESULTS SUMMARY
// ============================================================
function renderScanSummary() {
  const container = document.getElementById('scanResultsSummary');
  if (!container) return;

  const sCount = successfulFiles.length;
  const fCount = failedFiles.length;
  const rCount = removedFiles.length;

  // If no files processed at all, hide
  if (sCount + fCount + rCount === 0) { container.innerHTML = ''; return; }

  let html = '<div class="scan-results-summary">';

  // Badge row
  html += '<div class="scan-results-badges">';
  html += `<div class="scan-badge success" onclick="toggleScanSection('secSuccess')"><span class="badge-count">${sCount}</span> Successful</div>`;
  html += `<div class="scan-badge failed" onclick="toggleScanSection('secFailed')"><span class="badge-count">${fCount}</span> Failed</div>`;
  html += `<div class="scan-badge removed" onclick="toggleScanSection('secRemoved')"><span class="badge-count">${rCount}</span> Removed</div>`;
  html += '</div>';

  // Successful section
  html += '<div class="scan-section">';
  html += `<div class="scan-section-header" id="secSuccessHeader" onclick="toggleScanSection('secSuccess')">
    <span>Successful (${sCount})</span><span class="sec-chevron">&#9660;</span>
  </div>`;
  html += '<div class="scan-section-body" id="secSuccess">';
  if (sCount === 0) {
    html += '<div class="scan-empty-state">No successful receipts</div>';
  } else {
    successfulFiles.forEach((f, i) => {
      html += `<div class="scan-file-entry" id="scanSucc_${i}">
        <div class="scan-file-info">
          <div class="scan-file-name">&#128206; ${escHtml(f.name)}</div>
          <div class="scan-file-detail">${f.itemCount} item(s) &middot; $${fmt(f.total)}</div>
        </div>
        <div class="scan-file-actions">
          <button class="scan-btn-remove" onclick="confirmRemoveReceipt(${i},'successful')" title="Remove receipt">&#10005;</button>
        </div>
      </div>`;
    });
  }
  html += '</div></div>';

  // Failed section
  html += '<div class="scan-section">';
  html += `<div class="scan-section-header" id="secFailedHeader" onclick="toggleScanSection('secFailed')">
    <span>Failed (${fCount})</span><span class="sec-chevron">&#9660;</span>
  </div>`;
  html += '<div class="scan-section-body" id="secFailed">';
  if (fCount === 0) {
    html += '<div class="scan-empty-state">No failed receipts</div>';
  } else {
    failedFiles.forEach((f, i) => {
      html += `<div class="scan-file-entry" id="scanFail_${i}">
        <div class="scan-file-info">
          <div class="scan-file-name">&#128206; ${escHtml(f.name)}</div>
          <div class="scan-file-detail">${escHtml(f.reason)}</div>
        </div>
        <div class="scan-file-actions">
          <button class="scan-btn-retry" onclick="retryFailedReceipt(${i})" title="Retry scan">&#8635;</button>
          <button class="scan-btn-remove" onclick="confirmRemoveReceipt(${i},'failed')" title="Dismiss">&#10005;</button>
        </div>
      </div>`;
    });
  }
  html += '</div></div>';

  // Removed section (starts collapsed if empty)
  html += '<div class="scan-section">';
  html += `<div class="scan-section-header${rCount === 0 ? ' collapsed' : ''}" id="secRemovedHeader" onclick="toggleScanSection('secRemoved')">
    <span>Removed (${rCount})</span><span class="sec-chevron">&#9660;</span>
  </div>`;
  html += `<div class="scan-section-body${rCount === 0 ? ' collapsed' : ''}" id="secRemoved">`;
  if (rCount === 0) {
    html += '<div class="scan-empty-state">No removed receipts</div>';
  } else {
    removedFiles.forEach((f, i) => {
      html += `<div class="scan-file-entry">
        <div class="scan-file-info">
          <div class="scan-file-name" style="color:var(--muted)">&#128206; ${escHtml(f.name)}</div>
          <div class="scan-file-detail">Removed from ${f.source}</div>
        </div>
      </div>`;
    });
  }
  html += '</div></div>';

  html += '</div>';
  container.innerHTML = html;
}

function toggleScanSection(sectionId) {
  const body = document.getElementById(sectionId);
  const header = document.getElementById(sectionId + 'Header');
  if (body && header) {
    body.classList.toggle('collapsed');
    header.classList.toggle('collapsed');
  }
}
```

**Step 2: Call renderScanSummary from renderReview**

At the start of the `renderReview()` function (line 984), add as the first line inside the function:

```javascript
  renderScanSummary();
```

**Step 3: Commit**

```bash
git add js/scanner.js
git commit -m "feat(scanner): implement renderScanSummary with badges and collapsible sections"
```

---

### Task 5: Implement confirmRemoveReceipt() with confirmation dialog

**Files:**
- Modify: `js/scanner.js` (add after `toggleScanSection` function)

**Step 1: Add the confirmation and removal functions**

```javascript
function confirmRemoveReceipt(index, source) {
  // Find the entry element
  const prefix = source === 'successful' ? 'scanSucc' : 'scanFail';
  const entry = document.getElementById(`${prefix}_${index}`);
  if (!entry) return;

  // Check if confirmation already showing
  if (entry.querySelector('.scan-confirm-row')) return;

  const confirmHtml = `<div class="scan-confirm-row">
    <span>Remove this receipt?</span>
    <button class="scan-confirm-yes" onclick="executeRemoveReceipt(${index},'${source}')">Yes</button>
    <button class="scan-confirm-no" onclick="cancelRemoveReceipt(${index},'${source}')">No</button>
  </div>`;

  entry.insertAdjacentHTML('beforeend', confirmHtml);
}

function cancelRemoveReceipt(index, source) {
  const prefix = source === 'successful' ? 'scanSucc' : 'scanFail';
  const entry = document.getElementById(`${prefix}_${index}`);
  if (!entry) return;
  const confirmRow = entry.querySelector('.scan-confirm-row');
  if (confirmRow) confirmRow.remove();
}

function executeRemoveReceipt(index, source) {
  let removedFile;

  if (source === 'successful') {
    removedFile = successfulFiles.splice(index, 1)[0];
    if (removedFile) {
      // Remove this file's items from extractedData
      extractedData = extractedData.filter(item => item._file !== removedFile.name);
      removedFiles.push({ name: removedFile.name, source: 'successful' });
    }
  } else if (source === 'failed') {
    removedFile = failedFiles.splice(index, 1)[0];
    if (removedFile) {
      removedFiles.push({ name: removedFile.name, source: 'failed' });
    }
  }

  // Re-render everything
  renderReview();
}
```

**Step 2: Commit**

```bash
git add js/scanner.js
git commit -m "feat(scanner): add receipt removal with confirmation dialog"
```

---

### Task 6: Implement retryFailedReceipt() function

**Files:**
- Modify: `js/scanner.js` (add after `executeRemoveReceipt`)

**Step 1: Add the retry function**

```javascript
async function retryFailedReceipt(index) {
  const failedFile = failedFiles[index];
  if (!failedFile) return;

  // Find the matching uploaded file
  const uf = uploadedFiles[failedFile.uploadIndex];
  if (!uf) {
    showToast('Original file not found for retry.', 'warning');
    return;
  }

  // Disable the retry button while processing
  const entry = document.getElementById(`scanFail_${index}`);
  const retryBtn = entry?.querySelector('.scan-btn-retry');
  if (retryBtn) {
    retryBtn.disabled = true;
    retryBtn.textContent = '...';
  }

  const doPreprocess = document.getElementById('chkPreprocess')?.checked ?? false;
  const doAutoDetect = document.getElementById('chkAutoDetect')?.checked ?? true;
  const useGemini = scanMode === 'ai';

  try {
    let items;
    if (useGemini) {
      items = await processWithGemini(uf, doAutoDetect);
    } else {
      // Need a fresh Tesseract worker for retry
      tesseractWorker = await Tesseract.createWorker('eng', 1, {});
      items = await processWithTesseract(uf, doPreprocess, doAutoDetect);
      try { await tesseractWorker.terminate(); } catch(e) {}
      tesseractWorker = null;
    }

    if (items.length) {
      // Move from failed to successful
      failedFiles.splice(index, 1);
      extractedData.push(...items);
      successfulFiles.push({
        name: uf.name,
        itemCount: items.length,
        total: items.reduce((s, it) => s + (it.t || 0), 0)
      });
      showToast(`Retry successful: ${items.length} item(s) found`, 'success');
      renderReview();
    } else {
      showToast('Retry found no items. File remains in Failed list.', 'warning');
      if (retryBtn) { retryBtn.disabled = false; retryBtn.innerHTML = '&#8635;'; }
    }
  } catch(e) {
    showToast('Retry error: ' + e.message, 'error');
    if (retryBtn) { retryBtn.disabled = false; retryBtn.innerHTML = '&#8635;'; }
  }
}
```

**Step 2: Commit**

```bash
git add js/scanner.js
git commit -m "feat(scanner): add retry functionality for failed receipts"
```

---

### Task 7: Handle empty state and update review stats to exclude removed receipts

**Files:**
- Modify: `js/scanner.js` (modify `renderReview` function)

**Step 1: Add empty state handling to renderReview**

At the start of `renderReview()`, after the `renderScanSummary()` call, add an empty state check:

```javascript
  // If all successful receipts have been removed, show empty state
  if (successfulFiles.length === 0 && extractedData.length === 0) {
    document.getElementById('reviewSummary').innerHTML = `
      <div class="scan-empty-state" style="grid-column:1/-1; padding:32px;">
        No receipts to review. Go back to upload and scan more receipts.
      </div>`;
    document.getElementById('reviewGroups').innerHTML = '';
    return;
  }
```

The existing stats calculation in `renderReview` already operates on `extractedData`, which we filter in `executeRemoveReceipt`, so stats will automatically reflect only kept receipts.

**Step 2: Commit**

```bash
git add js/scanner.js
git commit -m "feat(scanner): handle empty state when all receipts removed"
```

---

### Task 8: Test end-to-end and verify demo mode

**Step 1: Manual testing checklist**

Test in browser with the following scenarios:
- Upload 3+ files, have at least one fail (e.g., upload a non-receipt image)
- Verify badges show correct counts
- Click X on a successful receipt → confirm dialog appears
- Click Yes → receipt moves to Removed, count updates, editable table disappears
- Click X on a failed receipt → confirm → moves to Removed
- Click retry on a failed receipt → verify it re-processes
- Remove all successful receipts → empty state appears
- Collapsed sections expand/collapse on badge click
- Test on mobile viewport (375px) - badges wrap, entries stack
- Test light theme - correct colors
- Test demo mode (1 file) - summary works with single file

**Step 2: Final commit with any fixes**

```bash
git add -A
git commit -m "feat(scanner): scan results summary - polish and fixes"
```

**Step 3: Push to deploy**

```bash
git push origin main
```
