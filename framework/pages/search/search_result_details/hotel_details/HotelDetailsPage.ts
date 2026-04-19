import { BasePage } from "@base/pages/BasePage";
import { HotelDetailsPricePanel } from "@pages/search/search_result_details/hotel_details/components/HotelDetailsPricePanel";
import type { ILoadable } from "@base/pages/ILoadable";
import { Step } from "@logger/Step";
import { expect } from "@playwright/test";

export class HotelDetailsPage extends BasePage implements ILoadable {
    get pricePanel() {
        return new HotelDetailsPricePanel(this.page)
    }

    @Step('Load')
    async waitForLoad() {
        await this.page.waitForLoadState('domcontentloaded')
        await expect(this.pricePanel.locators.wrapper()).toBeVisible({ timeout: 15000 })
        return this
    }



}