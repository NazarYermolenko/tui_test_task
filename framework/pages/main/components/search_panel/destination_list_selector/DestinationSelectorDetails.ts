import { expect } from "@playwright/test";
import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { Step } from "@logger/Step";

export class DestinationSelectorDetails extends BasePage implements ILoadable {
    locators = {
        wrapper: () => this.page.locator('section[aria-label="destinations"]'),
        selectAllCheckbox: () => this.locators.wrapper().locator('label[role="checkbox"]', { hasText: '(ALLES)' }),
        saveButton: () => this.locators.wrapper().locator('button.DropModal__apply')
    }

    @Step('Load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.wrapper()).toBeVisible();
        await expect(this.locators.saveButton()).toBeVisible();
        return this;
    }

    @Step('Select all')
    async selectAll() {
        await this.locators.selectAllCheckbox().click();
    }

    @Step('Save')
    async clickSave() {
        await this.locators.saveButton().click();
    }
}