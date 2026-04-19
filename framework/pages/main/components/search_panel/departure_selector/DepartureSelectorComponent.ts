import { expect } from "@playwright/test";
import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { Step } from "@logger/Step";

export class DepartureSelectorComponent extends BasePage implements ILoadable {

    locators = {
        airportDropdownWrapper: () => this.page.locator('section[aria-label="airports"]'),
        airportWrapperLocator: () => this.locators.airportDropdownWrapper().locator('.SelectAirports__childrenGroup label'),
        saveButton: () => this.locators.airportDropdownWrapper().locator('button', { hasText: 'Opslaan' })
    }

    @Step('Load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.airportDropdownWrapper()).toBeVisible()
        await expect(this.locators.airportWrapperLocator().first()).toBeVisible()
        return this
    }

    @Step('Get list')
    async getAirports(): Promise<string[]> {
        return this.locators.airportWrapperLocator().allTextContents()
    }

    @Step('Select {0}')
    async selectAirportByName(airportName: string) {
        await this.locators.airportWrapperLocator()
            .filter({ hasText: airportName }).click()
    }

    @Step('Save')
    async clickSave() {
        await this.locators.saveButton().click()
        return this.waitForClose()
    }

    @Step('Wait for close')
    async waitForClose(): Promise<void> {
        await expect(this.locators.airportDropdownWrapper()).toBeHidden()
    }
}