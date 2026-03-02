import { test, expect } from '@playwright/test';

test.describe('Scenarios API', () => {
  test('list published scenarios', async ({ request }) => {
    const response = await request.get('http://localhost:4000/api/v1/scenarios');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.items).toBeDefined();
    expect(body.items.length).toBeGreaterThan(0);
    // All returned should be published
    for (const item of body.items) {
      expect(item.status).toBe('published');
    }
  });

  test('get scenario detail', async ({ request }) => {
    const response = await request.get('http://localhost:4000/api/v1/scenarios/sc-001');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBe('sc-001');
    expect(body.dialogue_nodes).toBeDefined();
  });
});
