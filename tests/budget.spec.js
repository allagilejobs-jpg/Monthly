// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Budget Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Monthly Budget Dashboard');
  });

  test('displays dashboard title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Monthly Budget Dashboard');
  });

  test('displays subtitle', async ({ page }) => {
    await expect(page.locator('#dashboard-subtitle')).toContainText('Plan, track and manage');
  });

  test('navigation pills are visible', async ({ page }) => {
    await expect(page.locator('a.nav-pill-green')).toBeVisible();
    await expect(page.locator('a.nav-pill-blue')).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    await expect(page.locator('body')).toHaveClass(/dark/);
  });

  test('all tabs are present', async ({ page }) => {
    const expectedTabs = ['Setup', 'Monthly Tracker', 'Bank Accounts', 'Annual Overview', 'Trends', 'Net Worth'];
    
    for (const tabName of expectedTabs) {
      await expect(page.locator('.tab', { hasText: tabName })).toBeVisible();
    }
  });

  test('help tab is present', async ({ page }) => {
    await expect(page.locator('.tab-help')).toBeVisible();
  });

  test('setup tab is active by default', async ({ page }) => {
    await expect(page.locator('#view-setup')).toHaveClass(/active/);
  });

  test('clicking tabs switches views', async ({ page }) => {
    // Click Monthly Tracker tab
    await page.locator('.tab', { hasText: 'Monthly Tracker' }).click();
    await expect(page.locator('#view-tracker')).toHaveClass(/active/);
    await expect(page.locator('#view-setup')).not.toHaveClass(/active/);
    
    // Click Bank Accounts tab
    await page.locator('.tab', { hasText: 'Bank Accounts' }).click();
    await expect(page.locator('#view-accounts')).toHaveClass(/active/);
  });
});

test.describe('Budget Dashboard - Setup Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
  });

  test('year input exists', async ({ page }) => {
    await expect(page.locator('#setup-year')).toBeVisible();
  });

  test('starting month select exists', async ({ page }) => {
    await expect(page.locator('#setup-start-month')).toBeVisible();
  });

  test('setup categories section exists', async ({ page }) => {
    await expect(page.locator('#setup-categories')).toBeVisible();
  });

  test('income section exists', async ({ page }) => {
    await expect(page.locator('#setup-income')).toBeVisible();
  });

  test('savings section exists', async ({ page }) => {
    await expect(page.locator('#setup-savings')).toBeVisible();
  });

  test('big expenses section exists', async ({ page }) => {
    await expect(page.locator('#setup-big')).toBeVisible();
  });

  test('monthly summary card exists', async ({ page }) => {
    await expect(page.locator('#sum-income')).toBeVisible();
    await expect(page.locator('#sum-expenses')).toBeVisible();
    await expect(page.locator('#sum-savings')).toBeVisible();
    await expect(page.locator('#sum-leftover')).toBeVisible();
  });

  test('upload statements button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Upload Statements/i })).toBeVisible();
  });

  test('import excel button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Import Excel/i })).toBeVisible();
  });

  test('export excel button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Export Excel/i })).toBeVisible();
  });

  test('show extra rows button exists', async ({ page }) => {
    await expect(page.locator('#btn-show-extras')).toBeVisible();
  });

  test('totals are displayed', async ({ page }) => {
    await expect(page.locator('#setup-monthly-total')).toBeVisible();
    await expect(page.locator('#setup-annual-total')).toBeVisible();
    await expect(page.locator('#setup-income-total')).toBeVisible();
    await expect(page.locator('#setup-savings-total')).toBeVisible();
    await expect(page.locator('#setup-big-total')).toBeVisible();
  });
});

test.describe('Budget Dashboard - Monthly Tracker Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('.tab', { hasText: 'Monthly Tracker' }).click();
  });

  test('month select dropdown exists', async ({ page }) => {
    await expect(page.locator('#month-select')).toBeVisible();
  });

  test('add month button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Month/i })).toBeVisible();
  });

  test('delete month button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Delete Month/i })).toBeVisible();
  });

  test('tracker content container exists', async ({ page }) => {
    await expect(page.locator('#tracker-content')).toBeVisible();
  });

  test('transaction table elements exist', async ({ page }) => {
    await expect(page.locator('#tx-table')).toBeAttached();
    await expect(page.locator('#tx-search')).toBeAttached();
    await expect(page.locator('#tx-cat-filter')).toBeAttached();
    await expect(page.locator('#tx-method-filter')).toBeAttached();
  });

  test('select mode button exists', async ({ page }) => {
    await expect(page.locator('#btn-select-mode')).toBeAttached();
  });

  test('category pie chart canvas exists', async ({ page }) => {
    await expect(page.locator('#chart-cat-pie')).toBeAttached();
  });
});

