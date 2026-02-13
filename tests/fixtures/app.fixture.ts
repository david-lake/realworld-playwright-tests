import { test as base } from '@playwright/test';
import { App } from '@actions/app';
import { createTestUser, cleanupTestUser, TestUserInput } from '../utils/db';
import { User } from '../data/users';

type AppFixture = {
  app: App;
  createUser: (input: TestUserInput) => Promise<User>;
  cleanupUser: (email: string) => Promise<void>;
};

export const test = base.extend<AppFixture>({
  app: async ({ page }, use) => {
    await use(new App(page));
  },
  createUser: async ({}, use) => {
    await use(createTestUser);
  },
  cleanupUser: async ({}, use) => {
    await use(cleanupTestUser);
  },
});
