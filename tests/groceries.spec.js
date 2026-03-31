// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Groceries Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Groceries/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Monthly Grocery & Household Spend Dashboard');
  });

  test('displays dashboard title', async ({ page }) => {
    await expect(page.locator('#dashboard-title')).toContainText('Grocery');
  });

  test('navigation pills are visible', async ({ page }) => {
    await expect(page.locator('a.nav-pill-blue')).toBeVisible();
    await expect(page.locator('a.nav-pill-purple')).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    await expect(page.locator('body')).toHaveClass(/dark/);
  });

  test('all tabs are present', async ({ page }) => {
    const expectedTabs = ['Overview', 'Groceries', 'Non-Grocery', 'By Store', 'Trends', 'Trips', 'All Items', 'Compare'];
    
    for (const tabName of expectedTabs) {
      await expect(page.locator('.tab', { hasText: tabName })).toBeVisible();
    }
  });

  test('overview tab is active by default', async ({ page }) => {
    await expect(page.locator('.tab[data-view="overview"]')).toHaveClass(/active/);
    await expect(page.locator('#view-overview')).toHaveClass(/active/);
  });

  test('clicking tabs switches views', async ({ page }) => {
    // Click Groceries tab
    await page.locator('.tab[data-view="groceries"]').click();
    await expect(page.locator('#view-groceries')).toHaveClass(/active/);
    await expect(page.locator('#view-overview')).not.toHaveClass(/active/);
    
    // Click Non-Grocery tab
    await page.locator('.tab[data-view="nongrocery"]').click();
    await expect(page.locator('#view-nongrocery')).toHaveClass(/active/);
  });

  test('global search is visible', async ({ page }) => {
    const searchInput = page.locator('#global-search');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Search/i);
  });

  test('month select dropdown exists', async ({ page }) => {
    await expect(page.locator('#month-select')).toBeVisible();
  });

  test('upload month button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload Month/i })).toBeVisible();
  });

  test('manage data button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Manage Data/i })).toBeVisible();
  });

  test('help button is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Help/i })).toBeVisible();
  });

  test('help modal opens and closes', async ({ page }) => {
    // Open help modal
    await page.getByRole('button', { name: /Help/i }).click();
    
    const helpModal = page.locator('#help-modal');
    await expect(helpModal).toBeVisible();
    
    // Close via button
    await helpModal.locator('button', { hasText: 'Close' }).click();
    await expect(helpModal).not.toBeVisible();
  });

  test('upload choice modal opens', async ({ page }) => {
    await page.getByRole('button', { name: /Upload Month/i }).click();
    
    const uploadModal = page.locator('#upload-choice-modal');
    await expect(uploadModal).toBeVisible();
    await expect(uploadModal.locator('.modal-title')).toContainText('Upload Monthly Data');
  });

  test('data manager modal opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: /Manage Data/i }).click();
    
    const managerModal = page.locator('#manager-modal');
    await expect(managerModal).toBeVisible();
    
    // Close via button
    await managerModal.locator('button', { hasText: 'Close' }).click();
    await expect(managerModal).not.toBeVisible();
  });

  test('filter bar visible in All Items view', async ({ page }) => {
    await page.locator('.tab[data-view="items"]').click();
    
    await expect(page.locator('#filter-date')).toBeVisible();
    await expect(page.locator('#filter-store')).toBeVisible();
    await expect(page.locator('#filter-cat')).toBeVisible();
    await expect(page.locator('#filter-type')).toBeVisible();
    await expect(page.locator('#filter-search')).toBeVisible();
  });

  test('clear filters button exists', async ({ page }) => {
    await page.locator('.tab[data-view="items"]').click();
    await expect(page.locator('.btn-clear')).toBeVisible();
  });

  test('select mode button exists in All Items', async ({ page }) => {
    await page.locator('.tab[data-view="items"]').click();
    await expect(page.locator('#btn-select-mode')).toBeVisible();
  });

  test('overview shows KPI grid', async ({ page }) => {
    await expect(page.locator('#kpi-overview')).toBeVisible();
  });

  test('chart canvases exist in overview', async ({ page }) => {
    await expect(page.locator('#chart-cat-pie')).toBeVisible();
    await expect(page.locator('#chart-store-pie')).toBeVisible();
    await expect(page.locator('#chart-weekly')).toBeVisible();
    await expect(page.locator('#chart-split')).toBeVisible();
  });

  test('insights section exists', async ({ page }) => {
    await expect(page.locator('#insights')).toBeVisible();
  });
});

test.describe('Groceries Dashboard - Demo Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Groceries/?demo=true');
  });

  test('loads demo data correctly', async ({ page }) => {
    // Demo mode should load sample data
    await page.waitForTimeout(500); // Allow demo data to load
    
    // KPIs should show values (not just $0.00)
    const kpiGrid = page.locator('#kpi-overview');
    await expect(kpiGrid).toBeVisible();
  });

  test('demo mode persists in sessionStorage', async ({ page }) => {
    const demoMode = await page.evaluate(() => sessionStorage.getItem('demo_mode'));
    expect(demoMode).toBe('true');
  });
});

