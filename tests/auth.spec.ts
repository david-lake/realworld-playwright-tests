import { test } from '@fixtures/app.fixture';
import { expect } from '@playwright/test';
import { generateUser } from '@data/users';

test('user can login with valid credentials', async ({ app, page }) => {
  // Generate a unique user
  const user = generateUser();

  // Setup response handler before navigating
  let signupResponse: any = null;
  page.on('response', async response => {
    if (response.url().includes('/api') && response.request().method() === 'POST') {
      try {
        signupResponse = await response.json();
      } catch (e) {
        // Ignore non-JSON responses
      }
    }
  });

  // Navigate to register page
  await page.goto('/register');
  await expect(page.getByPlaceholder('Username')).toBeVisible();

  // Fill the form
  await page.getByPlaceholder('Username').fill(user.username);
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);

  // Submit form
  await page.getByRole('button', { name: 'Sign up' }).click();

  // Wait for response to be captured
  await page.waitForTimeout(2000);

  // Verify signup was successful
  expect(signupResponse).not.toBeNull();
  expect(signupResponse.data.signup.token).toBeDefined();

  // Navigate to home page and wait for it to load
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Debug: check localStorage for token
  const token = await page.evaluate(() => localStorage.getItem('token'));
  console.log('Token in localStorage:', token ? 'present' : 'missing');

  // Debug: check what page we're on
  console.log('Current URL:', page.url());
  const links = await page.getByRole('link').allTextContents();
  console.log('Visible links:', links);

  // Verify logged in state by checking for Settings link
  await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
});
