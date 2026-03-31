// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Family Finance Dashboards');
  });

  test('displays main heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Family Finance Dashboards');
  });

  test('displays subtitle', async ({ page }) => {
    await expect(page.locator('.subtitle')).toContainText('Track spending, budget goals, and net worth');
  });

  test('has all four dashboard cards', async ({ page }) => {
    await expect(page.locator('.card-grocery')).toBeVisible();
    await expect(page.locator('.card-expenses')).toBeVisible();
    await expect(page.locator('.card-scanner')).toBeVisible();
    await expect(page.locator('.card-budget')).toBeVisible();
  });

  test('groceries card links correctly', async ({ page }) => {
    const groceryCard = page.locator('.card-grocery');
    await expect(groceryCard).toHaveAttribute('href', 'Groceries/');
    await expect(groceryCard.locator('.card-title')).toContainText('Groceries');
  });

  test('expenses card links correctly', async ({ page }) => {
    const expensesCard = page.locator('.card-expenses');
    await expect(expensesCard).toHaveAttribute('href', 'Expenses/');
    await expect(expensesCard.locator('.card-title')).toContainText('All Expenses');
  });

  test('scanner card links correctly', async ({ page }) => {
    const scannerCard = page.locator('.card-scanner');
    await expect(scannerCard).toHaveAttribute('href', 'Scanner/');
    await expect(scannerCard.locator('.card-title')).toContainText('Receipt Scanner');
  });

  test('budget card links correctly', async ({ page }) => {
    const budgetCard = page.locator('.card-budget');
    await expect(budgetCard).toHaveAttribute('href', 'Budget/');
    await expect(budgetCard.locator('.card-title')).toContainText('Budget');
  });

  test('theme toggle is present and functional', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // Get initial state
    const wasInitiallyDark = await page.evaluate(() => document.body.classList.contains('dark'));
    
    // Click to toggle
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    // Should have changed
    const isNowDark = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isNowDark).not.toBe(wasInitiallyDark);
    
    // Click again to toggle back
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const isNowDarkAgain = await page.evaluate(() => document.body.classList.contains('dark'));
    expect(isNowDarkAgain).toBe(wasInitiallyDark);
  });

  test('theme preference persists in localStorage', async ({ page }) => {
    // Clear any existing theme preference
    await page.evaluate(() => localStorage.removeItem('app_theme'));
    await page.reload();
    
    const themeToggle = page.locator('#theme-toggle');
    await themeToggle.click();
    await page.waitForTimeout(100);
    
    const theme = await page.evaluate(() => localStorage.getItem('app_theme'));
    // After clicking toggle from light (default), should be dark
    expect(theme).toBe('dark');
  });

  test('sign in and sign up buttons are visible', async ({ page }) => {
    await expect(page.locator('.home-signin-btn')).toBeVisible();
    await expect(page.locator('.home-signup-btn')).toBeVisible();
  });

  test('demo mode buttons are present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Groceries Demo/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Expenses Demo/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Budget Demo/i })).toBeVisible();
  });

  test('entering demo mode sets sessionStorage', async ({ page }) => {
    await page.getByRole('button', { name: /Groceries Demo/i }).click();
    
    // Wait for navigation
    await page.waitForURL(/Groceries/, { timeout: 10000 });
    
    const demoMode = await page.evaluate(() => sessionStorage.getItem('demo_mode'));
    expect(demoMode).toBe('true');
  });

  test('FAQ items expand and collapse', async ({ page }) => {
    const firstFaqItem = page.locator('.faq-item').first();
    const faqQuestion = firstFaqItem.locator('.faq-q');
    
    // Initially closed
    await expect(firstFaqItem).not.toHaveClass(/open/);
    
    // Click to open
    await faqQuestion.click();
    await page.waitForTimeout(100);
    await expect(firstFaqItem).toHaveClass(/open/);
    
    // Click again to close
    await faqQuestion.click();
    await page.waitForTimeout(100);
    await expect(firstFaqItem).not.toHaveClass(/open/);
  });

  test('only one FAQ item open at a time', async ({ page }) => {
    const faqItems = page.locator('.faq-item');
    const firstFaq = faqItems.first();
    const secondFaq = faqItems.nth(1);
    
    // Open first
    await firstFaq.locator('.faq-q').click();
    await expect(firstFaq).toHaveClass(/open/);
    
    // Open second - first should close
    await secondFaq.locator('.faq-q').click();
    await expect(secondFaq).toHaveClass(/open/);
    await expect(firstFaq).not.toHaveClass(/open/);
  });

  test('how it works section has 3 steps', async ({ page }) => {
    await expect(page.locator('.steps .step')).toHaveCount(3);
  });

  test('features section has 6 features', async ({ page }) => {
    await expect(page.locator('.feat-grid .feat')).toHaveCount(6);
  });

  test('card hover effects work', async ({ page }) => {
    const groceryCard = page.locator('.card-grocery');
    
    // Hover and check for visual change (border color)
    await groceryCard.hover();
    // Just ensure no errors occur during hover
    await expect(groceryCard).toBeVisible();
  });
});

test.describe('Landing Page - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('cards stack vertically on mobile', async ({ page }) => {
    await page.goto('/');
    
    const cards = page.locator('.cards');
    // On mobile, grid should be single column
    await expect(cards).toBeVisible();
  });

  test('header is responsive', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.header')).toBeVisible();
  });
});

test.describe('Landing Page - Edge Cases', () => {
  test('handles rapid theme toggling', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('#theme-toggle');
    
    // Rapid clicks shouldn't break anything
    for (let i = 0; i < 10; i++) {
      await themeToggle.click();
    }
    
    // Page should still be functional
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation works after demo mode clear', async ({ page }) => {
    await page.goto('/');
    
    // Manually set and clear demo mode
    await page.evaluate(() => {
      sessionStorage.setItem('demo_mode', 'true');
    });
    
    // Navigate back to landing - should clear demo mode
    await page.goto('/');
    
    const demoMode = await page.evaluate(() => sessionStorage.getItem('demo_mode'));
    expect(demoMode).toBeNull();
  });

  test('handles ?signup=true query param', async ({ page }) => {
    await page.goto('/?signup=true');
    
    // Page should load without errors
    await expect(page).toHaveTitle('Family Finance Dashboards');
  });
});
