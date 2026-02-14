import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  emailInput = () => this.page.getByPlaceholder('Email');
  passwordInput = () => this.page.getByPlaceholder('Password');
  signInButton = () => this.page.getByRole('button', { name: 'Sign in' });
  heading = () => this.page.getByRole('heading', { name: 'Sign in' });

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput().fill(password);
  }

  async clickSignIn() {
    await this.signInButton().click();
  }
}
