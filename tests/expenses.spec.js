// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Expenses Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Expenses/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('All Expenses Dashboard');
  });

  test('displays dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('All Expenses Dashboard');
  });

  test('displays subtitle', async ({ page }) => {
    await expect(page.locator('#dashboard-subtitle')).toContainText('Upload bank statements');
  });

  test('navigation pills are visible', async ({ page }) => {
    await expect(page.locator('a.nav-pill-purple')).toBeVisible();
    await expect(page.locator('a.nav-pill-green')).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    await expect(page.locator('body')).toHaveClass(/dark/);
  });

  test('all tabs are present', async ({ page }) => {
    const expectedTabs = ['Overview', 'By Category', 'By Merchant', 'Trends', 'All Transactions'];
    
    for (const tabName of expectedTabs) {
      await expect(page.locator('.tab', { hasText: tabName })).toBeVisible();
    }
  });

  test('overview tab is active by default', async ({ page }) => {
    await expect(page.locator('#view-overview')).toHaveClass(/active/);
  });

  test('clicking tabs switches views', async ({ page }) => {
    // Click Categories tab
    await page.locator('.tab', { hasText: 'By Category' }).click();
    await expect(page.locator('#view-categories')).toHaveClass(/active/);
    await expect(page.locator('#view-overview')).not.toHaveClass(/active/);
    
    // Click Merchants tab
    await page.locator('.tab', { hasText: 'By Merchant' }).click();
    await expect(page.locator('#view-merchants')).toHaveClass(/active/);
  });

  test('global search is visible', async ({ page }) => {
    const searchInput = page.locator('#global-search');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Search merchants/i);
  });

  test('month select dropdown exists', async ({ page }) => {
    await expect(page.locator('#month-select')).toBeVisible();
  });

  test('upload statement button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload Statement/i })).toBeVisible();
  });

  test('manage data button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Manage Data/i })).toBeVisible();
  });

  test('help button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Help/i })).toBeVisible();
  });

  test('help modal opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: /Help/i }).click();
    
    const helpModal = page.locator('#help-modal');
    await expect(helpModal).toBeVisible();
    await expect(helpModal.locator('.modal-title')).toContainText('All Expenses Dashboard');
    
    // Close via button
    await helpModal.locator('button', { hasText: 'Close' }).click();
    await expect(helpModal).not.toBeVisible();
  });

  test('upload modal opens', async ({ page }) => {
    await page.getByRole('button', { name: /Upload Statement/i }).click();
    
    const uploadModal = page.locator('#upload-modal');
    await expect(uploadModal).toBeVisible();
    await expect(uploadModal.locator('.modal-title')).toContainText('Upload Bank Statements');
  });

  test('upload modal has drag and drop zone', async ({ page }) => {
    await page.getByRole('button', { name: /Upload Statement/i }).click();
    
    const dropZone = page.locator('#drop-zone');
    await expect(dropZone).toBeVisible();
    await expect(dropZone).toContainText('Drop files here');
  });

  test('data manager modal opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: /Manage Data/i }).click();
    
    const managerModal = page.locator('#manager-modal');
    await expect(managerModal).toBeVisible();
    
    await managerModal.locator('button', { hasText: 'Close' }).click();
    await expect(managerModal).not.toBeVisible();
  });
});

test.describe('Expenses Dashboard - Demo Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Expenses/?demo=true');
  });

  test('loads demo data correctly', async ({ page }) => {
    await page.waitForTimeout(500);
    
    // Should show overview content
    await expect(page.locator('#view-overview')).toHaveClass(/active/);
  });

  test('demo mode persists in sessionStorage', async ({ page }) => {
    const demoMode = await page.evaluate(() => sessionStorage.getItem('demo_mode'));
    expect(demoMode).toBe('true');
  });
});

test.describe('Expenses Dashboard - Navigation', () => {
  test('navigates to Budget via pill', async ({ page }) => {
    await page.goto('/Expenses/');
    await page.locator('a.nav-pill-purple').click();
    await expect(page).toHaveURL(/Budget/);
  });

  test('navigates to Groceries via pill', async ({ page }) => {
    await page.goto('/Expenses/');
    await page.locator('a.nav-pill-green').click();
    await expect(page).toHaveURL(/Groceries/);
  });
});

test.describe('Expenses Dashboard - Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Expenses/');
  });

  test('all transactions tab shows transaction table', async ({ page }) => {
    await page.locator('.tab', { hasText: 'All Transactions' }).click();
    await expect(page.locator('#view-transactions')).toHaveClass(/active/);
  });

  test('categories tab shows category view', async ({ page }) => {
    await page.locator('.tab', { hasText: 'By Category' }).click();
    await expect(page.locator('#view-categories')).toHaveClass(/active/);
  });

  test('merchants tab shows merchant view', async ({ page }) => {
    await page.locator('.tab', { hasText: 'By Merchant' }).click();
    await expect(page.locator('#view-merchants')).toHaveClass(/active/);
  });

  test('trends tab shows trends view', async ({ page }) => {
    await page.locator('.tab', { hasText: 'Trends' }).click();
    await expect(page.locator('#view-trends')).toHaveClass(/active/);
  });

  test('compare tab hidden initially', async ({ page }) => {
    // Compare tab should be hidden when there's not enough data
    const compareTab = page.locator('#tab-compare');
    await expect(compareTab).toHaveAttribute('style', /display:\s*none/i);
  });
});

