import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly locators: Record<string, () => Locator> = {};

  constructor(public page: Page) {}
}
