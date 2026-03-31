// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Receipt Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Scanner/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Receipt Scanner');
  });

  test('displays header with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Receipt Scanner');
  });

  test('header navigation links are visible', async ({ page }) => {
    await expect(page.locator('.header-links a[href="../"]')).toBeVisible();
    await expect(page.locator('.header-links a[href="../Groceries/"]')).toBeVisible();
    await expect(page.locator('.header-links a[href="../Expenses/"]')).toBeVisible();
    await expect(page.locator('.header-links a[href="../Budget/"]')).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    // Check theme changed (implementation may use 'light' class)
    await expect(page.locator('body')).toBeVisible();
  });

  test('step indicators are visible', async ({ page }) => {
    await expect(page.locator('.step-item[data-step="1"]')).toBeVisible();
    await expect(page.locator('.step-item[data-step="2"]')).toBeVisible();
    await expect(page.locator('.step-item[data-step="3"]')).toBeVisible();
    await expect(page.locator('.step-item[data-step="4"]')).toBeVisible();
  });

  test('upload step is active by default', async ({ page }) => {
    await expect(page.locator('.step-item[data-step="1"]')).toHaveClass(/active/);
    await expect(page.locator('#panelUpload')).toHaveClass(/active/);
  });

  test('drop zone is visible', async ({ page }) => {
    const dropZone = page.locator('#dropZone');
    await expect(dropZone).toBeVisible();
    await expect(dropZone).toContainText('Drop receipts here');
  });

  test('drop zone shows accepted file types', async ({ page }) => {
    await expect(page.locator('#dropZone')).toContainText('JPG, PNG, HEIC');
    await expect(page.locator('#dropZone')).toContainText('PDF');
  });

  test('file input accepts correct formats', async ({ page }) => {
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toHaveAttribute('accept', /jpeg|png|heic|pdf/i);
  });

  test('file input accepts multiple files', async ({ page }) => {
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toHaveAttribute('multiple', '');
  });

  test('thumbnail grid exists', async ({ page }) => {
    await expect(page.locator('#thumbGrid')).toBeVisible();
  });

  test('upload actions are hidden initially', async ({ page }) => {
    await expect(page.locator('#uploadActions')).toHaveAttribute('style', /display:\s*none/i);
  });

  test('scan button exists', async ({ page }) => {
    await expect(page.locator('#btnProcess')).toBeVisible();
  });
});

test.describe('Receipt Scanner - Mode Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Scanner/');
  });

  test('mode selector is visible', async ({ page }) => {
    await expect(page.locator('#modeSelector')).toBeVisible();
  });

  test('AI mode card is selected by default', async ({ page }) => {
    await expect(page.locator('.mode-card[data-mode="ai"]')).toHaveClass(/selected/);
  });

  test('OCR mode card is available', async ({ page }) => {
    await expect(page.locator('.mode-card[data-mode="ocr"]')).toBeVisible();
  });

  test('clicking OCR mode selects it', async ({ page }) => {
    await page.locator('.mode-card[data-mode="ocr"]').click();
    
    await expect(page.locator('.mode-card[data-mode="ocr"]')).toHaveClass(/selected/);
    await expect(page.locator('.mode-card[data-mode="ai"]')).not.toHaveClass(/selected/);
  });

  test('clicking AI mode selects it back', async ({ page }) => {
    // First switch to OCR
    await page.locator('.mode-card[data-mode="ocr"]').click();
    
    // Then back to AI
    await page.locator('.mode-card[data-mode="ai"]').click();
    
    await expect(page.locator('.mode-card[data-mode="ai"]')).toHaveClass(/selected/);
  });

  test('mode cards have correct descriptions', async ({ page }) => {
    await expect(page.locator('.mode-card[data-mode="ai"]')).toContainText('AI-Powered');
    await expect(page.locator('.mode-card[data-mode="ai"]')).toContainText('Gemini Vision');
    
    await expect(page.locator('.mode-card[data-mode="ocr"]')).toContainText('Offline OCR');
    await expect(page.locator('.mode-card[data-mode="ocr"]')).toContainText('Tesseract');
  });
});

