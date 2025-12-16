// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('World Clocks E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('page loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('World Clocks');
  });

  test('page loads with 5 default city clocks', async ({ page }) => {
    await page.goto('/');
    const clockCards = page.locator('.clock-card');
    await expect(clockCards).toHaveCount(5);
  });

  test('each clock displays a city name', async ({ page }) => {
    await page.goto('/');
    const cityNames = page.locator('.city-name');
    await expect(cityNames).toHaveCount(5);

    // Check that default cities are displayed
    const expectedCities = ['New York', 'London', 'Tokyo', 'Sydney', 'Paris'];
    for (const city of expectedCities) {
      await expect(page.locator('.city-name', { hasText: city })).toBeVisible();
    }
  });

  test('each clock displays digital time in correct format', async ({ page }) => {
    await page.goto('/');
    const digitalTimes = page.locator('.digital-time');
    await expect(digitalTimes).toHaveCount(5);

    // Check that each digital time matches HH:MM:SS format
    const times = await digitalTimes.allTextContents();
    for (const time of times) {
      expect(time).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    }
  });

  test('clock hands exist and are positioned', async ({ page }) => {
    await page.goto('/');

    // Check first clock has all hands
    const firstClock = page.locator('.clock-card').first();
    await expect(firstClock.locator('.hour-hand')).toBeVisible();
    await expect(firstClock.locator('.minute-hand')).toBeVisible();
    await expect(firstClock.locator('.second-hand')).toBeVisible();

    // Verify hands have transform style (indicating rotation)
    const secondHand = firstClock.locator('.second-hand');
    const style = await secondHand.getAttribute('style');
    expect(style).toContain('transform');
  });

  test('clock hands update over time', async ({ page }) => {
    await page.goto('/');

    const secondHand = page.locator('.clock-card').first().locator('.second-hand');

    // Get initial position
    const initialStyle = await secondHand.getAttribute('style');

    // Wait for 1.5 seconds for update
    await page.waitForTimeout(1500);

    // Get new position
    const newStyle = await secondHand.getAttribute('style');

    // Position should have changed
    expect(newStyle).not.toBe(initialStyle);
  });

  test('add city button is visible', async ({ page }) => {
    await page.goto('/');
    const addBtn = page.locator('#add-city-btn');
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveText('Add City');
  });

  test('add city button is disabled when 5 clocks displayed', async ({ page }) => {
    await page.goto('/');
    const addBtn = page.locator('#add-city-btn');
    await expect(addBtn).toBeDisabled();
  });

  test('clicking add city shows dropdown', async ({ page }) => {
    await page.goto('/');

    // First remove a city so we can add
    const removeBtn = page.locator('.clock-card').first().locator('.remove-btn');
    await removeBtn.click();

    // Now click add city
    const addBtn = page.locator('#add-city-btn');
    await addBtn.click();

    const dropdown = page.locator('#city-dropdown');
    await expect(dropdown).toBeVisible();
  });

  test('dropdown contains available cities', async ({ page }) => {
    await page.goto('/');

    // Remove a city first
    await page.locator('.clock-card').first().locator('.remove-btn').click();

    // Open dropdown
    await page.locator('#add-city-btn').click();

    const dropdown = page.locator('#city-dropdown');
    const options = dropdown.locator('option');

    // Should have placeholder + available cities (excluding 4 displayed)
    const count = await options.count();
    expect(count).toBeGreaterThan(1);
  });

  test('selecting city from dropdown adds new clock', async ({ page }) => {
    await page.goto('/');

    // Remove a city first
    await page.locator('.clock-card').first().locator('.remove-btn').click();
    await expect(page.locator('.clock-card')).toHaveCount(4);

    // Add a new city
    await page.locator('#add-city-btn').click();
    const dropdown = page.locator('#city-dropdown');

    // Select the first available city option (not the placeholder)
    await dropdown.selectOption({ index: 1 });

    // Should now have 5 clocks again
    await expect(page.locator('.clock-card')).toHaveCount(5);
  });

  test('remove button removes clock', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.clock-card')).toHaveCount(5);

    // Click remove on first clock
    const removeBtn = page.locator('.clock-card').first().locator('.remove-btn');
    await removeBtn.click();

    await expect(page.locator('.clock-card')).toHaveCount(4);
  });

  test('preferences persist after page reload', async ({ page }) => {
    await page.goto('/');

    // Remove New York (first clock)
    const newYorkClock = page.locator('.clock-card', { has: page.locator('.city-name', { hasText: 'New York' }) });
    await newYorkClock.locator('.remove-btn').click();

    // Verify New York is removed
    await expect(page.locator('.city-name', { hasText: 'New York' })).not.toBeVisible();
    await expect(page.locator('.clock-card')).toHaveCount(4);

    // Reload page
    await page.reload();

    // Should still have 4 clocks and no New York
    await expect(page.locator('.clock-card')).toHaveCount(4);
    await expect(page.locator('.city-name', { hasText: 'New York' })).not.toBeVisible();
  });

  test('add button becomes enabled after removing a clock', async ({ page }) => {
    await page.goto('/');

    const addBtn = page.locator('#add-city-btn');
    await expect(addBtn).toBeDisabled();

    // Remove a clock
    await page.locator('.clock-card').first().locator('.remove-btn').click();

    // Add button should now be enabled
    await expect(addBtn).toBeEnabled();
  });

  test('cannot add more than 5 clocks', async ({ page }) => {
    await page.goto('/');

    // Should have exactly 5 clocks
    await expect(page.locator('.clock-card')).toHaveCount(5);

    // Add button should be disabled
    const addBtn = page.locator('#add-city-btn');
    await expect(addBtn).toBeDisabled();
  });

  test('header displays World Clocks title', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header h1');
    await expect(header).toHaveText('World Clocks');
  });

  test('clock face SVG elements are present', async ({ page }) => {
    await page.goto('/');

    const firstClock = page.locator('.clock-card').first();
    await expect(firstClock.locator('.clock-svg')).toBeVisible();
    await expect(firstClock.locator('.clock-circle')).toBeVisible();
    await expect(firstClock.locator('.center-dot')).toBeVisible();
  });

});

test.describe('Responsive Layout', () => {

  test('mobile viewport shows single column layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    const container = page.locator('.clock-container');
    await expect(container).toBeVisible();

    // Clocks should still be visible
    await expect(page.locator('.clock-card')).toHaveCount(5);
  });

  test('tablet viewport shows multi-column layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');

    await expect(page.locator('.clock-card')).toHaveCount(5);
  });

  test('desktop viewport shows full layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('.clock-card')).toHaveCount(5);
  });

});

test.describe('Timezone Accuracy', () => {

  test('different cities show different times', async ({ page }) => {
    await page.goto('/');

    const digitalTimes = await page.locator('.digital-time').allTextContents();

    // With 5 different timezones, we should have at least some different times
    const uniqueTimes = new Set(digitalTimes);
    // There might be some overlap, but should have at least 2 different times
    expect(uniqueTimes.size).toBeGreaterThanOrEqual(2);
  });

});
