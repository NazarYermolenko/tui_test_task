import { BasePage } from "@base/pages/BasePage";
import { HolidayDetailsPage } from "@pages/search/search_result_details/holiday_details/HolidayDetailsPage";
import { Step } from "@logger/Step";

export class HotelDetailsPricePanel extends BasePage {
    locators = {
        wrapper: () => this.page.locator(".ProgressbarNavigation__pricePanelWrapper"),
        summaryButton: () => this.locators.wrapper().locator('.ProgressbarNavigation__summaryButton').filter({ visible: true }),

    }

    @Step('Clicking summary button')
    async clickSummary() {
        const button = this.locators.summaryButton()
        await button.click()
        await button.waitFor({ state: 'hidden' })
        return new HolidayDetailsPage(this.page).waitForLoad()
    }
}