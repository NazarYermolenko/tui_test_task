import { expect } from "@playwright/test";
import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { Step } from "@logger/Step";

export class DepartureDateSelectorComponent extends BasePage implements ILoadable {

    locators = {
        wrapper: () => this.page.locator('section[aria-label="Departure date"]'),
        nextMonthButton: () => this.locators.wrapper().locator('.SelectLegacyDate__monthNavigator').nth(1),
        days: () => this.locators.wrapper().locator('.SelectLegacyDate__available'),
        saveButton: () => this.locators.wrapper().locator('.DropModal__apply')
    }

    @Step('Getting available days')
    async getAvailableDays() {
        const availableDays = (await this.locators.days().allTextContents()).map(day => day.trim())
        return availableDays
    }

    @Step('Setting available day')
    async setAvailableDay(day: string) {
        await this.locators.days().filter({ hasText: new RegExp(`^${day}$`) }).click()
    }

    @Step('Clicking next month button')
    async clickNextMonth() {
        await this.locators.nextMonthButton().click()
    }

    @Step('Clicking save button')
    async clickSave() {
        await this.locators.saveButton().click()
    }

    @Step('Waiting for DepartureDateSelectorComponent to load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.wrapper()).toBeVisible()
        await expect(this.locators.days().first()).toBeVisible()
        return this
    }

}