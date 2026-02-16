import { test, expect } from '@playwright/test';
import { AuthActions } from '../actions/auth.actions';

test('user can login with valid credentials', async ({ page }) => {
  const auth = new AuthActions(page);

  // Navigate to login
  await auth.gotoLogin();
  
  // Wait for form to be ready
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  
  // Login with test credentials (user should already exist in DB)
  await auth.login('test@example.com', 'password123');

  // Wait for navigation and verify successful login
  await expect(page).toHaveURL('/', { timeout: 10000 });
  await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
});
