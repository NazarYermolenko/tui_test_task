import { BasePage } from "../../../../base/pages/BasePage";
import { HotelDetailsPricePanel } from "./components/HotelDetailsPricePanel";
import type { ILoadable } from "../../../../base/pages/ILoadable";
import { Step } from "../../../../logger/StepDecorator";
import { expect } from "@playwright/test";

export class HotelDetailsPage extends BasePage implements ILoadable {
    get pricePanel() {
        return new HotelDetailsPricePanel(this.page)
    }

    @Step('Waiting for HotelDetailsPage to load')
    async waitForLoad() {
        await expect(this.pricePanel.locators.wrapper()).toBeVisible()
        return this
    }

}