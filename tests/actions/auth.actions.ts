import { Page } from '@playwright/test';

export class AuthActions {
  constructor(private page: Page) {}

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
}
