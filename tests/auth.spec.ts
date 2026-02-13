import { test } from '@fixtures/app.fixture';
import { expect } from '@playwright/test';
import { generateUser } from '@data/users';

test('user can login with valid credentials', async ({ app, page }) => {
  const user = generateUser();

  // Register first (since we need a user to exist)
  await app.auth.gotoRegister();
  
  // Debug: check we're on the register page
  await expect(page).toHaveURL('/register');
  
  // Fill in the form
  await page.getByPlaceholder('Username').fill(user.username);
  await page.getByPlaceholder('Email').fill(user.email);
  await page.getByPlaceholder('Password').fill(user.password);
  
  // Click sign up and wait for navigation
  await Promise.all([
    page.waitForURL('/', { timeout: 10000 }),
    page.getByRole('button', { name: 'Sign up' }).click(),
  ]);

  // Verify logged in state
  await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
});
