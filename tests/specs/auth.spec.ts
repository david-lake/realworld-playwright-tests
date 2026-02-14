import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthActions } from '@/tests/actions/auth.actions';
import { users } from '@/tests/data/users';

const prisma = new PrismaClient();

test.describe('Authentication', () => {
  test.afterEach(async () => {
    await prisma.user.deleteMany({ where: { email: users.valid.email } });
  });

  test('user can login with valid credentials', async ({ page }) => {
    const auth = new AuthActions(page);

    const hashedPassword = await bcrypt.hash(users.valid.password, 10);
    await prisma.user.create({
      data: {
        username: users.valid.username,
        email: users.valid.email,
        password: hashedPassword,
      },
    });

    await auth.gotoLogin();
    await auth.login(users.valid.email, users.valid.password);

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  });
});
