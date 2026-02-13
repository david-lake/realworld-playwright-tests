import { Page } from '@playwright/test';
import { AuthActions } from '@actions/auth.actions';

export class App {
  auth: AuthActions;

  constructor(page: Page) {
    this.auth = new AuthActions(page);
  }
}