test.describe('Groceries Dashboard - Navigation', () => {
  test('navigates to Expenses via pill', async ({ page }) => {
    await page.goto('/Groceries/');
    await page.locator('a.nav-pill-blue').click();
    await expect(page).toHaveURL(/Expenses/);
  });

  test('navigates to Budget via pill', async ({ page }) => {
    await page.goto('/Groceries/');
    await page.locator('a.nav-pill-purple').click();
    await expect(page).toHaveURL(/Budget/);
  });
});

test.describe('Groceries Dashboard - Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Groceries/');
  });

  test('groceries tab shows grocery-specific content', async ({ page }) => {
    await page.locator('.tab[data-view="groceries"]').click();
    
    await expect(page.locator('#kpi-grocery')).toBeVisible();
    await expect(page.locator('#chart-grocery-cat')).toBeVisible();
    await expect(page.locator('#chart-grocery-top')).toBeVisible();
  });

  test('non-grocery tab shows non-grocery content', async ({ page }) => {
    await page.locator('.tab[data-view="nongrocery"]').click();
    
    await expect(page.locator('#kpi-nongrocery')).toBeVisible();
    await expect(page.locator('#chart-nongrocery-cat')).toBeVisible();
    await expect(page.locator('#chart-nongrocery-store')).toBeVisible();
  });

  test('stores tab shows store breakdown', async ({ page }) => {
    await page.locator('.tab[data-view="stores"]').click();
    
    await expect(page.locator('#chart-store-bar')).toBeVisible();
    await expect(page.locator('#store-breakdown')).toBeVisible();
  });

  test('trends tab shows trend charts', async ({ page }) => {
    await page.locator('.tab[data-view="trends"]').click();
    
    await expect(page.locator('#chart-daily')).toBeVisible();
    await expect(page.locator('#chart-cumulative')).toBeVisible();
    await expect(page.locator('#chart-trips-week')).toBeVisible();
    await expect(page.locator('#chart-avg-trip')).toBeVisible();
  });

  test('trips tab shows trips list', async ({ page }) => {
    await page.locator('.tab[data-view="trips"]').click();
    
    await expect(page.locator('#kpi-trips')).toBeVisible();
    await expect(page.locator('#trips-list')).toBeVisible();
  });

  test('compare tab shows compare content', async ({ page }) => {
    await page.locator('.tab[data-view="compare"]').click();
    
    await expect(page.locator('#compare-content')).toBeVisible();
  });
});

test.describe('Groceries Dashboard - Edge Cases', () => {
  test('handles empty state gracefully', async ({ page }) => {
    // Clear localStorage first
    await page.goto('/Groceries/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    
    // Should still load without errors
    await expect(page.locator('#dashboard-title')).toBeVisible();
  });

  test('search with no results shows appropriate state', async ({ page }) => {
    await page.goto('/Groceries/');
    const searchInput = page.locator('#global-search');
    
    await searchInput.fill('xyznonexistentproduct12345');
    await searchInput.focus();
    
    // Wait a moment for search to process
    await page.waitForTimeout(300);
    
    // Results container should be visible (even if empty)
    const resultsContainer = page.locator('#global-search-results');
    await expect(resultsContainer).toBeVisible();
  });

  test('rapid tab switching does not break UI', async ({ page }) => {
    await page.goto('/Groceries/');
    
    const tabs = ['overview', 'groceries', 'nongrocery', 'stores', 'trends', 'trips', 'items', 'compare'];
    
    for (const tab of tabs) {
      await page.locator(`.tab[data-view="${tab}"]`).click();
    }
    
    // UI should still be functional
    await expect(page.locator('#dashboard-title')).toBeVisible();
  });

  test('modal can be closed by clicking overlay', async ({ page }) => {
    await page.goto('/Groceries/');
    
    // Open help modal
    await page.getByRole('button', { name: /Help/i }).click();
    await expect(page.locator('#help-modal')).toBeVisible();
    
    // Click on overlay (outside modal)
    await page.locator('#help-modal').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#help-modal')).not.toBeVisible();
  });
});

test.describe('Groceries Dashboard - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('loads correctly on mobile', async ({ page }) => {
    await page.goto('/Groceries/');
    await expect(page.locator('#dashboard-title')).toBeVisible();
  });

  test('tabs are scrollable on mobile', async ({ page }) => {
    await page.goto('/Groceries/');
    await expect(page.locator('.tabs')).toBeVisible();
  });

  test('can switch tabs on mobile', async ({ page }) => {
    await page.goto('/Groceries/');
    
    await page.locator('.tab[data-view="groceries"]').click();
    await expect(page.locator('#view-groceries')).toHaveClass(/active/);
  });
});
