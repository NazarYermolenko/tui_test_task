import { expect } from "@playwright/test";
import { BasePage } from "../../../../../base/pages/BasePage";
import type { ILoadable } from "../../../../../base/pages/ILoadable";
import { ChildrenAgeSelector } from "./ChildrenAgeSelector";
import type { IClosable } from "../../../../../base/pages/IClosable";
import { Step } from "../../../../../logger/StepDecorator";

export class RoomsAndGuestsSelector extends BasePage implements ILoadable, IClosable {
    locators = {
        wrapper: () => this.page.locator('section[aria-label="room and guest"]'),
        adultsCountSelector: () => this.locators.wrapper().locator('.AdultSelector__adultSelector select'),
        childrenCountSelector: () => this.locators.wrapper().locator('.ChildrenSelector__childrenSelector select'),
        childrenAgeSelector: () => this.locators.wrapper().locator('.ChildrenAge__ageSelectWrapper').locator('select'),
        saveButton: () => this.locators.wrapper().locator('span button').filter({ hasText: "Opslaan" })
    }

    @Step('Waiting for RoomsAndGuestsComponent to load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.wrapper()).toBeVisible();
        return this;
    }

    @Step('Waiting for RoomsAndGuestsComponent to close')
    async waitForClose(): Promise<void> {
        await expect(this.locators.wrapper()).toBeHidden();
    }

    @Step('Setting adults count')
    async setAdultsCount(expectedAdultsCount: number) {
        await this.locators.adultsCountSelector().selectOption(expectedAdultsCount.toString());
    }

    @Step('Setting children count')
    async setChildrenCount(expectedChildrenCount: number) {
        await this.locators.childrenCountSelector().selectOption(expectedChildrenCount.toString());
    }

    @Step('Getting children age selectors')
    async getChildrenAgeSelectors(): Promise<ChildrenAgeSelector[]> {
        return Promise.all((await this.locators.childrenAgeSelector().all()).map((locator) => new ChildrenAgeSelector(() => locator)))
    }


    @Step('Clicking save button on RoomsAndGuestsSelector')
    async clickSave() {
        await this.locators.saveButton().click();
    }

}
