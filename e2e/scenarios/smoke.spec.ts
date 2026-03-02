import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('mock server health check', async ({ request }) => {
    const response = await request.get('http://localhost:4000/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('admin web loads login page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/RealTalk/i);
  });
});
