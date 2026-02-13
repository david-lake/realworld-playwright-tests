import { test } from '@fixtures/app.fixture';
import { expect } from '@playwright/test';
import { generateUser } from '@data/users';

test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ app, page, createUser, cleanupUser }) => {
    // Setup: Create user directly in database
    const testUser = generateUser();
    const user = await createUser(testUser);

    // Capture network requests
    const requests: string[] = [];
    page.on('request', req => {
      if (req.url().includes('/api')) {
        requests.push(req.url());
      }
    });

    try {
      // Navigate to login page
      await app.auth.gotoLogin();
      await expect(page.getByPlaceholder('Email')).toBeVisible();

      // Login via UI
      await app.auth.login(user);

      // Wait for login response
      await page.waitForResponse(res =>
        res.url().includes('/api') && res.request().method() === 'POST'
      );

      console.log('Requests after login:', requests);
      requests.length = 0;

      // Wait for token to be stored
      await page.waitForFunction(() => {
        const t = localStorage.getItem('token');
        return t && t.length > 10;
      });

      console.log('Token exists, reloading...');

      // Reload the page so Apollo Client picks up the token on init
      await page.reload();
      await page.waitForTimeout(3000);

      console.log('Requests after reload:', requests);

      // Verify logged in state
      await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    } finally {
      // Cleanup: Remove test user from database
      await cleanupUser(user.email);
    }
  });
});
