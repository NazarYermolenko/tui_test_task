import { expect } from "@playwright/test";
import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { DestinationSelectorDetails } from "@pages/main/components/search_panel/destination_list_selector/DestinationSelectorDetails";
import { Step } from "@logger/Step";

export class DestinationListSelectorComponent extends BasePage implements ILoadable {

    locators = {
        componentWrapper: () => this.page.locator('section[aria-label="destinations"]'),
        availableDestinations: () => this.locators.componentWrapper().locator('.DestinationsList__link')

    }

    @Step('Waiting for DestinationListSelector to load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.componentWrapper()).toBeVisible()
        await expect(this.locators.availableDestinations().first()).toBeVisible()
        return this
    }

    @Step('Getting available destinations')
    async getAvailableDestinations() {
        return this.locators.availableDestinations()
            .filter({ hasNot: this.page.locator('.DestinationsList__disabled') })
            .allTextContents()
    }

    @Step('Selecting destination by name: {destinationName}')
    async selectDestinationByName(destinationName: string) {
        await this.locators.availableDestinations()
            .filter({ hasText: destinationName })
            .click()
        return new DestinationSelectorDetails(this.page)
    }

}