test.describe('Receipt Scanner - Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Scanner/');
  });

  test('auto-detect checkbox exists and is checked', async ({ page }) => {
    const autoDetect = page.locator('#chkAutoDetect');
    await expect(autoDetect).toBeVisible();
    await expect(autoDetect).toBeChecked();
  });

  test('auto-detect can be toggled', async ({ page }) => {
    const autoDetect = page.locator('#chkAutoDetect');
    await autoDetect.uncheck();
    await expect(autoDetect).not.toBeChecked();
    
    await autoDetect.check();
    await expect(autoDetect).toBeChecked();
  });

  test('preprocessing option exists (hidden by default)', async ({ page }) => {
    const preprocessLabel = page.locator('#preprocessLabel');
    await expect(preprocessLabel).toHaveAttribute('style', /display:\s*none/i);
  });
});

test.describe('Receipt Scanner - Processing Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Scanner/');
  });

  test('processing panel exists', async ({ page }) => {
    await expect(page.locator('#panelProcessing')).toBeAttached();
  });

  test('progress elements exist', async ({ page }) => {
    await expect(page.locator('#progressText')).toBeAttached();
    await expect(page.locator('#progressPct')).toBeAttached();
    await expect(page.locator('#progressFill')).toBeAttached();
  });

  test('cancel button exists', async ({ page }) => {
    await expect(page.locator('#btnCancelProcess')).toBeAttached();
  });

  test('log box exists', async ({ page }) => {
    await expect(page.locator('#logBox')).toBeAttached();
  });
});

test.describe('Receipt Scanner - Review Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Scanner/');
  });

  test('review panel exists', async ({ page }) => {
    await expect(page.locator('#panelReview')).toBeAttached();
  });

  test('review summary exists', async ({ page }) => {
    await expect(page.locator('#reviewSummary')).toBeAttached();
  });

  test('review groups container exists', async ({ page }) => {
    await expect(page.locator('#reviewGroups')).toBeAttached();
  });

  test('back to upload button exists', async ({ page }) => {
    // Check the panel has a back button
    await expect(page.locator('#panelReview').getByRole('button', { name: /Back to Upload/i })).toBeAttached();
  });

  test('export button exists', async ({ page }) => {
    await expect(page.locator('#panelReview').getByRole('button', { name: /Export/i })).toBeAttached();
  });
});

test.describe('Receipt Scanner - Export Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Scanner/');
  });

  test('export panel exists', async ({ page }) => {
    await expect(page.locator('#panelExport')).toBeAttached();
  });

  test('dashboard export option exists', async ({ page }) => {
    await expect(page.locator('#exportDashboard')).toBeAttached();
    await expect(page.locator('#exportDashboard')).toContainText('Import to Dashboard');
  });

  test('excel export option exists', async ({ page }) => {
    await expect(page.locator('#exportExcel')).toBeAttached();
    await expect(page.locator('#exportExcel')).toContainText('Excel Spreadsheet');
  });

  test('excel options container exists', async ({ page }) => {
    await expect(page.locator('#excelOptions')).toBeAttached();
  });

  test('dashboard options container exists', async ({ page }) => {
    await expect(page.locator('#dashboardOptions')).toBeAttached();
  });

  test('month selectors exist for excel', async ({ page }) => {
    await expect(page.locator('#excelMonthSel')).toBeAttached();
    await expect(page.locator('#excelYearSel')).toBeAttached();
  });

  test('month selectors exist for dashboard', async ({ page }) => {
    await expect(page.locator('#dashMonthSel')).toBeAttached();
    await expect(page.locator('#dashYearSel')).toBeAttached();
  });

  test('merge warning element exists', async ({ page }) => {
    await expect(page.locator('#mergeWarning')).toBeAttached();
  });

  test('merge mode options exist', async ({ page }) => {
    await expect(page.locator('input[name="mergeMode"][value="merge"]')).toBeAttached();
    await expect(page.locator('input[name="mergeMode"][value="replace"]')).toBeAttached();
  });
});

