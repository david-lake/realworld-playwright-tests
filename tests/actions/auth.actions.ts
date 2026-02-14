import { Page } from '@playwright/test';

export class AuthActions {
  constructor(private page: Page) {}

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.page.getByPlaceholder('Email').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByPlaceholder('Password').fill(password);
  }

  async clickSignIn() {
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }
}
