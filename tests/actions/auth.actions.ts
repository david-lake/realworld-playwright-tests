import { Page, expect } from '@playwright/test';
import { User } from '@data/users';

export class AuthActions {
  constructor(private page: Page) {}

  async gotoLogin() {
    await this.page.goto('/login');
  }

  async gotoRegister() {
    await this.page.goto('/register');
  }

  async login(user: { email: string; password: string }) {
    await this.page.getByPlaceholder('Email').fill(user.email);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async register(user: User) {
    await this.page.getByPlaceholder('Username').fill(user.username);
    await this.page.getByPlaceholder('Email').fill(user.email);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Sign up' }).click();
  }
}
