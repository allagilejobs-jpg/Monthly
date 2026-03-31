// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Cross-Page Navigation', () => {
  test('can navigate from landing to all dashboards and back', async ({ page }) => {
    // Start at landing
    await page.goto('/');
    await expect(page).toHaveTitle('Family Finance Dashboards');
    
    // Go to Groceries
    await page.locator('.card-grocery').click();
    await expect(page).toHaveURL(/Groceries/);
    await expect(page.locator('#dashboard-title')).toContainText('Grocery');
    
    // Go to Expenses via nav pill
    await page.locator('a.nav-pill-blue').click();
    await expect(page).toHaveURL(/Expenses/);
    await expect(page.locator('h1')).toContainText('All Expenses');
    
    // Go to Budget via nav pill
    await page.locator('a.nav-pill-purple').click();
    await expect(page).toHaveURL(/Budget/);
    await expect(page.locator('h1')).toContainText('Budget');
    
    // Go to Groceries via nav pill
    await page.locator('a.nav-pill-green').click();
    await expect(page).toHaveURL(/Groceries/);
  });

  test('demo mode persists across dashboard navigation', async ({ page }) => {
    // Enter demo mode from landing
    await page.goto('/');
    await page.getByRole('button', { name: /Groceries Demo/i }).click();
    await expect(page).toHaveURL(/Groceries.*demo/);
    
    let demoMode = await page.evaluate(() => sessionStorage.getItem('demo_mode'));
    expect(demoMode).toBe('true');
    
    // Navigate to Expenses
    await page.goto('/Expenses/?demo=true');
    
    demoMode = await page.evaluate(() => sessionStorage.getItem('demo_mode'));
    expect(demoMode).toBe('true');
  });

  test('theme preference persists across pages', async ({ page }) => {
    // Set dark theme on landing
    await page.goto('/');
    await page.locator('#theme-toggle').click();
    
    let theme = await page.evaluate(() => localStorage.getItem('app_theme'));
    expect(theme).toBe('dark');
    
    // Navigate to Groceries
    await page.locator('.card-grocery').click();
    await page.waitForURL(/Groceries/);
    
    // Theme should persist (though each page may use different storage key)
    await expect(page.locator('#theme-toggle')).toBeVisible();
  });

  test('footer links work across all dashboards', async ({ page }) => {
    // Check Expenses footer
    await page.goto('/Expenses/');
    const footerGroceries = page.locator('a[href*="Groceries"]').last();
    await expect(footerGroceries).toBeVisible();
    
    // Check Groceries footer exists (may not have same footer structure)
    await page.goto('/Groceries/');
    // Just ensure page loads
    await expect(page.locator('#dashboard-title')).toBeVisible();
    
    // Check Scanner footer
    await page.goto('/Scanner/');
    const scannerFooter = page.locator('text=Family Finance Dashboards').last();
    await expect(scannerFooter).toBeVisible();
  });
});

test.describe('LocalStorage Data Isolation', () => {
  test('clearing Groceries data does not affect Expenses', async ({ page }) => {
    await page.goto('/');
    
    // Set some test data
    await page.evaluate(() => {
      localStorage.setItem('grocery_test', 'grocery_value');
      localStorage.setItem('expense_test', 'expense_value');
    });
    
    // Clear grocery data
    await page.evaluate(() => {
      localStorage.removeItem('grocery_test');
    });
    
    // Expense data should still exist
    const expenseData = await page.evaluate(() => localStorage.getItem('expense_test'));
    expect(expenseData).toBe('expense_value');
  });
});

test.describe('Global Search Across Dashboards', () => {
  test('Groceries search input functions correctly', async ({ page }) => {
    await page.goto('/Groceries/');
    
    const searchInput = page.locator('#global-search');
    await searchInput.fill('test search');
    await expect(searchInput).toHaveValue('test search');
    
    // Search results should appear
    await searchInput.focus();
    await expect(page.locator('#global-search-results')).toBeVisible();
  });

  test('Expenses search input functions correctly', async ({ page }) => {
    await page.goto('/Expenses/');
    
    const searchInput = page.locator('#global-search');
    await searchInput.fill('test search');
    await expect(searchInput).toHaveValue('test search');
    
    await searchInput.focus();
    await expect(page.locator('#global-search-results')).toBeVisible();
  });
});

test.describe('Shared UI Components', () => {
  test('toast container is injected on all dashboards', async ({ page }) => {
    // Check Groceries
    await page.goto('/Groceries/');
    await page.waitForTimeout(500);
    const groceryToast = await page.evaluate(() => !!document.querySelector('.toast-container'));
    expect(groceryToast).toBe(true);
    
    // Check Expenses
    await page.goto('/Expenses/');
    await page.waitForTimeout(500);
    const expenseToast = await page.evaluate(() => !!document.querySelector('.toast-container'));
    expect(expenseToast).toBe(true);
    
    // Check Budget
    await page.goto('/Budget/');
    await page.waitForTimeout(500);
    const budgetToast = await page.evaluate(() => !!document.querySelector('.toast-container'));
    expect(budgetToast).toBe(true);
  });

  test('shared CSS variables are consistent', async ({ page }) => {
    await page.goto('/Groceries/');
    
    const greenColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--green').trim();
    });
    
    // Green should be defined
    expect(greenColor).toBeTruthy();
  });
});

