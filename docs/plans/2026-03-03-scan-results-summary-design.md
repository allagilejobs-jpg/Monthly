# Scan Results Summary - Design Document

**Date**: 2026-03-03
**Feature**: Receipt scan results summary with success/fail/removed tracking

## Overview

Add a Scan Results Summary component at the top of Step 3 (Review panel) in the Scanner. It provides at-a-glance counts and file-level detail for three categories: Successful, Failed, and Removed receipts. Users can remove unwanted successful receipts (with confirmation), retry or dismiss failed receipts, and all counts/stats update live.

## Placement

Top of Step 3 (Review panel), above the existing 4-stat summary grid (`reviewSummary`). Sits between the step header and the stats.

## Layout

### Count Badges (horizontal row)
Three pill-shaped badges in a row:
- ✅ N Successful (green)
- ❌ N Failed (red)
- 🗑 N Removed (gray)

### Collapsible Sections

**Successful (N)**
- Each entry: filename, item count, total amount, X button
- X button triggers confirmation dialog → moves to Removed
- Removing a receipt also removes its editable table group below

**Failed (N)**
- Each entry: filename, failure reason, retry button, X button
- Retry re-processes that single file (using same mode: AI or OCR)
- On retry success → moves to Successful, renders editable table
- On retry failure → stays in Failed, shows toast error
- X button dismisses to Removed

**Removed (N)**
- Each entry: filename only (info, no actions)
- Starts collapsed (empty initially)

### Mobile (375px)
- Count badges: 3 compact pills in a row
- File entries: two-line (filename + X on top, details below)
- Sections collapsible to save vertical space

## Data Flow

1. After processing completes, categorize files:
   - Successful = files with items in `extractedData`
   - Failed = files with 0 items or processing errors
2. Track three arrays: `successfulFiles`, `failedFiles`, `removedFiles`
3. On remove: confirm → move file between arrays → re-render summary → remove/hide receipt group → recalculate stats
4. On retry: re-process single file → on success move to successful → render receipt group → recalculate stats

## Stats Recalculation

When receipts are removed or retried, the existing 4-stat grid recalculates:
- Total Items: count of items in remaining successful receipts
- Total Amount: sum of totals in remaining successful receipts
- Receipts: count of remaining successful receipts
- Stores: count of unique stores in remaining successful receipts

## Error Handling

- All successful receipts removed → show empty state: "No receipts to review"
- Retry fails → toast error, file stays in Failed
- Demo mode: works normally (1 file limit still applies)

## Confirmation Dialog

When user clicks X on a receipt:
- Small inline confirmation: "Remove this receipt? [Yes] [No]"
- If confirmed, receipt moves to Removed section
- Counts update immediately
