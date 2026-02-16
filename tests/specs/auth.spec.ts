import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { AuthActions } from '@/tests/actions/auth.actions';
import { users } from '@/tests/data/users';

const prisma = new PrismaClient();

test.describe('Authentication', () => {
  test.beforeEach(async () => {
    // Clean up any existing user from previous failed runs
    await prisma.user.deleteMany({ where: { email: users.valid.email } });
  });

  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: users.valid.email } });
  });

  test('user can login with valid credentials', async ({ page }) => {
    const auth = new AuthActions(page);

    // Create test user
    const hashedPassword = await bcrypt.hash(users.valid.password, 10);
    await prisma.user.create({
      data: {
        username: users.valid.username,
        email: users.valid.email,
        password: hashedPassword,
      },
    });

    // Navigate to login and sign in
    await auth.gotoLogin();
    await auth.login(users.valid.email, users.valid.password);

    // Wait for navigation and verify successful login
    await expect(page).toHaveURL('/', { timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  });
});
