import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login with valid credentials', async ({ request }) => {
    const response = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: 'alex.chen@realtalk-demo.com',
        password: 'demo123',
      },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.access_token).toBeDefined();
    expect(body.token_type).toBe('bearer');
  });

  test('login with invalid credentials returns 401', async ({ request }) => {
    const response = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: {
        email: 'invalid@example.com',
        password: 'wrong',
      },
    });
    expect(response.status()).toBe(401);
  });
});
