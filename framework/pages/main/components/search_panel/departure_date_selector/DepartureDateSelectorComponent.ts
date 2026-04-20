import { expect } from '@playwright/test';
import { BasePage } from '@base/pages/BasePage';
import type { ILoadable } from '@base/pages/ILoadable';
import { Step } from '@logger/Step';

export class DepartureDateSelectorComponent extends BasePage implements ILoadable {
  locators = {
    wrapper: () => this.page.locator('section[aria-label="Departure date"]'),
    nextMonthButton: () => this.locators.wrapper().locator('.SelectLegacyDate__monthNavigator').nth(1),
    days: () => this.locators.wrapper().locator('.SelectLegacyDate__available'),
    saveButton: () => this.locators.wrapper().locator('.DropModal__apply'),
  };

  @Step('Get available')
  async getAvailableDays() {
    const availableDays = (await this.locators.days().allTextContents()).map((day) => day.trim());
    return availableDays;
  }

  @Step('Set {0}')
  async setAvailableDay(day: string) {
    await this.locators
      .days()
      .filter({ hasText: new RegExp(`^${day}$`) })
      .click();
  }

  @Step('Next month')
  async clickNextMonth() {
    await this.locators.nextMonthButton().click();
  }

  @Step('Save')
  async clickSave() {
    await this.locators.saveButton().click();
  }

  @Step('Load')
  async waitForLoad(): Promise<this> {
    await expect(this.locators.wrapper()).toBeVisible();
    await expect(this.locators.days().first()).toBeVisible();
    return this;
  }
}
