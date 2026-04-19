import { DynamicComponent } from "@base/dynamic_components/DynamicComponent";
import { Step } from "@logger/Step";
import { HotelDetailsPage } from "@pages/search/search_result_details/hotel_details/HotelDetailsPage";

export class ResultItem extends DynamicComponent {
    locators = {
        continueButton: () => this.wrapper().locator('button[data-test-id="continue-button"]').filter({ visible: true }),
        hotelName: () => this.wrapper().locator('a[data-test-id="hotel-name"]')
    }

    @Step(async o => `Clicking continue button for hotel "${await o.getHotelName()}"`)
    async clickContinue() {
        const button = this.locators.continueButton()
        await button.click()
        await button.waitFor({ state: 'hidden' })
        return new HotelDetailsPage(this.wrapper().page()).waitForLoad()
    }

    @Step('Getting hotel name from ResultItem')
    async getHotelName() {
        return (await this.locators.hotelName().textContent())?.trim() || 'Unknown Hotel'
    }

}