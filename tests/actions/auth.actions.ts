import { Page } from '@playwright/test';
import { LoginPage } from '@/tests/pages/login.page';

export class AuthActions {
  private loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }

  async gotoLogin() {
    await this.loginPage.goto();
  }

  async login(email: string, password: string) {
    await this.loginPage.fillEmail(email);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSignIn();
  }
}
