import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser } from './utils/db';

test('login page loads', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('user can fill login form', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  await page.getByPlaceholder('Email').fill('test@example.com');
  await page.getByPlaceholder('Password').fill('password123');
  
  await expect(page.getByPlaceholder('Email')).toHaveValue('test@example.com');
  await expect(page.getByPlaceholder('Password')).toHaveValue('password123');
});

test('user can login with valid credentials', async ({ page }) => {
  // Setup: Create test user in database
  const user = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };
  
  await createTestUser(user);
  
  try {
    await page.goto('http://localhost:3000/login');
    
    // Fill and submit form
    await page.getByPlaceholder('Email').fill(user.email);
    await page.getByPlaceholder('Password').fill(user.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Verify redirect to home page
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Verify logged in state (Settings link visible)
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  } finally {
    // Cleanup: Delete test user
    await deleteTestUser(user.email);
  }
});