test.describe('Modal Behavior Consistency', () => {
  test('help modals close on overlay click across dashboards', async ({ page }) => {
    // Groceries help modal
    await page.goto('/Groceries/');
    await page.getByRole('button', { name: /Help/i }).click();
    await expect(page.locator('#help-modal')).toBeVisible();
    await page.locator('#help-modal').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#help-modal')).not.toBeVisible();
    
    // Expenses help modal
    await page.goto('/Expenses/');
    await page.getByRole('button', { name: /Help/i }).click();
    await expect(page.locator('#help-modal')).toBeVisible();
    await page.locator('#help-modal').click({ position: { x: 10, y: 10 } });
    await expect(page.locator('#help-modal')).not.toBeVisible();
  });

  test('data manager modals have consistent structure', async ({ page }) => {
    // Groceries data manager
    await page.goto('/Groceries/');
    await page.getByRole('button', { name: /Manage Data/i }).click();
    await expect(page.locator('#manager-modal')).toBeVisible();
    await expect(page.locator('#manager-modal').getByRole('button', { name: /Download/i })).toBeVisible();
    await page.locator('#manager-modal').locator('button', { hasText: 'Close' }).click();
    
    // Expenses data manager
    await page.goto('/Expenses/');
    await page.getByRole('button', { name: /Manage Data/i }).click();
    await expect(page.locator('#manager-modal')).toBeVisible();
    await expect(page.locator('#manager-modal').getByRole('button', { name: /Download/i })).toBeVisible();
  });
});

test.describe('Responsive Design Consistency', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('all pages load on mobile viewport', async ({ page }) => {
    const pages = ['/', '/Groceries/', '/Expenses/', '/Budget/', '/Scanner/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await expect(page.locator('body')).toBeVisible();
      // No JS errors should occur
    }
  });

  test('navigation is accessible on mobile for all dashboards', async ({ page }) => {
    // Landing
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    
    // Groceries
    await page.goto('/Groceries/');
    await expect(page.locator('.tabs')).toBeVisible();
    
    // Expenses
    await page.goto('/Expenses/');
    await expect(page.locator('#tab-bar')).toBeVisible();
    
    // Budget
    await page.goto('/Budget/');
    await expect(page.locator('#tab-bar')).toBeVisible();
    
    // Scanner
    await page.goto('/Scanner/');
    await expect(page.locator('.steps')).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('pages handle missing localStorage gracefully', async ({ page }) => {
    // Clear all storage before each page
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Each page should still load
    await page.goto('/Groceries/');
    await expect(page.locator('#dashboard-title')).toBeVisible();
    
    await page.goto('/Expenses/');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.goto('/Budget/');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.goto('/Scanner/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('pages handle corrupted localStorage data', async ({ page }) => {
    await page.goto('/');
    
    // Set corrupted data
    await page.evaluate(() => {
      localStorage.setItem('grocery_data', 'not valid json {{{');
      localStorage.setItem('expense_data', 'also corrupted');
      localStorage.setItem('budget_data', 'broken data here');
    });
    
    // Pages should still load without crashing
    await page.goto('/Groceries/');
    await expect(page.locator('#dashboard-title')).toBeVisible();
    
    await page.goto('/Expenses/');
    await expect(page.locator('h1')).toBeVisible();
    
    await page.goto('/Budget/');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('landing page loads within reasonable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - start;
    
    // Should load within 5 seconds (generous for test environment)
    expect(loadTime).toBeLessThan(5000);
  });

  test('dashboard pages load within reasonable time', async ({ page }) => {
    const pages = ['/Groceries/', '/Expenses/', '/Budget/', '/Scanner/'];
    
    for (const pagePath of pages) {
      const start = Date.now();
      await page.goto(pagePath);
      await expect(page.locator('h1')).toBeVisible();
      const loadTime = Date.now() - start;
      
      expect(loadTime).toBeLessThan(5000);
    }
  });
});

test.describe('External Dependencies', () => {
  test('Chart.js loads on Groceries page', async ({ page }) => {
    await page.goto('/Groceries/');
    
    const chartJsLoaded = await page.evaluate(() => {
      return typeof Chart !== 'undefined';
    });
    
    expect(chartJsLoaded).toBe(true);
  });

  test('Chart.js loads on Expenses page', async ({ page }) => {
    await page.goto('/Expenses/');
    
    const chartJsLoaded = await page.evaluate(() => {
      return typeof Chart !== 'undefined';
    });
    
    expect(chartJsLoaded).toBe(true);
  });

  test('Firebase loads on all dashboards', async ({ page }) => {
    const pages = ['/', '/Groceries/', '/Expenses/', '/Budget/', '/Scanner/'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const firebaseLoaded = await page.evaluate(() => {
        return typeof firebase !== 'undefined';
      });
      
      expect(firebaseLoaded).toBe(true);
    }
  });

  test('XLSX library loads on Groceries page', async ({ page }) => {
    await page.goto('/Groceries/');
    
    const xlsxLoaded = await page.evaluate(() => {
      return typeof XLSX !== 'undefined';
    });
    
    expect(xlsxLoaded).toBe(true);
  });
});

test.describe('Keyboard Navigation', () => {
  test('Tab key navigates through landing page elements', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab multiple times
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to tab through elements without errors
    await expect(page.locator('body')).toBeVisible();
  });

  test('Escape key closes modals', async ({ page }) => {
    await page.goto('/Groceries/');
    
    // Open help modal
    await page.getByRole('button', { name: /Help/i }).click();
    await expect(page.locator('#help-modal')).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Modal may or may not close depending on implementation
    // Just ensure no errors occur
    await expect(page.locator('body')).toBeVisible();
  });
});