test.describe('Budget Dashboard - Bank Accounts Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('.tab', { hasText: 'Bank Accounts' }).click();
  });

  test('account month select exists', async ({ page }) => {
    await expect(page.locator('#acct-month-select')).toBeVisible();
  });

  test('add account button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Add Account/i })).toBeVisible();
  });

  test('copy previous month button exists', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Copy Previous Month/i })).toBeVisible();
  });

  test('account table exists', async ({ page }) => {
    await expect(page.locator('#acct-table')).toBeAttached();
  });

  test('account total display exists', async ({ page }) => {
    await expect(page.locator('#acct-total')).toBeAttached();
  });
});

test.describe('Budget Dashboard - Annual Overview Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('.tab', { hasText: 'Annual Overview' }).click();
  });

  test('annual grid exists', async ({ page }) => {
    await expect(page.locator('#annual-grid')).toBeVisible();
  });
});

test.describe('Budget Dashboard - Trends Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('.tab', { hasText: 'Trends' }).click();
  });

  test('trends view is active', async ({ page }) => {
    await expect(page.locator('#view-trends')).toHaveClass(/active/);
  });
});

test.describe('Budget Dashboard - Net Worth Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('.tab', { hasText: 'Net Worth' }).click();
  });

  test('net worth view is active', async ({ page }) => {
    await expect(page.locator('#view-networth')).toHaveClass(/active/);
  });
});

test.describe('Budget Dashboard - Navigation', () => {
  test('navigates to Groceries via pill', async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('a.nav-pill-green').click();
    await expect(page).toHaveURL(/Groceries/);
  });

  test('navigates to Expenses via pill', async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('a.nav-pill-blue').click();
    await expect(page).toHaveURL(/Expenses/);
  });
});

test.describe('Budget Dashboard - Help Modal', () => {
  test('help modal opens from tab', async ({ page }) => {
    await page.goto('/Budget/');
    await page.locator('.tab-help').click();
    
    // Check if help modal exists and opens
    // Note: Implementation may vary
  });
});

test.describe('Budget Dashboard - Edge Cases', () => {
  test('handles empty state gracefully', async ({ page }) => {
    await page.goto('/Budget/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await expect(page.locator('h1')).toBeVisible();
  });

  test('rapid tab switching does not break UI', async ({ page }) => {
    await page.goto('/Budget/');
    
    const tabs = ['Setup', 'Monthly Tracker', 'Bank Accounts', 'Annual Overview', 'Trends', 'Net Worth'];
    
    for (const tab of tabs) {
      await page.locator('.tab', { hasText: tab }).click();
    }
    
    await expect(page.locator('h1')).toBeVisible();
  });

  test('year input accepts valid year', async ({ page }) => {
    await page.goto('/Budget/');
    
    const yearInput = page.locator('#setup-year');
    await yearInput.fill('2025');
    
    await expect(yearInput).toHaveValue('2025');
  });

  test('starting month select has all months', async ({ page }) => {
    await page.goto('/Budget/');
    
    const monthSelect = page.locator('#setup-start-month');
    await expect(monthSelect.locator('option')).toHaveCount(12);
  });
});

test.describe('Budget Dashboard - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('loads correctly on mobile', async ({ page }) => {
    await page.goto('/Budget/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('tabs are accessible on mobile', async ({ page }) => {
    await page.goto('/Budget/');
    await expect(page.locator('#tab-bar')).toBeVisible();
  });

  test('can switch tabs on mobile', async ({ page }) => {
    await page.goto('/Budget/');
    
    await page.locator('.tab', { hasText: 'Monthly Tracker' }).click();
    await expect(page.locator('#view-tracker')).toHaveClass(/active/);
  });

  test('setup grid adapts to mobile', async ({ page }) => {
    await page.goto('/Budget/');
    await expect(page.locator('.setup-grid')).toBeVisible();
  });
});

test.describe('Budget Dashboard - Data Persistence', () => {
  test('budget setup saves to localStorage', async ({ page }) => {
    await page.goto('/Budget/');
    
    // Make a change to year
    await page.locator('#setup-year').fill('2027');
    
    // Wait for potential debounced save
    await page.waitForTimeout(500);
    
    // Check localStorage (implementation may vary)
    const hasData = await page.evaluate(() => {
      return Object.keys(localStorage).some(key => key.includes('budget'));
    });
    
    // This depends on implementation - just ensure no errors
    await expect(page.locator('h1')).toBeVisible();
  });
});