test.describe('Expenses Dashboard - Upload Modal Steps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Expenses/');
    await page.getByRole('button', { name: /Upload Statement/i }).click();
  });

  test('upload modal shows step indicators', async ({ page }) => {
    await expect(page.locator('.step-dot')).toHaveCount(3);
    await expect(page.locator('.step-dot.active')).toHaveCount(1);
  });

  test('file input accepts correct formats', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    await expect(fileInput).toHaveAttribute('accept', /csv|pdf|xlsx|xls/i);
  });

  test('file input accepts multiple files', async ({ page }) => {
    const fileInput = page.locator('#file-input');
    await expect(fileInput).toHaveAttribute('multiple', '');
  });
});

test.describe('Expenses Dashboard - Add Transaction Modal', () => {
  test('add modal has all required fields', async ({ page }) => {
    await page.goto('/Expenses/');
    
    // We need to check if the add modal structure exists
    const addModal = page.locator('#add-modal');
    
    // Check modal structure (even if not visible)
    await expect(addModal.locator('#add-date')).toBeAttached();
    await expect(addModal.locator('#add-merchant')).toBeAttached();
    await expect(addModal.locator('#add-category')).toBeAttached();
    await expect(addModal.locator('#add-amount')).toBeAttached();
    await expect(addModal.locator('#add-source-type')).toBeAttached();
  });
});

test.describe('Expenses Dashboard - Edit Modal', () => {
  test('edit modal has correct structure', async ({ page }) => {
    await page.goto('/Expenses/');
    
    const editModal = page.locator('#edit-modal');
    
    await expect(editModal.locator('#edit-category')).toBeAttached();
    await expect(editModal.locator('#edit-merchant')).toBeAttached();
    await expect(editModal.locator('#edit-apply-all')).toBeAttached();
    await expect(editModal.locator('#edit-remember')).toBeAttached();
  });
});

test.describe('Expenses Dashboard - Edge Cases', () => {
  test('handles empty state gracefully', async ({ page }) => {
    await page.goto('/Expenses/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
  });

  test('search with no results shows appropriate state', async ({ page }) => {
    await page.goto('/Expenses/');
    const searchInput = page.locator('#global-search');
    
    await searchInput.fill('xyznonexistentmerchant12345');
    await searchInput.focus();
    
    await page.waitForTimeout(300);
    
    const resultsContainer = page.locator('#global-search-results');
    await expect(resultsContainer).toBeVisible();
  });

  test('rapid tab switching does not break UI', async ({ page }) => {
    await page.goto('/Expenses/');
    
    const tabs = ['overview', 'categories', 'merchants', 'trends', 'transactions'];
    
    for (const tab of tabs) {
      await page.locator('.tab', { hasText: new RegExp(tab, 'i') }).click();
    }
    
    await expect(page.locator('h1')).toBeVisible();
  });

  test('modal can be closed by clicking overlay', async ({ page }) => {
    await page.goto('/Expenses/');
    
    await page.getByRole('button', { name: /Help/i }).click();
    await expect(page.locator('#help-modal')).toBeVisible();
    
    await page.locator('#help-modal').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#help-modal')).not.toBeVisible();
  });
});

test.describe('Expenses Dashboard - Bulk Actions', () => {
  test('bulk bar exists', async ({ page }) => {
    await page.goto('/Expenses/');
    
    const bulkBar = page.locator('#bulk-bar');
    await expect(bulkBar).toBeAttached();
  });

  test('bulk bar has correct buttons', async ({ page }) => {
    await page.goto('/Expenses/');
    
    const bulkBar = page.locator('#bulk-bar');
    await expect(bulkBar.locator('.bulk-count')).toBeAttached();
    await expect(bulkBar.locator('.bulk-recat')).toBeAttached();
    await expect(bulkBar.locator('.bulk-delete')).toBeAttached();
    await expect(bulkBar.locator('.bulk-cancel')).toBeAttached();
  });
});

test.describe('Expenses Dashboard - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('loads correctly on mobile', async ({ page }) => {
    await page.goto('/Expenses/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('tabs are accessible on mobile', async ({ page }) => {
    await page.goto('/Expenses/');
    await expect(page.locator('#tab-bar')).toBeVisible();
  });

  test('can switch tabs on mobile', async ({ page }) => {
    await page.goto('/Expenses/');
    
    await page.locator('.tab', { hasText: 'By Category' }).click();
    await expect(page.locator('#view-categories')).toHaveClass(/active/);
  });
});

test.describe('Expenses Dashboard - Footer Links', () => {
  test('footer contains navigation links', async ({ page }) => {
    await page.goto('/Expenses/');
    
    // Check for footer links
    await expect(page.locator('a[href*="Groceries"]').last()).toBeVisible();
    await expect(page.locator('a[href*="Budget"]').last()).toBeVisible();
    await expect(page.locator('a[href*="Scanner"]').last()).toBeVisible();
  });
});
