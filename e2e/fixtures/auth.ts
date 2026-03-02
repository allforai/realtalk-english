import { test as base } from '@playwright/test';

type AuthFixtures = {
  authToken: string;
  adminToken: string;
};

export const test = base.extend<AuthFixtures>({
  authToken: async ({ request }, use) => {
    const response = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'alex.chen@realtalk-demo.com', password: 'demo123' },
    });
    const { access_token } = await response.json();
    await use(access_token);
  },
  adminToken: async ({ request }, use) => {
    const response = await request.post('http://localhost:4000/api/v1/auth/login', {
      data: { email: 'olivia.jiang@realtalk-demo.com', password: 'demo123' },
    });
    const { access_token } = await response.json();
    await use(access_token);
  },
});

export { expect } from '@playwright/test';