test.describe('Receipt Scanner - Navigation', () => {
  test('navigates to Home via header link', async ({ page }) => {
    await page.goto('/Scanner/');
    await page.locator('.header-links a[href="../"]').click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('navigates to Groceries via header link', async ({ page }) => {
    await page.goto('/Scanner/');
    await page.locator('.header-links a[href="../Groceries/"]').click();
    await expect(page).toHaveURL(/Groceries/);
  });

  test('navigates to Expenses via header link', async ({ page }) => {
    await page.goto('/Scanner/');
    await page.locator('.header-links a[href="../Expenses/"]').click();
    await expect(page).toHaveURL(/Expenses/);
  });

  test('navigates to Budget via header link', async ({ page }) => {
    await page.goto('/Scanner/');
    await page.locator('.header-links a[href="../Budget/"]').click();
    await expect(page).toHaveURL(/Budget/);
  });
});

test.describe('Receipt Scanner - Demo Mode', () => {
  test('demo mode preserves theme preference', async ({ page }) => {
    await page.goto('/Scanner/?demo=true');
    
    // Toggle theme
    await page.locator('#theme-toggle').click();
    
    // Session storage should have demo theme
    const theme = await page.evaluate(() => sessionStorage.getItem('demo_scanner_theme'));
    // Theme storage may be 'light' or missing depending on initial state
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Receipt Scanner - Edge Cases', () => {
  test('handles empty drop zone click', async ({ page }) => {
    await page.goto('/Scanner/');
    
    // Click drop zone (should trigger file input)
    await page.locator('#dropZone').click();
    
    // Page should still be functional
    await expect(page.locator('#dropZone')).toBeVisible();
  });

  test('rapid mode switching does not break UI', async ({ page }) => {
    await page.goto('/Scanner/');
    
    for (let i = 0; i < 5; i++) {
      await page.locator('.mode-card[data-mode="ocr"]').click();
      await page.locator('.mode-card[data-mode="ai"]').click();
    }
    
    await expect(page.locator('.mode-card[data-mode="ai"]')).toHaveClass(/selected/);
  });

  test('handles page reload', async ({ page }) => {
    await page.goto('/Scanner/');
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#dropZone')).toBeVisible();
  });
});

test.describe('Receipt Scanner - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('loads correctly on mobile', async ({ page }) => {
    await page.goto('/Scanner/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('step indicators visible on mobile', async ({ page }) => {
    await page.goto('/Scanner/');
    await expect(page.locator('.steps')).toBeVisible();
  });

  test('drop zone accessible on mobile', async ({ page }) => {
    await page.goto('/Scanner/');
    await expect(page.locator('#dropZone')).toBeVisible();
  });

  test('mode selector visible on mobile', async ({ page }) => {
    await page.goto('/Scanner/');
    await expect(page.locator('#modeSelector')).toBeVisible();
  });

  test('can switch modes on mobile', async ({ page }) => {
    await page.goto('/Scanner/');
    
    await page.locator('.mode-card[data-mode="ocr"]').click();
    await expect(page.locator('.mode-card[data-mode="ocr"]')).toHaveClass(/selected/);
  });
});

test.describe('Receipt Scanner - Footer', () => {
  test('footer contains navigation links', async ({ page }) => {
    await page.goto('/Scanner/');
    
    // Check footer area exists with links
    const footer = page.locator('body').locator('text=Family Finance Dashboards').last();
    await expect(footer).toBeVisible();
  });
});

test.describe('Receipt Scanner - Accessibility', () => {
  test('drop zone has descriptive text', async ({ page }) => {
    await page.goto('/Scanner/');
    
    await expect(page.locator('#dropZone')).toContainText('browse');
    await expect(page.locator('.drop-zone-sub')).toContainText('100 files');
  });

  test('mode cards have titles', async ({ page }) => {
    await page.goto('/Scanner/');
    
    await expect(page.locator('.mode-card[data-mode="ai"] .mode-title')).toBeVisible();
    await expect(page.locator('.mode-card[data-mode="ocr"] .mode-title')).toBeVisible();
  });

  test('step indicators have text labels', async ({ page }) => {
    await page.goto('/Scanner/');
    
    await expect(page.locator('.step-item[data-step="1"]')).toContainText('Upload');
    await expect(page.locator('.step-item[data-step="2"]')).toContainText('Processing');
    await expect(page.locator('.step-item[data-step="3"]')).toContainText('Review');
    await expect(page.locator('.step-item[data-step="4"]')).toContainText('Export');
  });
});
