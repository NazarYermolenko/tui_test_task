import { expect } from "@playwright/test";
import { BasePage } from "@base/pages/BasePage";
import type { ILoadable } from "@base/pages/ILoadable";
import { ChildrenAgeSelectorComponent } from "@pages/main/components/search_panel/rooms_and_guests/ChildrenAgeSelectorComponent";
import type { IClosable } from "@base/pages/IClosable";
import { Step } from "@logger/Step";

export class RoomsAndGuestsSelectorComponent extends BasePage implements ILoadable, IClosable {
    locators = {
        wrapper: () => this.page.locator('section[aria-label="room and guest"]'),
        adultsCountSelector: () => this.locators.wrapper().locator('.AdultSelector__adultSelector select'),
        childrenCountSelector: () => this.locators.wrapper().locator('.ChildrenSelector__childrenSelector select'),
        childrenAgeSelector: () => this.locators.wrapper().locator('.ChildrenAge__ageSelectWrapper').locator('select'),
        saveButton: () => this.locators.wrapper().locator('span button').filter({ hasText: "Opslaan" })
    }

    @Step('Load')
    async waitForLoad(): Promise<this> {
        await expect(this.locators.wrapper()).toBeVisible();
        return this;
    }

    @Step('Wait for close')
    async waitForClose(): Promise<void> {
        await expect(this.locators.wrapper()).toBeHidden();
    }

    @Step('Adults: {0}')
    async setAdultsCount(expectedAdultsCount: number) {
        await this.locators.adultsCountSelector().selectOption(expectedAdultsCount.toString());
    }

    @Step('Children: {0}')
    async setChildrenCount(expectedChildrenCount: number) {
        await this.locators.childrenCountSelector().selectOption(expectedChildrenCount.toString());
    }

    @Step('Get age selectors')
    async getChildrenAgeSelectors(): Promise<ChildrenAgeSelectorComponent[]> {
        return Promise.all((await this.locators.childrenAgeSelector().all()).map((locator) => new ChildrenAgeSelectorComponent(() => locator)))
    }


    @Step('Save')
    async clickSave() {
        await this.locators.saveButton().click();
    }

}
