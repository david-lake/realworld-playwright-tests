import { test as base } from '@playwright/test';
import { App } from '@actions/app';

type AppFixture = {
  app: App;
};

export const test = base.extend<AppFixture>({
  app: async ({ page }, use) => {
    await use(new App(page));
  },
});
